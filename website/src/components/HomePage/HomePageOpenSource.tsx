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
import Link from 'next/link';
import { HiChevronRight } from 'react-icons/hi';
import { ChakraFaIcon } from '../ChakraFaIcon';

export const HomePageOpenSource = () => {
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
            I&apos;m a developer, how can I contribute?
          </Heading>
          <Text fontSize={{ md: 'xl' }} mt="4" textAlign="center">
            The code is hosted on GitHub and is open source. We would
            love you to contribute.
          </Text>
          <Link
            href="https://github.com/timetogive/timetogive"
            target="_blank"
          >
            <Button colorScheme="cyan" size="lg">
              Visit GitHub Repo
            </Button>
          </Link>
        </VStack>
      </VStack>
    </Box>
  );
};
