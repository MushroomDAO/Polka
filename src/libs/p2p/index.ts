import LOGBRO from "../logger";
import Hyperswarm from "hyperswarm";

// import pubsub from "pubsub-swarm";

interface Message {
	contentHash: string;
	content: string;
	type: string;
	userId: string;
	timestamp: string;
}

var C;

class Pubsub {
	// constructor(frequency: string = "polka") {
	// 	this.subscribe(frequency);
	// }
	frequencies: { [frequency: string]: any } = {};

	async subscribe(frequency: string, cb: any): Promise<any> {
		LOGBRO("[Subscribing] ", frequency);

		const clientSwarm = new Hyperswarm();
		const serverSwarm = new Hyperswarm();

		serverSwarm.on("connection", (conn, info) => {
			LOGBRO("server connected");
			C = conn;
			if (!this.frequencies[frequency]) {
				this.frequencies[frequency] = conn;
			}

			setTimeout(() => {
				console.log("hittttt");
				const data = {
					content: "pong",
					type: "string",
					userId: "test",
					timestamp: +new Date().getTime(),
				};

				conn.write(JSON.stringify(data));
			}, 10000);
			// swarm1 will receive server connections
			//  setInterval(() => {
			//    conn.write('poop server')
			//   //  conn.end()
			//  }, 2000)
			//  conn.end()
		});

		clientSwarm.on("connection", (conn, info) => {
			LOGBRO("client connected");
			conn.on("data", (data) => {
				console.log("GOT MESSAGED", data);
				cb(frequency, data.toString());
			});
		});

		const topic = Buffer.alloc(32).fill(frequency); // A topic must be 32 bytes

		async function initServer() {
			const discovery = serverSwarm.join(topic, {
				server: true,
				client: false,
			});
			await discovery.flushed(); // Waits for the topic to be fully announced on the DHT
		}

		async function initClient() {
			clientSwarm.join(topic, { server: false, client: true });
			await clientSwarm.flush(); // Waits for the swarm to connect to pending peers.
		}

		await initServer();
		await initClient();
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
			userId: "test",
			timestamp: +new Date().getTime(),
		};

		// swarm.publish(data);
		C.write(JSON.stringify(data));
		// swarm.write("testing");

		return data;
	}
}

export default Pubsub;
