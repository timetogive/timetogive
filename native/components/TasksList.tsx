import { TaskCard } from './TaskCard';
import { FlatList } from 'react-native';
import { SearchTasksResult } from '../types';
import { VStack } from 'react-native-flex-layout';
import { defaultColor } from '../styles/colors';
interface Props {
  tasks: SearchTasksResult;
}

export const TasksList = ({ tasks }: Props) => {
  return (
    <VStack
      pt={110}
      style={{ backgroundColor: defaultColor[50], flex: 1 }}
      pr={15}
      shouldWrapChildren
    >
      {tasks.map((t) => (
        <TaskCard
          key={t.id}
          title={t.title}
          reason={t.reason}
          description={t.description}
        />
      ))}
    </VStack>
  );
};
