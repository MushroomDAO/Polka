import React, { useEffect, useMemo, useState } from "react";
import Table from "ink-table";
import { Box, Text } from "ink";
import { Message } from "../contexts/PubsubProvider";
import moment from "moment";
import ColorHash from "color-hash";

var colorHash = new ColorHash();

const CustomCell = ({ children }: React.PropsWithChildren<{}>) => {
	// @ts-ignore
	const innerText = children.toString().trim();
	const color = innerText.startsWith("#") ? innerText : "gray";
	return (
		// <Box borderStyle="single" borderColor="yellow">
		// @ts-ignore
		<Text color={color}>{children}</Text>
		// </Box>
	);
};

interface Props {
	messages: Message[];
}

const Data = ({ messages }: Props) => {
	if (!messages || messages.length === 0) return null;

	// const mappedData = useMemo(() => {
	// 	const newData = [...messages];
	// 	return newData.map((obj) => {
	// 		return {
	// 			Id: obj.userId,
	// 			Text: obj.content,
	// 		};
	// 	});
	// }, []);

	const mappedMessages = messages.map((message) => {
		return {
			Time: moment(message.timestamp).fromNow(),
			User: colorHash.hex(message.userId),
			Text: message.content,
		};
	});

	return (
		<>
			<Table data={mappedMessages} cell={CustomCell} />
		</>
	);
};

export default Data;
