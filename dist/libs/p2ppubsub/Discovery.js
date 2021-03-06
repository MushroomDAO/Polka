"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dns_discovery_1 = __importDefault(require("dns-discovery"));
const bittorrent_dht_1 = __importDefault(require("bittorrent-dht"));
const thunky_1 = __importDefault(require("thunky"));
const crypto_1 = __importDefault(require("crypto"));
const events_1 = __importDefault(require("events"));
const util_1 = __importDefault(require("util"));
const debug_1 = __importDefault(require("debug"));
const pretty_hash_1 = __importDefault(require("pretty-hash"));
const buffer_from_1 = __importDefault(require("buffer-from"));
exports.default = Discovery;
function Discovery(opts) {
    // @ts-ignore
    if (!(this instanceof Discovery))
        return new Discovery(opts);
    if (!opts)
        opts = {};
    var self = this;
    this.dht = opts.dht === false ? null : new bittorrent_dht_1.default(opts.dht);
    this.dns = opts.dns === false ? null : (0, dns_discovery_1.default)(opts.dns);
    if (this.dns) {
        this.dns.on("peer", ondnspeer);
        this.dns.on("error", onwarn); // warn for dns errors as they are non critical
        this.dns.on("warn", onwarn);
    }
    if (this.dht) {
        this.dht.on("peer", ondhtpeer);
        this.dht.on("error", onerror);
        this.dht.on("warn", onwarn);
    }
    this.destroyed = false;
    this.me = { host: null, port: 0 };
    this._hash = opts.hash || (opts.hash === false ? noHash : sha1); // bt dht uses sha1 so we'll default to that
    this._dhtInterval = opts.dht && opts.dht.interval;
    this._dnsInterval = opts.dns && opts.dns.interval;
    this._announcing = {};
    this._unhash = {};
    this._whoami = this.dns && this.dns.whoami && (0, thunky_1.default)(whoami);
    if (this._whoami) {
        this._whoami();
    }
    else {
        (0, debug_1.default)("not running a whoami() - dns discovery was not enabled");
    }
    events_1.default.EventEmitter.call(this);
    function whoami(cb) {
        (0, debug_1.default)("whoami() started");
        self.dns.whoami(function (_, me) {
            if (me) {
                (0, debug_1.default)("whoami() succeeded, I am:", me);
                self.me = me;
                self.emit("whoami", me);
            }
            else {
                (0, debug_1.default)("whoami() failed");
            }
            cb();
        });
    }
    function ondhtpeer(peer, infoHash, via) {
        if (self.destroyed)
            return;
        var id = self._unhash[infoHash.toString("hex")];
        if (via)
            (0, debug_1.default)("chan=%s dht discovery peer=%s:%s via=%s:%s", (0, pretty_hash_1.default)(id), peer.host, peer.port, via.host || via.address, via.port);
        else
            (0, debug_1.default)("chan=%s dht discovery peer=%s:%s", (0, pretty_hash_1.default)(id), peer.host, peer.port);
        if (id)
            self.emit("peer", id, peer, "dht");
    }
    function ondnspeer(name, peer) {
        if (self.destroyed)
            return;
        var id = self._unhash[name];
        (0, debug_1.default)("chan=%s dns discovery peer=%s:%s", (0, pretty_hash_1.default)(id), peer.host, peer.port);
        if (id)
            self.emit("peer", id, peer, "dns");
    }
    function onwarn(err) {
        self.emit("warn", err);
    }
    function onerror(err) {
        self.emit("error", err);
    }
}
util_1.default.inherits(Discovery, events_1.default.EventEmitter);
Discovery.prototype.join = function (id, port, opts, cb) {
    if (this.destroyed)
        return;
    if (typeof id === "string")
        id = (0, buffer_from_1.default)(id);
    if (typeof opts === "function") {
        cb = opts;
        opts = {};
    }
    if (!opts)
        opts = {};
    if (!cb)
        cb = function () { };
    var announcing = typeof port === "number";
    if (!port)
        port = 0;
    var self = this;
    var name = id.toString("hex");
    var key = name + ":" + port;
    var hash = this._hash(id);
    if (hash.length > 20)
        hash = hash.slice(0, 20); // truncate hash so it fits in the dht
    var hashHex = hash.toString("hex");
    var dnsTimeout = null;
    var dhtTimeout = null;
    var destroyed = false;
    var publicPort = 0;
    var skipMulticast = false;
    if (this._announcing[key])
        return;
    (0, debug_1.default)("chan=%s join()", (0, pretty_hash_1.default)(id));
    this._unhash[hashHex] = id;
    this._announcing[key] = {
        id: id,
        port: port,
        destroy: destroy,
    };
    var pending = 0;
    var firstQueryDone = false;
    var error = null;
    var succeded = false;
    if (!opts.impliedPort || !this._whoami)
        return ready();
    // do a multicast only query immediately.
    // multicast has no way to know if there will definitively be no replies
    // so you can assume if you get no mdns responses by the time the first
    // dns/dht responses come back then there are probably no mdns peers online
    if (this.dns) {
        if (announcing)
            this.dns.announce(hashHex, port, { server: false });
        else
            this.dns.lookup(hashHex, { server: false });
    }
    this._whoami(function () {
        if (destroyed)
            return;
        if (self.me && self.me.port)
            publicPort = self.me.port;
        // since we already did it, skip multicast on the first call
        skipMulticast = true;
        ready();
    });
    function queryDone(err) {
        if (firstQueryDone)
            return;
        if (err)
            error = err;
        else
            succeded = true;
        if (--pending > 0)
            return;
        firstQueryDone = true;
        self.emit("query-done", true);
        cb(succeded ? null : error);
    }
    function ready() {
        if (self.dns) {
            pending++;
            dns();
        }
        if (self.dht) {
            pending++;
            dht();
        }
    }
    function destroy() {
        destroyed = true;
        clearTimeout(dnsTimeout);
        clearTimeout(dhtTimeout);
        delete self._unhash[hashHex];
        if (self.dns)
            self.dns.unannounce(hashHex, port);
    }
    function dns() {
        if (announcing) {
            (0, debug_1.default)("chan=%s dns %s", (0, pretty_hash_1.default)(id), "announce", {
                port: port,
                publicPort: publicPort,
                multicast: !skipMulticast,
            });
            self.dns.announce(hashHex, port, { publicPort: publicPort, multicast: !skipMulticast }, queryDone);
        }
        else {
            (0, debug_1.default)("chan=%s dns %s", (0, pretty_hash_1.default)(id), "lookup");
            self.dns.lookup(hashHex, { multicast: !skipMulticast }, queryDone);
        }
        skipMulticast = false;
        dnsTimeout = setTimeout(dns, self._dnsInterval || (60 * 1000 + Math.random() * 10 * 1000) | 0);
    }
    function dht() {
        (0, debug_1.default)("chan=%s dht %s", (0, pretty_hash_1.default)(id), announcing ? "announce" : "lookup");
        if (announcing)
            self.dht.announce(hash, publicPort || port, queryDone);
        else
            self.dht.lookup(hash, queryDone);
        dhtTimeout = setTimeout(dht, self._dhtInterval || (10 * 60 * 1000 + Math.random() * 5 * 60 * 1000) | 0);
    }
};
Discovery.prototype.leave = function (id, port) {
    if (this.destroyed)
        return;
    if (!port)
        port = 0;
    if (typeof id === "string")
        id = (0, buffer_from_1.default)(id);
    var key = id.toString("hex") + ":" + port;
    if (!this._announcing[key])
        return;
    (0, debug_1.default)("chan=%s leave()", (0, pretty_hash_1.default)(id));
    this._announcing[key].destroy();
    delete this._announcing[key];
};
Discovery.prototype.update = function () {
    var all = this.list();
    for (var i = 0; i < all.length; i++) {
        all[i].destroy();
        this.leave(all[i].id, all[i].port);
        this.join(all[i].id, all[i].port);
    }
};
Discovery.prototype.list = function () {
    var keys = Object.keys(this._announcing);
    var all = new Array(keys.length);
    for (var i = 0; i < keys.length; i++) {
        var ann = this._announcing[keys[i]];
        all[i] = { id: ann.id, port: ann.port };
    }
    return all;
};
Discovery.prototype.destroy = function (cb) {
    if (this.destroyed) {
        if (cb)
            process.nextTick(cb);
        return;
    }
    this.destroyed = true;
    var keys = Object.keys(this._announcing);
    for (var i = 0; i < keys.length; i++)
        this._announcing[keys[i]].destroy();
    this._announcing = {};
    if (cb)
        this.once("close", cb);
    var self = this;
    if (!this.dht)
        ondhtdestroy();
    else
        this.dht.destroy(ondhtdestroy);
    function ondhtdestroy() {
        if (!self.dns)
            ondnsdestroy();
        else
            self.dns.destroy(ondnsdestroy);
    }
    function ondnsdestroy() {
        self.emit("close");
    }
};
function sha1(id) {
    return crypto_1.default.createHash("sha1").update(id).digest();
}
function noHash(id) {
    if (typeof id === "string")
        return (0, buffer_from_1.default)(id);
    return id;
}
//# sourceMappingURL=Discovery.js.map