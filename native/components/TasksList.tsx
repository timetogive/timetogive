import { TaskCard } from './TaskCard';
import { FlatList } from 'react-native';
import { SearchTasksResult } from '../types';
import {
  Stack,
  HStack,
  Flex,
  Spacer,
  VStack,
} from 'react-native-flex-layout';

import { Text } from './Text';
import colors from '../styles/colors';

const renderItem = ({ item }: { item: any }) => (
  <></>
  // <Stack pb="$4">
  //   <TaskCard
  //     title={item.title}
  //     description={item.description}
  //     reason={item.reason}
  //   />
  // </Stack>
);

interface Props {
  tasks: SearchTasksResult;
}

export const TasksList = ({ tasks }: Props) => {
  return (
    <VStack
      spacing={20}
      pt={110}
      style={{ backgroundColor: colors.purple[50], flex: 1 }}
      ph={15}
    >
      {tasks.map((t) => (
        <HStack h={150}>
          <Stack
            key={t.id}
            radius={5}
            style={{
              shadowColor: colors.gray[300],
              shadowOffset: { width: -4, height: 6 },
              shadowOpacity: 0.7,
              shadowRadius: 20,
              elevation: 6,
              backgroundColor: colors.white,
            }}
            w="100%"
            p={25}
          >
            <Text size="md" color={colors.gray[600]}>
              {t.title}
            </Text>
          </Stack>
        </HStack>
      ))}
    </VStack>
  );
  // return (
  //   <Stack backgroundColor="$background" flex={1} px="$3">
  //     <FlatList
  //       data={tasks}
  //       renderItem={renderItem}
  //       keyExtractor={(item) => item.id}
  //     />
  //   </Stack>
  // );
};
