import { useContext } from 'react';
import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  Flex,
  useColorMode,
} from '@chakra-ui/react';
import { FaTwitter, FaDiscord, FaGithub } from 'react-icons/fa';
import { AppDataContext } from './context/AppDataProvider';
import { useNetwork } from 'wagmi';
import { Switch } from '@chakra-ui/react'
import { MdDarkMode, MdLightMode } from 'react-icons/md';

export default function Footer() {
  const {block} = useContext(AppDataContext);
  const {chain} = useNetwork();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      color={'whiteAlpha.400'}
      bg='transparent'
      pb={2}
      >
      <Box
        borderTopWidth={1}
        borderStyle={'solid'}
        borderColor={'whiteAlpha.200'}
        >
        <Container
          as={Stack}
          maxW={'1200px'}
          pt={2}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ md: 'space-between' }}
          align={{ md: 'center' }}
          color={colorMode == 'dark' ? "whiteAlpha.800" : "blackAlpha.800"}
          >
            <Flex zIndex={1000} align={'center'} gap={1}>
              <Box h={2} w={2} bgColor={block == 0 ? 'red': 'green.400'} rounded='100'></Box>
              <Text fontSize={'xs'}>{chain?.name} ({block == 0 ? 'Not Connected': block})</Text>
              <Text fontSize={'xs'}>| Built on Pendle</Text>
              {/* {colorMode == 'dark' ? <MdDarkMode /> : <MdLightMode/>} */}
              {/* <Switch zIndex={1000} size="sm" onChange={toggleColorMode} /> */}
            </Flex>
            <Stack direction={'row'} spacing={6}>
              {/* <Link zIndex={1000} target={'_blank'} href={process.env.NEXT_PUBLIC_TWITTER_LINK}>
                <FaTwitter />
              </Link>
              <Link zIndex={1000} target={'_blank'} href={process.env.NEXT_PUBLIC_DISCORD_LINK}>
                <FaDiscord />
              </Link> */}
              {/* <Link zIndex={1000} target={'_blank'} href={'https://github.com/synthe-x'}>
                <FaGithub />
              </Link> */}
            </Stack>
        </Container>
      </Box>
    </Box>
  );
}