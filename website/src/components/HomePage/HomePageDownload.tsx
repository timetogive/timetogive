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

export const HomePageDownload = () => {
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
            How do I sign up and get the app?
          </Heading>
          <Text fontSize={{ md: 'xl' }} mt="4" textAlign="center">
            <Link
              href="https://www.linkedin.com/in/jamesallchin"
              target="_blank"
            >
              <Text as="span" decoration="underline">
                James Allchin
              </Text>
            </Link>{' '}
            is the founder of the project and is currently beavering
            away on the first version of the app. It&apos;s currently
            in Alpha but a Beta version is expected to land on the
            Apple App Store and Google Play Store in April 2023.
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};
