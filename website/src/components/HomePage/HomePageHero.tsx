import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Img,
  Stack,
  Text,
} from '@chakra-ui/react';
import { HiChevronRight } from 'react-icons/hi';

export const HomePageHero = () => {
  return (
    <Box bg="gray.800" as="section" minH="140px" position="relative">
      <Box py="32" position="relative" zIndex={1}>
        <Box
          maxW={{ base: 'xl', md: '7xl' }}
          mx="auto"
          px={{ base: '6', md: '8' }}
          color="white"
        >
          <Box maxW="xl">
            <Heading as="h1" size="3xl" fontWeight="extrabold">
              Get help. Give help. Anytime. Anywhere.
            </Heading>
            <Text fontSize={{ md: '2xl' }} mt="4" maxW="xl">
              Our app will connect those who need help with those who
              have time to spare. Each good deed directly benefits
              those involved or is rewarded with a pledge to charity.
              It&apos;s free, open source, built on donations, and
              non-profit. It&apos;s <strong>TimeToGive</strong>.
            </Text>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              mt="10"
              spacing="4"
            >
              <Button
                as="a"
                href="#"
                colorScheme="cyan"
                px="8"
                rounded="full"
                size="lg"
                fontSize="md"
                fontWeight="bold"
              >
                Our mission
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
      <Flex
        id="image-wrapper"
        position="absolute"
        insetX="0"
        insetY="0"
        w="full"
        h="full"
        overflow="hidden"
        align="center"
      >
        <Box position="relative" w="full" h="full">
          <Img
            src="/people.jpg"
            alt="Main Image"
            w="full"
            h="full"
            objectFit="cover"
            objectPosition="top"
            position="absolute"
          />
          <Box
            position="absolute"
            w="full"
            h="full"
            bg="blackAlpha.600"
          />
        </Box>
      </Flex>
    </Box>
  );
};
