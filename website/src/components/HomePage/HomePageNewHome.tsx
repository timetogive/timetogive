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

export const HomePageNewHome = () => {
  return (
    <Box as="section" pt={32} pb={20} px={5}>
      <VStack
        mx="auto"
        maxW="5xl"
        color="white"
        spacing={10}
        bgColor="cyan.500"
        py={14}
        px={20}
        rounded={10}
      >
        <VStack spacing={5} textColor="gray.800" align="start">
          <Heading
            as="h1"
            size="lg"
            fontWeight="bold"
            textAlign="left"
          >
            Can you help find a long-term home for TimeToGive?
          </Heading>
          <Text fontSize={{ md: 'xl' }} mt="4">
            This is a personal philanthropic project that{' '}
            <Link
              href="https://www.linkedin.com/in/jamesallchin"
              target="_blank"
            >
              <Text as="span" decoration="underline">
                James Allchin
              </Text>
            </Link>{' '}
            has started. However, to host the platform and provide the
            service to end users he&apos;s temporarily using his own
            limited company to run it. This allows him to deal with
            terms and conditions, privacy policy, and GDPR.
          </Text>
          <Text fontSize={{ md: 'xl' }} mt="4">
            However, the hosting and management of the official
            TimeToGive service really needs to find a home with a
            non-profit or charity organisation. Ideally national or
            international, but a small local one with enthusiasm would
            be great too. A tech company with a philanthropic arm
            would also be a good fit.
          </Text>
          <Text fontSize={{ md: 'xl' }} mt="4">
            Please reach out if you&apos;re interested via email at{' '}
            <Text as="span" fontWeight="bold">
              hello@timetogiveapp.com
            </Text>
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};
