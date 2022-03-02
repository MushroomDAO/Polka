"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Swarm_1 = __importDefault(require("./Swarm"));
const Gossip_1 = __importDefault(require("./Gossip"));
const events_1 = __importDefault(require("events"));
const util_1 = __importDefault(require("util"));
const logger_1 = __importDefault(require("../logger"));
util_1.default.inherits(Pubsub, events_1.default);
function Pubsub(topic, opts) {
    if (!(this instanceof Pubsub)) {
        // @ts-ignore
        return new Pubsub(topic, opts);
    }
    if (!topic) {
        throw new Error("a topic must be set");
    }
    if (typeof topic !== "string") {
        throw new Error("topic must be a string");
    }
    opts = opts || {};
    opts.port = opts.port || 0;
    events_1.default.call(this);
    this.gossip = (0, Gossip_1.default)(opts.gossip);
    this.id = this.gossip.keys.public;
    this.swarm = (0, Swarm_1.default)();
    this.swarm.join(topic);
    var firstConn = false;
    var self = this;
    this.swarm.on("connection", function (connection) {
        (0, logger_1.default)("found + connected to peer");
        self.emit("connected", connection);
        var g = self.gossip.createPeerStream();
        connection.pipe(g).pipe(connection);
        if (!firstConn && this.connections.length === 1) {
            firstConn = true;
            // self.emit("connected");
        }
    });
    this.swarm.on("connection-closed", function (connection) {
        (0, logger_1.default)("DID THIS GET HIT");
        self.emit("connection-closed", connection);
    });
    // TODO: fire event when you have no peers left
    // ...
    this.swarm.listen(opts.port);
    this.gossip.on("message", function (msg) {
        self.emit("message", msg);
    });
    this.publish = function (msg) {
        self.gossip.publish(msg);
    };
}
exports.default = Pubsub;
//# sourceMappingURL=pubsub.js.map