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

export const HomePageFeedback = () => {
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
            How do I give feedback on the idea and the app?
          </Heading>
          <Text fontSize={{ md: 'xl' }} mt="4" textAlign="center">
            We&apos;ve setup a canny board to collect feedback on the
            idea, the app, and any bugs you experience. This can found
            here.
          </Text>
          <Link
            href="https://timetogive.canny.io/feature-requests"
            target="_blank"
          >
            <Button colorScheme="cyan" size="lg">
              Visit Canny Board
            </Button>
          </Link>
        </VStack>
      </VStack>
    </Box>
  );
};
