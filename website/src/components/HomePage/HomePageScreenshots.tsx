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
            alt="iPhone Screenshot of Map"
            src="/iphone-screen-map.png"
            maxH="60vh"
          />
          <Image
            alt="iPhone Screenshot of Task"
            src="/iphone-screen-task.png"
            maxH="60vh"
          />
          <Image
            alt="iPhone Screenshot of Chat"
            src="/iphone-screen-chat.png"
            maxH="60vh"
          />
        </HStack>
      </VStack>
    </Box>
  );
};
