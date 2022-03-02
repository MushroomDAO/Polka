"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const split_1 = __importDefault(require("split"));
const ssb_keys_1 = __importDefault(require("ssb-keys"));
const readable_stream_1 = __importDefault(require("readable-stream"));
const Duplex = readable_stream_1.default.Duplex;
const events_1 = __importDefault(require("events"));
const util_1 = __importDefault(require("util"));
const pumpify_1 = __importDefault(require("pumpify"));
function clone(obj) {
    var _obj = {};
    for (var k in obj) {
        if (Object.hasOwnProperty.call(obj, k))
            _obj[k] = obj[k];
    }
    return _obj;
}
util_1.default.inherits(Gossip, events_1.default);
function Gossip(opts) {
    if (!(this instanceof Gossip)) {
        // @ts-ignore
        return new Gossip(opts);
    }
    opts = opts || {};
    if (!opts.keys) {
        opts.keys = ssb_keys_1.default.generate();
    }
    var interval = opts.interval || 100;
    events_1.default.call(this);
    this.keys = opts.keys;
    this.store = [];
    this.peers = [];
    this.seq = 0;
    this.seqs = {};
    this.interval =
        interval === -1 ? null : setInterval(this.gossip.bind(this), interval);
}
Gossip.prototype.createPeerStream = function () {
    var self = this;
    var stream = new Duplex({
        read: function (n) { },
        write: function (rawChunk, enc, next) {
            try {
                var chunk = JSON.parse(rawChunk);
                if (chunk.public === self.keys.public) {
                    (0, debug_1.default)("got one of my own messages; discarding");
                }
                else if (ssb_keys_1.default.verifyObj(chunk, chunk.data)) {
                    if (self.seqs[chunk.public] === undefined ||
                        self.seqs[chunk.public] < chunk.seq) {
                        self.seqs[chunk.public] = chunk.seq;
                        self.store.push(rawChunk + "\n");
                        (0, debug_1.default)("current seq for", chunk.public, "is", self.seqs[chunk.public]);
                        var copy = clone(chunk.data);
                        // delete copy.signature;
                        self.emit("message", copy, { public: chunk.public });
                    }
                    else {
                        (0, debug_1.default)("old gossip; discarding");
                    }
                }
                else {
                    (0, debug_1.default)("received message with bad signature! discarding");
                }
            }
            catch (e) {
                (0, debug_1.default)("bad json (or end of stream)");
            }
            next();
        },
    });
    stream = (0, pumpify_1.default)((0, split_1.default)(), stream);
    this.peers.push(stream);
    return stream;
};
Gossip.prototype.publish = function (msg) {
    var data = msg;
    msg = {
        data: ssb_keys_1.default.signObj(this.keys, data),
        public: this.keys.public,
        seq: this.seq++,
    };
    this.store.push(JSON.stringify(msg) + "\n");
};
Gossip.prototype.gossip = function () {
    for (var i = 0; i < this.peers.length; i++) {
        for (var j = 0; j < this.store.length; j++) {
            this.peers[i].push(this.store[j]);
        }
    }
    this.store = [];
};
Gossip.prototype.stop = function () {
    if (this.interval) {
        clearInterval(this.interval);
    }
};
exports.default = Gossip;
//# sourceMappingURL=Gossip.js.map