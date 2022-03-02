import LOGBRO from "../../libs/logger";
import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

import PubSub from "../../libs/p2ppubsub";

const pubsub = new PubSub();

export interface Message {
	content: string;
	type: string;
	userId: string;
	timestamp: number;
	signature: string;
}

export interface PubsubInternalTypes {
	publish: (frequency: string, message: string) => void;
	listen: (frequency: string) => void;
	messages: { [frequency: string]: Message[] };
	connections: { [frequency: string]: number };
}

export const PubsubInternal = createContext<PubsubInternalTypes>({
	publish: (frequency: string, message: string) => null,
	listen: (frequency: string) => null,
	messages: {},
	connections: {},
});

export const PubsubProvider = ({ children }: any) => {
	const [messages, setMessages] = useState({});
	const [connections, setConnections] = useState({});

	useEffect(() => {
		LOGBRO("init provider");
	}, []);

	const onPublish = (frequency: string, message: string) => {
		LOGBRO("[PubsubProvider] Publish: ", message);
		const data = pubsub.publish(frequency, message);
		LOGBRO("data", data);
		onNewMessage(data, frequency);
		return null;
	};

	const onNewMessage = (message: any, frequency: string) => {
		LOGBRO("[PubsubProvider] Message: ", message, frequency);
		setMessages((prevMessages) => {
			const prevFrequencyMessages = prevMessages[frequency] || [];
			return {
				...prevMessages,
				[frequency]: [...prevFrequencyMessages, message],
			};
		});
	};

	const onConnectionClosed = (frequency: string) => {
		setConnections((prevConnections) => {
			const prevFrequencyConnections = prevConnections[frequency] - 1 || 1;
			return {
				...prevConnections,
				[frequency]: prevFrequencyConnections,
			};
		});
	};

	const onNewConnection = (frequency: string) => {
		setConnections((prevConnections) => {
			const prevFrequencyConnections = prevConnections[frequency] + 1 || 1;
			return {
				...prevConnections,
				[frequency]: prevFrequencyConnections,
			};
		});
	};

	const onListen = (frequency: string) => {
		LOGBRO("[PubsubProvider] Listen: ", frequency);
		const swarm: any = pubsub.subscribe(frequency);
		// LOGBRO("swarm", swarm);
		swarm.on("message", (message) => onNewMessage(message, frequency));
		swarm.on("connected", (connection) => onNewConnection(frequency));
		swarm.on("connection-closed", () => onConnectionClosed(frequency));
	};

	LOGBRO("MESSAGES", JSON.stringify(messages), 2);
	LOGBRO("");

	return (
		<PubsubInternal.Provider
			value={{
				publish: onPublish,
				listen: onListen,
				messages,
				connections,
			}}
		>
			{children}
		</PubsubInternal.Provider>
	);
};

export const usePubsubProvider = () => useContext(PubsubInternal);
