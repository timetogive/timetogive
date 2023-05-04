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
  bgColor,
  bgPosition,
  children,
}: {
  bgColor: string;
  bgPosition?: string;
  children: React.ReactNode;
}) => {
  return (
    <Box
      flex={1}
      rounded={8}
      h="400px"
      bgColor={bgColor}
      bgPosition={bgPosition || 'top'}
      bgSize="cover"
      position="relative"
      overflow="hidden"
      p={8}
    >
      {children}
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
          color="#264553"
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
              <TaskPanel bgColor="#54B2D4">
                <VStack spacing={4} alignItems="start">
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    alignSelf="center"
                  >
                    Helping out a neighbour
                  </Text>
                  <Image
                    alt="Helping out a neighbour"
                    src="/task-icon-neighbours-dark.svg"
                    h={24}
                    alignSelf="center"
                  />
                  <Text fontSize="sm">
                    Examples : building a shed, helping put together
                    some Ikea furniture, lending someone a power tool,
                    fixing the wifi.
                  </Text>
                  <Text fontSize="sm">
                    These favours are repaid in kind. By returning the
                    favour, pledging a small amount to charity, or by
                    simply paying it forward with another task for
                    good.
                  </Text>
                </VStack>
              </TaskPanel>
            </GridItem>
            <GridItem>
              <TaskPanel bgColor="#71BBA5">
                <VStack spacing={4} alignItems="start">
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    alignSelf="center"
                  >
                    Assisting the vulnerable or elderly
                  </Text>
                  <Image
                    alt="Assisting the vulnerable or elderly"
                    src="/task-icon-elderly-dark.svg"
                    h={24}
                    alignSelf="center"
                  />
                  <Text fontSize="sm">
                    Examples : dropping off food parcels, taking the
                    time have a coffee with someone lonely, offering a
                    lift to a hospital appointment.
                  </Text>
                  <Text fontSize="sm">
                    Even tiny amounts of time can make a huge
                    difference.
                  </Text>
                </VStack>
              </TaskPanel>
            </GridItem>
            <GridItem>
              <TaskPanel bgColor="#F6CF56">
                <VStack spacing={4} alignItems="start">
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    alignSelf="center"
                  >
                    For community groups and charities
                  </Text>
                  <Image
                    alt="For community groups and charities"
                    src="/task-icon-charity-dark.svg"
                    h={24}
                    alignSelf="center"
                  />
                  <Text fontSize="sm">
                    Examples : sorting clothes in the high street
                    shop, helping to run a stall at a charity fair,
                    litter picking.
                  </Text>
                  <Text fontSize="sm">
                    Traditional volunteering tasks, but smaller, and
                    only carried as and when you have the time without
                    long term commitments.
                  </Text>
                </VStack>
              </TaskPanel>
            </GridItem>
            <GridItem>
              <TaskPanel bgColor="#E27B60">
                <VStack spacing={4} alignItems="start">
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    alignSelf="center"
                  >
                    Answering questions or giving advice
                  </Text>
                  <Image
                    alt="Answering a question or giving advice"
                    src="/task-icon-advice-dark.svg"
                    h={24}
                    alignSelf="center"
                  />
                  <Text fontSize="sm">
                    Examples : who&apos;s the best plumber in town?
                    who&apos;s hiring locally at the moment?
                    where&apos;s the best place to grab a coffee?
                  </Text>
                  <Text fontSize="sm">
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
