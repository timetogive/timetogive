import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Img,
  Stack,
  Text,
  VStack,
  Image,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';
import { faBadgeCheck } from '@fortawesome/pro-light-svg-icons';
import { HiChevronRight } from 'react-icons/hi';
import { ChakraFaIcon } from '../ChakraFaIcon';

const Commitment = ({ text }: { text: string }) => {
  return (
    <HStack spacing={5}>
      <ChakraFaIcon
        icon={faBadgeCheck}
        color="cyan.500"
        boxSize={8}
      />
      <Heading as="h2" size="md" fontWeight="bold">
        {text}
      </Heading>
    </HStack>
  );
};

export const HomePageCommitments = () => {
  return (
    <Box as="section" pt={32} pb={20}>
      <VStack
        maxW={{ base: 'xl', md: '5xl' }}
        mx="auto"
        px={{ base: '6', md: '8' }}
        color="white"
        alignItems="center"
        spacing={10}
      >
        <VStack spacing={5}>
          <Heading
            as="h1"
            size="xl"
            fontWeight="bold"
            textAlign="center"
          >
            Our community commitments
          </Heading>
          <Text fontSize={{ md: 'xl' }} mt="4" textAlign="center">
            Given we&apos;re a community project, we&apos;ve started
            building a set of commitments that underpin what we do
          </Text>
        </VStack>
        <VStack spacing={5} alignItems="start" maxW="3xl">
          <Commitment text="Always free to use" />
          <Commitment text="Funded through voluntary donations" />
          <Commitment text="All code that is built will be open source" />
          <Commitment text="Self-moderated and monitored by the community" />
          <Commitment text="Never display adverts" />
          <Commitment text="Never exploit or sell user data" />
          <Commitment text="Never send you a marketing email" />
        </VStack>
      </VStack>
    </Box>
  );
};
