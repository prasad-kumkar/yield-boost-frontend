import { Box, Button, Flex, Heading, useToast, Text, Tooltip, IconButton, Image, useColorMode } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import { useLendingData } from '../../context/LendingDataProvider'
import { defaultChain, dollarFormatter } from '../../../src/const';
import PoolSelector from './PoolSelector';
import { TokenContext } from '../../context/TokenContext';
import { useAccount, useNetwork } from 'wagmi';
import { getABI, getAddress, getContract, send } from '../../../src/contract';
import Big from 'big.js';
import { ethers } from 'ethers';
import { HEADING_FONT, VARIANT } from '../../../styles/theme';

export default function LendingMarket() {
    const {protocol, markets, pools, selectedPool} = useLendingData();
	return (
    <>
        <Box
            w="100%"
            display={{ sm: "block", md: "flex" }}
            justifyContent={"space-between"}
            alignContent={"start"}
            mt={10}
            mb={6}
        >
            <Box>
					{pools.length > 1 ? <PoolSelector /> : <Heading fontWeight={HEADING_FONT == 'Chakra Petch' ? 'bold' : 'semibold'} fontSize={{sm: '2xl', md: "2xl", lg: '30px'}}>{protocol?.name}</Heading>}
					<Flex mt={7} mb={4} gap={10}>
						<Flex gap={2}>
							<Heading size={"sm"} color={"primary.400"}>
								Total Supplied
							</Heading>
							<Heading size={"sm"}>{dollarFormatter.format(protocol?.totalDepositBalanceUSD ?? 0)}</Heading>
						</Flex>

						<Flex gap={2}>
							<Heading size={"sm"} color={"secondary.400"}>
								Total Borrowed
							</Heading>
							<Heading size={"sm"}>{dollarFormatter.format(protocol?.totalBorrowBalanceUSD ?? 0)}</Heading>
						</Flex>
					</Flex>
				</Box>
        </Box>
    </>
  )
}
