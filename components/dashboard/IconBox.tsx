import { Flex, useColorMode } from "@chakra-ui/react";

export default function IconBox({ children }: any) {
	const { colorMode } = useColorMode();
	return (
		<Flex
			align={"center"}
			justify="center"
			h={"35px"}
			w={"35px"}
			bg={colorMode == 'dark' ? "whiteAlpha.200" : "blackAlpha.200"}
			rounded={10}
		>
			{children}
		</Flex>
	);
}