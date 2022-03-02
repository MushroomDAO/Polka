import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Text } from "ink";

interface ILogMessageProps {
	frequency: string;
	connections: number;
}

const Info: React.FunctionComponent<ILogMessageProps> = ({
	frequency,
	connections,
}: ILogMessageProps) => {
	return (
		<>
			<Box
				display="flex"
				flexDirection="row"

				// justifyContent="space-between"
			>
				<Box
					borderStyle="single"
					borderColor="gray"
					flexGrow={3}
					justifyContent="center"
				>
					<Text color="yellowBright">{`Connected to: #${frequency}`}</Text>
				</Box>
				<Box
					borderStyle="single"
					borderColor="gray"
					flexGrow={1}
					justifyContent="center"
				>
					<Text color="greenBright">{`Connections: ${connections || 0}`}</Text>
				</Box>
			</Box>
		</>
	);
};

export default Info;
