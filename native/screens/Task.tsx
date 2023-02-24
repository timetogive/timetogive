import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Stack } from 'react-native-flex-layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from 'react-query';
import { RootStackParamList } from '../App';
import { BackBar } from '../components/BackBar';
import { TaskCard } from '../components/TaskCard';
import { Text } from '../components/Text';
import { supabase } from '../lib';
import { useSession } from '../providers/session';
import { Profile } from '../types';

const getTaskSupabaseCall = (taskId: string) => {
  const query = supabase
    .from('tasks')
    .select(
      `*,
      profiles (
        avatar_url
      )
    `
    )
    .eq('id', taskId)
    .single();

  return query;
};

// For some reason supabase type safety infers that the join from tasks
// to profiles is an array, even though it's a single object. The
// one-to-one relationship is not being detected.
export function asObj<T>(object: any): T {
  if (Array.isArray(object)) {
    return object[0] as T;
  }
  return object as T;
}

type Props = NativeStackScreenProps<RootStackParamList, 'Task'>;

export const Task = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const session = useSession();

  console.log(session.user?.full_name);

  const { taskId } = route.params;

  console.log(taskId);

  const taskQuery = useQuery(
    ['GetTask', taskId],
    async () => {
      const query = getTaskSupabaseCall(taskId);
      const { data, error } = await query;
      return data;
    },
    { enabled: !!taskId }
  );

  const task = taskQuery.data;

  if (!task) {
    return <Text>Hmm...</Text>;
  }

  return (
    <Stack style={{ flex: 1 }}>
      <BackBar navigation={navigation}></BackBar>
      <TaskCard
        taskId={task.id}
        taskUserId={task.user_id}
        taskUserAvatarUrl={
          asObj<Profile>(task.profiles)?.avatar_url || ''
        }
        title={task.title}
        reason={task.reason}
        timing={task.timing}
        showDistanceBar={false}
      />
    </Stack>
  );
};
