import swarm from "./Swarm";
import gossip from "./Gossip";
import EventEmitter from "events";
import util from "util";
import LOGBRO from "../logger";

util.inherits(Pubsub, EventEmitter);

function Pubsub(topic: string, opts?: any) {
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

	EventEmitter.call(this);

	this.gossip = gossip(opts.gossip);

	this.id = this.gossip.keys.public;

	this.swarm = swarm();

	this.swarm.join(topic);

	var firstConn = false;

	var self = this;
	this.swarm.on("connection", function (connection) {
		LOGBRO("found + connected to peer");
		self.emit("connected", connection);
		var g = self.gossip.createPeerStream();
		connection.pipe(g).pipe(connection);

		if (!firstConn && this.connections.length === 1) {
			firstConn = true;
			// self.emit("connected");
		}
	});

	this.swarm.on("connection-closed", function (connection) {
		LOGBRO("DID THIS GET HIT");
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

export default Pubsub;
