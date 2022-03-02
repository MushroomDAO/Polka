import React from "react";
import { render, Box, Text } from "ink";
import Gradient from "ink-gradient";
import BigText from "ink-big-text";

const Header: React.FunctionComponent = () => {
	return (
		<Box justifyContent="flex-start">
			<Gradient name="pastel">
				<BigText text="Polka" font="block" />
			</Gradient>
		</Box>
	);
};

export default Header;
