import React, { useState } from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import InkTextInput from "ink-text-input";

interface ITextInputProps {
	onChange: (string) => string;
	onSubmit: () => void;
	label: string;
	value: string;
}

const TextInput: React.FunctionComponent<ITextInputProps> = ({
	label,
	value,
	onChange,
	onSubmit,
}: ITextInputProps) => {
	const handleChange = (q: string) => {
		onChange(q);
	};

	const handleSubmit = () => {
		onSubmit();
	};

	return (
		<>
			<Box>
				{/* <Box marginRight={2}>
					<Spinner type="dots12" />
				</Box> */}
				<Box marginRight={1}>
					<Text>Enter message: </Text>
				</Box>

				<InkTextInput
					value={value}
					onChange={handleChange}
					onSubmit={handleSubmit}
				/>
			</Box>
		</>
	);
};

export default TextInput;
