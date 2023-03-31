import {
  Box,
  Heading,
  HStack,
  Text,
  VStack,
  Image,
} from '@chakra-ui/react';
import { HiChevronRight } from 'react-icons/hi';

export const HomePageScreenshots = () => {
  return (
    <Box as="section">
      <VStack alignItems="center">
        <HStack spacing={5} overflowX="auto" py={10}>
          <Image
            alt="iPhone Screenshot"
            src="/iphone-screenshot.png"
            maxH="60vh"
          />
          <Image
            alt="iPhone Screenshot"
            src="/iphone-screenshot.png"
            maxH="60vh"
          />
          <Image
            alt="iPhone Screenshot"
            src="/iphone-screenshot.png"
            maxH="60vh"
          />
        </HStack>
      </VStack>
    </Box>
  );
};
