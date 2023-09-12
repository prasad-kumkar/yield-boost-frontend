import React from 'react'
import { useDexData } from '../context/DexDataProvider'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  TableContainer,
  Box,
  Heading,
  Flex,
  useColorMode
} from '@chakra-ui/react'
import Pool from './Pool';
import ThBox from '../dashboard/ThBox';
import { VARIANT } from '../../styles/theme';

export default function Pools() {
    
    const { pools } = useDexData();
    const {colorMode} = useColorMode();

    return (
      <Box className={`${VARIANT}-${colorMode}-containerBody`}>
        <Box className={`${VARIANT}-${colorMode}-containerHeader`}>
          <Flex align={'center'} p={4} px={5} gap={4}>
            <Heading fontSize={'18px'} color={'secondary.400'}>All Pools</Heading>
          </Flex>
        </Box>
        <TableContainer px={4} pb={4}>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <ThBox>Assets</ThBox>
                <ThBox alignBox='center'>Composition</ThBox>
                <ThBox alignBox='center'>
                  <Flex w={'100%'} justify={'center'}>
                    Liquidity
                  </Flex>
                </ThBox>
                <ThBox alignBox='center'>
                <Flex w={'100%'} justify={'center'}>
                  APR
                  </Flex>
                </ThBox>
                <ThBox isNumeric>.</ThBox>
              </Tr>
            </Thead>
            <Tbody>
              {pools.map((pool: any, index: number) => (
                  <Pool key={index} pool={pool} index={index} />
              ))}
            </Tbody>
          </Table>
      </TableContainer>
    </Box>
  )
}
