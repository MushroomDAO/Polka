import React, { useEffect, useState } from "react";

import { Box, Text } from "ink";
import Header from "./components/Header";
import Table from "./components/Table";
import TextInput from "./components/TextInput";
import Info from "./components/Info";

import { usePubsubProvider } from "./contexts/PubsubProvider";

const App = ({ frequency }: any) => {
	const [message, setMessage] = useState("");
	const { messages, connections, publish, listen } = usePubsubProvider();

	const onChange = (text: string) => {
		setMessage(text);
	};

	const onSubmit = () => {
		// var swarm = pubsub("the-topic");
		publish(frequency, message);
		setMessage("");
	};

	useEffect(() => {
		listen(frequency);
	}, [frequency]);

	return (
		<>
			<Header />
			{/* @ts-ignore */}
			<Info frequency={frequency} connections={connections[frequency]} />
			<Box flexDirection="column">
				<Table messages={messages[frequency]} />
			</Box>
			{/* @ts-ignore */}
			<TextInput value={message} onChange={onChange} onSubmit={onSubmit} />
		</>
	);
};

export default App;
