import {
	Flex,
	Box,
	Image,
	useDisclosure,
	Collapse,
	IconButton,
	Heading,
	Divider,
	Text,
	useColorMode
} from "@chakra-ui/react";
import AccountButton from '../ConnectButton'; 
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import "../../styles/Home.module.css";
import { useAccount, useNetwork } from "wagmi";
import { useContext } from "react";
import { AppDataContext } from "../context/AppDataProvider";
import { TokenContext } from "../context/TokenContext";
import { motion } from "framer-motion";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import NavLocalLink from "./NavLocalLink";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Status } from "../utils/status";
import { useLendingData } from "../context/LendingDataProvider";
import { CustomConnectButton } from "./ConnectButton";
import { useDexData } from "../context/DexDataProvider";
import { tokenFormatter } from "../../src/const";
import { VARIANT } from "../../styles/theme";

function NavBar() {
	const router = useRouter();
	const { status, account } = useContext(AppDataContext);
	const { fetchData } = useLendingData()


	const { chain, chains } = useNetwork();
	const [init, setInit] = useState(false);

	const { isOpen: isToggleOpen, onToggle } = useDisclosure();
	const [isSubscribed, setIsSubscribed] = useState(false);

	const {
		address,
		isConnected,
		isConnecting,
		connector: activeConnector,
	} = useAccount({
		onConnect({ address, connector, isReconnected }) {
			// if(!chain) return;
			// if ((chain as any).unsupported) return;
			fetchData(address!);
			setInit(true);
		},
		onDisconnect() {
			console.log("onDisconnect");
			window.location.reload();
		},
	});

	useEffect(() => {
		if (activeConnector && window.ethereum && !isSubscribed) {
			(window as any).ethereum.on(
				"accountsChanged",
				function (accounts: any[]) {
					// refresh page
					window.location.reload();
				}
			);
			(window as any).ethereum.on(
				"chainChanged",
				function (chainId: any[]) {
					// refresh page
					window.location.reload();
				}
			);
			setIsSubscribed(true);
		}
		// if (localStorage.getItem("chakra-ui-color-mode") === "light") {
		// 	localStorage.setItem("chakra-ui-color-mode", "dark");
		// 	// reload
		// 	window.location.reload();
		// }
		if (
			(!(isConnected && !isConnecting) || chain?.unsupported) &&
			status !== Status.FETCHING &&
			!init
		) {
			setInit(true);
			fetchData();
		}
	}, [activeConnector, address, chain?.unsupported, chains, fetchData, init, isConnected, isConnecting, isSubscribed, status]);


	const [isOpen, setIsOpen] = React.useState(false);

	window.addEventListener("click", function (e) {
		if (
			!document.getElementById("dao-nav-link")?.contains(e.target as any)
		) {
			setIsOpen(false);
		}

	});

	const {colorMode} = useColorMode();

	return (
		<>
		<Flex className={`${VARIANT}-${colorMode}-navBar`} justify={'center'} zIndex={0} mt={8} align='center' >
			<Box minW='0' w={'100%'} maxW='1250px'>
			<Flex align={"center"} justify="space-between" >
				<Flex justify="space-between" align={"center"} w='100%'>
					<Flex gap={10} align='center'>
						<Image
							src={`/${process.env.NEXT_PUBLIC_TOKEN_SYMBOL}-logo-${colorMode}.svg`}
							alt=""
							width="50px"
							mb={0.5}
						/>
						<Flex
							align="center"
							display={{ sm: "none", md: "flex" }}
						>
							<NavLocalLink
								path={"/"}
								title="Lend"
							></NavLocalLink>
						</Flex>
					</Flex>
					
					<Flex display={{sm: 'flex', md: 'none'}} my={4} gap={2}>
						<CustomConnectButton />
						<IconButton
							onClick={onToggle}
							icon={
								isToggleOpen ? (
									<CloseIcon w={3} h={3} />
								) : (
									<HamburgerIcon w={5} h={5} />
								)
							}
							variant={"ghost"}
							aria-label={"Toggle Navigation"}
							rounded={0}
						/>
					</Flex>
				</Flex>

				<Flex	
					display={{ sm: "none", md: "flex" }}
					justify="flex-end"
					align={"center"}
					// gap={2}
					w='100%'
				>
					<Box>
						<AccountButton />
					</Box>
					<Box ml={2}>
						<CustomConnectButton />
					</Box>
				</Flex>
			</Flex>
			</Box>
		</Flex>
			<Collapse in={isToggleOpen} animateOpacity>
				<MobileNav />
			</Collapse>
		</>
	);
}

const MobileNav = ({}: any) => {
	const router = useRouter();
	const { dex } = useDexData();
	return (
		<Flex flexDir={"row"} wrap={'wrap'} gap={0}>
			<NavLocalLink
				path={"/"}
				title={"Trade"}
			></NavLocalLink>
			<NavLocalLink
				path={"/synthetics"}
				title="Synths"
			></NavLocalLink>
			<NavLocalLink
				path={"/lend"}
				title="Lending"
			></NavLocalLink>
			<NavLocalLink
				path={"/pools"}
				title="Pools"
			></NavLocalLink>
			<NavLocalLink
				path={"/leaderboard"}
				title={<Flex gap={2} align={'center'}>
				<Text color={'secondary.400'} fontWeight={'bold'} fontSize={'md'}>{tokenFormatter.format(dex?.yourPoints?.totalPoints ?? 0)}</Text> Points
				</Flex>}
			></NavLocalLink>
		</Flex>
	);
};

export default NavBar;
