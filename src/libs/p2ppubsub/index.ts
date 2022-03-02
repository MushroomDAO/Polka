import LOGBRO from "../logger";
import pubsub from "./pubsub";

interface Message {
	contentHash: string;
	content: string;
	type: string;
	userId: string;
	timestamp: string;
}

class Pubsub {
	// constructor(frequency: string = "polka") {
	// 	this.subscribe(frequency);
	// }
	frequencies: { [frequency: string]: any } = {};

	subscribe(frequency: string): any {
		LOGBRO("[Subscribing] ", frequency);
		const swarm = pubsub(frequency);

		if (!this.frequencies[frequency]) {
			this.frequencies[frequency] = swarm;
		}

		return swarm;
	}

	publish(frequency: string, message: string) {
		LOGBRO("[Publishing] -> ", frequency, message);
		const swarm = this.frequencies[frequency];
		if (!swarm) {
			LOGBRO("Could not find swarm for that frequency");
			return;
		}

		const data = {
			content: message,
			type: "string",
			userId: swarm.id,
			timestamp: +new Date().getTime(),
		};

		swarm.publish(data);

		return data;
	}
}

export default Pubsub;
