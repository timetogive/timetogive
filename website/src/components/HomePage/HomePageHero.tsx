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
} from '@chakra-ui/react';
import Link from 'next/link';
import { HiChevronRight } from 'react-icons/hi';

export const HomePageHero = () => {
  return (
    <Box as="section" pt={32} pb={20}>
      <VStack
        mx="auto"
        px={{ base: '6', md: '8' }}
        color="white"
        alignItems="center"
        spacing={10}
      >
        <VStack spacing={5} maxW={{ base: 'xl', md: 'xl' }}>
          <Heading
            as="h1"
            size="3xl"
            fontWeight="extrabold"
            textAlign="center"
          >
            Little tasks for lasting connections
          </Heading>
          <Text fontSize={{ md: 'xl' }} mt="4" textAlign="center">
            TimeToGive is an app that connects people, with even the
            smallest amount of free time, to small volunteering tasks
            that make a big difference in their local community
          </Text>
          <VStack spacing={10}>
            <Text
              fontSize={{ md: 'xl' }}
              mt="4"
              textAlign="center"
              fontWeight={700}
            >
              It&apos;s free to use, entirely open source, and is
              itself run by volunteers.
            </Text>
            <Link
              href="https://apps.apple.com/gb/app/timetogive/id6447304280"
              target="_blank"
            >
              <Image
                alt="Apple App Store Download"
                src="/download-on-app-store.svg"
                w={44}
                alignSelf="center"
              />
            </Link>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  );
};
