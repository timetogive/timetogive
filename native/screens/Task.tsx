import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faChevronRight,
  faInfo,
  faInfoCircle,
  faStar,
} from '@fortawesome/sharp-solid-svg-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '@rneui/themed';
import { Alert } from 'react-native';
import { Stack, HStack, VStack } from 'react-native-flex-layout';
import {
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';
import { useQuery } from 'react-query';
import { RootStackParamList } from '../App';
import { BackBar } from '../components/BackBar';
import { TaskCard } from '../components/TaskCard';
import { Text } from '../components/Text';
import { supabase } from '../lib';
import { useSession } from '../providers/session';
import colors, { defaultColor } from '../styles/colors';
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

const getConversationsSupabaseCall = (taskId: string) => {
  const query = supabase.rpc('get_task_conversations', {
    p_id: taskId,
  });
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

  const { taskId } = route.params;

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

  const taskConversationsQuery = useQuery(
    ['GetTaskConversations', taskId],
    async () => {
      const query = getConversationsSupabaseCall(taskId);
      const { data, error } = await query;
      console.log(data);
      if (error) {
        Alert.alert('Error', error.message);
      }
      return data;
    },
    { enabled: !!taskId }
  );

  const conversations = taskConversationsQuery.data;

  const isMyTask = task?.user_id === session.user?.id;

  if (!task) {
    return <Text>Loading...</Text>;
  }

  return (
    <VStack style={{ flex: 1 }}>
      <BackBar navigation={navigation}></BackBar>
      {isMyTask && (
        <HStack
          ph={20}
          pv={10}
          bg={defaultColor[800]}
          justify="between"
          items="center"
          shouldWrapChildren
        >
          <Text color={colors.white} size="sm">
            You created this task
          </Text>
          <FontAwesomeIcon
            icon={faInfoCircle}
            color={colors.white}
            size={20}
          />
        </HStack>
      )}
      <ScrollView>
        <TaskCard
          taskId={task.id}
          taskUserId={task.user_id}
          taskUserAvatarUrl={task.user_avatar_url}
          title={task.title}
          reason={task.reason}
          timing={task.timing}
          showDistanceBar={false}
        />
        {conversations && conversations.length > 0 && (
          <VStack shouldWrapChildren bg={colors.white} mt={20}>
            <VStack ph={15} pv={10}>
              <Text size="sm" color={colors.gray[700]}>
                Conversations on this task
              </Text>
            </VStack>
            <VStack spacing={10} shouldWrapChildren>
              {conversations.map((c) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('CreateTaskMessage', {
                      taskId,
                      toUserId:
                        c.from_user_id === session.user?.id
                          ? c.to_user_id
                          : c.from_user_id,
                    })
                  }
                  key={`${c.from_user_id}-${c.to_user_id}`}
                >
                  <HStack
                    justify="between"
                    shouldWrapChildren
                    items="center"
                    ph={25}
                    borderBottom={0.5}
                    borderColor={colors.gray[200]}
                    pv={10}
                  >
                    <HStack spacing={10}>
                      <Stack
                        center
                        h={36}
                        w={36}
                        bg={colors.blue[100]}
                        radius={18}
                        overflow="hidden"
                      >
                        <SvgUri
                          width="100%"
                          height="100%"
                          uri={
                            c.from_user_id === session.user?.id
                              ? c.to_avatar_url
                              : c.from_avatar_url
                          }
                        />
                      </Stack>
                      <VStack spacing={2} shouldWrapChildren>
                        <Text size="xxs" color={colors.gray[500]}>
                          {c.from_user_id === session.user?.id
                            ? c.to_full_name
                            : c.from_full_name}
                        </Text>
                        <HStack items="center" spacing={4}>
                          <FontAwesomeIcon
                            icon={faStar}
                            color={colors.yellow[400]}
                            size={15}
                          />
                          <Text size="xs" color={colors.gray[500]}>
                            5.0
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>

                    <HStack spacing={5}>
                      <VStack
                        center
                        radius={15}
                        bg={colors.red[500]}
                        w={25}
                        h={25}
                      >
                        <Text color={colors.white} size="xxs">
                          {c.unread_count}
                        </Text>
                      </VStack>
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        size={15}
                        color={colors.gray[500]}
                      />
                    </HStack>
                  </HStack>
                </TouchableOpacity>
              ))}
            </VStack>
          </VStack>
        )}
        <VStack></VStack>
      </ScrollView>
      {!isMyTask && (
        <VStack
          position="absolute"
          bottom={insets.bottom + 10}
          left={insets.left}
          right={insets.right}
          ph={15}
          spacing={10}
        >
          <Button
            onPress={() =>
              navigation.navigate('CreateTaskMessage', {
                taskId,
                toUserId: task.user_id,
              })
            }
          >
            Message {task.user_full_name}
          </Button>
          <Button color={colors.gray[500]}>Volunteer for task</Button>
        </VStack>
      )}
    </VStack>
  );
};
