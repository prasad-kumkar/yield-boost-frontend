import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";
import Swap from "../components/swap/index";
import YourBorrows from "../components/dashboard/lending/YourBorrows";
import { VARIANT } from "../styles/theme";
import YourSupplies from "../components/dashboard/lending/YourSupplies";
import LendingMarket from "../components/dashboard/lending/Market";
import LendingPosition from "../components/dashboard/lending/Position";
import SupplyTable from "../components/dashboard/lending/SupplyTable";
import BorrowTable from "../components/dashboard/lending/BorrowTable";

export default function swap() {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { colorMode } = useColorMode();
	return (
		<Flex >
				{/* <Flex justify={'center'} zIndex={-10} position={"absolute"} w={'100%'} h={'100%'}>
					<Box bgImage={"/background-1.svg"} bgRepeat={'no-repeat'} bgSize={'cover'} w={"80%"} h={"60%"} position={"absolute"} bottom={0} zIndex={-10} />
					<Box bgImage={"/background-2.svg"} bgRepeat={'no-repeat'} bgSize={'cover'} w={"100%"} h={"60%"} position={"absolute"} bottom={0} zIndex={-8} />
					<Box bgGradient={`linear(to-t, ${colorMode == 'dark' ? 'black' : 'white'}Alpha.800, transparent)`} bgSize={"cover"} w={"100%"} h={"50%"} position={"absolute"} bottom={0} zIndex={-9} />
				</Flex> */}
				<Box w={'100%'}>
				
				<Box mt={20} mb={2}>
					<LendingMarket />
				</Box>

				<Box>
					<LendingPosition />
				</Box>

				<Box mt={5} w='100%'>
					<Flex
						flexDir={{ sm: "column", md: "row" }}
						align={"stretch"}
						gap={"2%"}
						zIndex={1}
					>
						<Box
							w={{ sm: "100%", md: "49%" }}
							
						>
							<motion.div
								initial={{ opacity: 0, y: 15 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 15 }}
								transition={{ duration: 0.25 }}
								style={{
									height: "100%",
								}}
							>
								<Box className={`${VARIANT}-${colorMode}-containerBody`} h={'100%'}>
									<YourSupplies />
								</Box>
							</motion.div>
						</Box>
						<Box w={{ sm: "100%", md: "49%" }} alignSelf="stretch">
							<motion.div
								initial={{ opacity: 0, y: 15 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 15 }}
								transition={{ duration: 0.25 }}
								style={{
									height: "100%",
								}}
							>
								<Box className={`${VARIANT}-${colorMode}-containerBody`} h={'100%'}>
									<YourBorrows />
								</Box>
							</motion.div>
						</Box>
					</Flex>
				</Box>

				<Box pb={"70px"} w='100%'>
					<Flex
						flexDir={{ sm: "column", md: "row" }}
						align={"stretch"}
						gap={"2%"}
						zIndex={1}
						mt={5}
					>
						<Box
							w={{ sm: "100%", md: "49%" }}
							alignSelf="stretch"
						>
							<motion.div
								initial={{ opacity: 0, y: 15 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 15 }}
								transition={{ duration: 0.25 }}
								key={0}
								style={{
									height: "100%",
								}}
							>
								<Box className={`${VARIANT}-${colorMode}-containerBody`} h={'100%'}>
									<SupplyTable />
								</Box>
							</motion.div>
						</Box>
						<Box w={{ sm: "100%", md: "49%" }}>
							<motion.div
								initial={{ opacity: 0, y: 15 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 15 }}
								transition={{ duration: 0.25 }}
								key={2}
							>
								<Box className={`${VARIANT}-${colorMode}-containerBody`} h={'100%'}>
									<BorrowTable />
								</Box>
							</motion.div>
						</Box>
					</Flex>
				</Box>
				</Box>

		</Flex>
	);
}
