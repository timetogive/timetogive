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
import { defaultColor } from '../styles/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleDown } from '@fortawesome/pro-solid-svg-icons/faAngleDown';
import { faLocationDot } from '@fortawesome/pro-light-svg-icons/faLocationDot';
import { faList } from '@fortawesome/pro-light-svg-icons/faList';

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
      style={{ backgroundColor: defaultColor[50], flex: 1 }}
      ph={15}
    >
      {tasks.map((t, i) => (
        <Stack key={t.id}>
          <TaskCard
            title={t.title}
            reason={t.reason}
            description={t.description}
          />
        </Stack>
      ))}
    </VStack>
  );
};
