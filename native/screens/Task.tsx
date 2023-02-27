import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
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

const getTaskSupabaseCall = (
  taskId: string,
  longitude?: number,
  latitude?: number
) => {
  const query = supabase.rpc('get_task', {
    p_id: taskId,
    ...(!!longitude && !!latitude
      ? { p_longitude: longitude, p_latitude: latitude }
      : undefined),
  });

  return query;
};

const getConversations = (taskId: string, userId: string) => {
  const query = supabase
    .from('task_messages')
    .select('*')
    .eq('task_id', taskId)
    .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
    .order('created_datetime', { ascending: true });

  return query;
};

// For some reason supabase type safety infers that the join from tasks
// to profiles is an array, even though it's a single object. The
// one-to-one relationship is not being detected (foreign key to primary key).
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

  console.log(task);

  const isMyTask = task?.user_id === session.user?.id;

  if (!task) {
    return <Text>Hmm...</Text>;
  }

  return (
    <Stack style={{ flex: 1 }}>
      <BackBar navigation={navigation}></BackBar>

      <TaskCard
        taskId={task.id}
        taskUserId={task.user_id}
        taskUserAvatarUrl={task.user_avatar_url}
        title={task.title}
        reason={task.reason}
        timing={task.timing}
        showDistanceBar={false}
      />
    </Stack>
  );
};
