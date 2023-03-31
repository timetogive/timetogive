import {
  Box,
  Heading,
  HStack,
  Text,
  VStack,
  Image,
  Grid,
  GridItem,
  Stack,
  AspectRatio,
} from '@chakra-ui/react';
import { HiChevronRight } from 'react-icons/hi';

const TaskPanel = ({
  bgImage,
  bgPosition,
  children,
}: {
  bgImage: string;
  bgPosition?: string;
  children: React.ReactNode;
}) => {
  return (
    <Box
      flex={1}
      rounded={5}
      h="400px"
      bgColor="cyan.500"
      bgImage={bgImage}
      bgPosition={bgPosition || 'top'}
      bgSize="cover"
      position="relative"
      overflow="hidden"
    >
      <Box p={10} position="absolute" top="25" zIndex={1} h="150">
        {children}
      </Box>
      <Box
        boxSize="full"
        position="absolute"
        inset="0"
        bgGradient="linear(to-b, rgba(32, 32, 32, 1), rgba(32, 32, 32, 0.2))"
      />
    </Box>
  );
};
export const HomePageTasks = () => {
  return (
    <Box as="section" pt={20}>
      <VStack
        px={{ base: '6', md: '8' }}
        color="white"
        alignItems="center"
        spacing={14}
      >
        <VStack w={{ base: '100%', md: '4xl' }} spacing={5}>
          <Heading
            as="h1"
            size="xl"
            fontWeight="bold"
            textAlign="center"
          >
            Tasks can be created by anyone for anyone
          </Heading>
          <Text fontSize={{ md: 'xl' }} mt="4" textAlign="center">
            No money is ever exchanged for the time that is given. As
            long as the task benefits the local community, the
            environment, someone in need, or it&apos;s repaid in kind,
            then it&apos;s a good task.
          </Text>
        </VStack>
        <VStack
          w={{ base: '100%', md: '4xl' }}
          maxW="100%"
          spacing={5}
        >
          <Grid
            templateColumns={{
              base: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
            }}
            gap={10}
            w="full"
          >
            <GridItem>
              <TaskPanel bgImage="https://images.unsplash.com/photo-1461532257246-777de18cd58b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHZvbHVudGVlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60">
                <VStack spacing={5} align="start">
                  <Text color="white" fontSize="xl" fontWeight="bold">
                    Helping out a neighbour
                  </Text>
                  <Text color="white" fontSize="sm" fontWeight="bold">
                    Examples : building a shed, helping put together
                    some Ikea furniture, lending someone a power tool,
                    fixing the wifi.
                  </Text>
                  <Text color="white" fontSize="sm" fontWeight="bold">
                    These favours are repaid in kind. By returning the
                    favour, pledging a small amount to charity, or by
                    simply paying it forward with another task for
                    good.
                  </Text>
                </VStack>
              </TaskPanel>
            </GridItem>
            <GridItem>
              <TaskPanel bgImage="https://images.unsplash.com/photo-1587040273238-9ba47c714796?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8bmVpZ2hib3VyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60">
                <VStack spacing={5} align="start">
                  <Text color="white" fontSize="xl" fontWeight="bold">
                    Assisting the vulnerable or elderly
                  </Text>
                  <Text color="white" fontSize="sm" fontWeight="bold">
                    Examples : dropping off food parcels, taking the
                    time have a coffee with someone lonely, offering a
                    lift to a hospital appointment.
                  </Text>
                  <Text color="white" fontSize="sm" fontWeight="bold">
                    Even tiny amounts of time can make a huge
                    difference.
                  </Text>
                </VStack>
              </TaskPanel>
            </GridItem>
            <GridItem>
              <TaskPanel bgImage="https://images.unsplash.com/photo-1674574124792-3be232f1957f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60">
                <VStack spacing={5} align="start">
                  <Text color="white" fontSize="xl" fontWeight="bold">
                    For community groups and charities
                  </Text>
                  <Text color="white" fontSize="sm" fontWeight="bold">
                    Examples : sorting clothes in the high street
                    shop, helping to run a stall at a charity fair,
                    litter picking.
                  </Text>
                  <Text color="white" fontSize="sm" fontWeight="bold">
                    Traditional volunteering tasks, but smaller, and
                    only carried as and when you have the time without
                    long term commitments.
                  </Text>
                </VStack>
              </TaskPanel>
            </GridItem>
            <GridItem>
              <TaskPanel
                bgPosition="center"
                bgImage="https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cXVlc3Rpb258ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
              >
                <VStack spacing={5} align="start">
                  <Text color="white" fontSize="xl" fontWeight="bold">
                    Answering a question or giving advice
                  </Text>
                  <Text color="white" fontSize="sm" fontWeight="bold">
                    Examples : who&apos;s the best plumber in town?
                    who&apos;s hiring locally at the moment?
                    where&apos;s the best place to grab a coffee?
                  </Text>
                  <Text color="white" fontSize="sm" fontWeight="bold">
                    Tasks don&apos;t have to be physical things.
                    Answering questions and giving advice to your
                    local community adds real value and can be done
                    remotely.
                  </Text>
                </VStack>
              </TaskPanel>
            </GridItem>
          </Grid>
        </VStack>
      </VStack>
    </Box>
  );
};
