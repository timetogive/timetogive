import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faChevronRight,
  faInfo,
  faInfoCircle,
  faStar,
} from '@fortawesome/sharp-solid-svg-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '@rneui/themed';
import { useState } from 'react';
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
import { InfoBar } from '../components/InfoBar';
import { StaticMapWithMarker } from '../components/StaticMapWithMarker';
import { TaskCard } from '../components/TaskCard';
import { TaskConversations } from '../components/TaskConversations';
import { TaskOffers } from '../components/TaskOffers';
import { Text } from '../components/Text';
import { supabase } from '../lib';
import {
  getTaskSupabaseCall,
  getConversationsSupabaseCall,
  getOffersSupabaseCall,
} from '../lib/supabaseCalls';
import { useSession } from '../providers/session';
import colors, { defaultColor } from '../styles/colors';
import { Profile, TaskOfferStatus, TaskStatus } from '../types';

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

  const taskOffersQuery = useQuery(
    ['GetTaskOffers', taskId],
    async () => {
      const query = getOffersSupabaseCall(taskId);
      const { data, error } = await query;
      console.log(data);
      if (error) {
        Alert.alert('Error', error.message);
      }
      return data;
    },
    { enabled: !!taskId }
  );

  const offers = taskOffersQuery.data;

  const pendingOffers = offers?.filter((o) => o.status === 'Pending');

  const [volunteerCallBusy, setVolunteerCallBusy] =
    useState<boolean>(false);

  const volunteerForTask = async () => {
    setVolunteerCallBusy(true);
    await supabase.rpc('create_task_offer', {
      p_task_id: taskId,
    });
    taskQuery.refetch();
    taskOffersQuery.refetch();
    setVolunteerCallBusy(false);
  };

  const actionTaskOffer = async (
    taskOfferId: string,
    status: TaskOfferStatus
  ) => {
    const { data, error } = await supabase.rpc('action_task_offer', {
      p_task_offer_id: taskOfferId,
      p_status: status,
    });
    if (error) {
      console.log('Error');
      console.log(error);
    }
    taskQuery.refetch();
    taskOffersQuery.refetch();
  };

  const isMyTask = task?.user_id === session.user?.id;

  const myOffer = pendingOffers?.find(
    (o) => o.user_id === session.user?.id
  );

  const canVolunteer =
    task &&
    (['Partially Assigned', 'Live'] as TaskStatus[]).includes(
      task?.status
    );

  if (!task) {
    return <Text>Loading...</Text>;
  }

  return (
    <VStack style={{ flex: 1 }}>
      <BackBar navigation={navigation}></BackBar>
      {isMyTask && <InfoBar message="You created this task" />}
      {task.status === 'Assigned' && (
        <InfoBar message="This task has already been assigned" />
      )}
      {task.status === 'Partially Assigned' && (
        <InfoBar message="This task still needs more volunteers" />
      )}
      {task.status === 'Closed' && (
        <InfoBar message="Sorry. This is now closed." />
      )}
      {task.status === 'Completed' && (
        <InfoBar message="This task has already been completed" />
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
        <TaskConversations
          conversations={conversations}
          onClickConversation={(userId: string) =>
            navigation.navigate('TaskConversation', {
              taskId,
              userId,
            })
          }
        ></TaskConversations>
        {isMyTask && (
          <TaskOffers
            offers={pendingOffers}
            onAccept={(offerId: string) =>
              actionTaskOffer(offerId, 'Accepted')
            }
            onDecline={(offerId: string) =>
              actionTaskOffer(offerId, 'Declined')
            }
          ></TaskOffers>
        )}

        {myOffer && (
          <VStack shouldWrapChildren bg={colors.white} mt={20}>
            <VStack ph={20} pv={10}>
              <Text
                size="sm"
                color={colors.gray[700]}
                weight="semi-bold"
              >
                You have sent an offer to help. Let's see what comes
                back.
              </Text>
            </VStack>
          </VStack>
        )}

        <VStack shouldWrapChildren bg={colors.white} mt={20}>
          <VStack ph={20} pv={10}>
            <Text
              size="sm"
              color={colors.gray[700]}
              weight="semi-bold"
            >
              Full details
            </Text>
          </VStack>
          <VStack ph={20} pv={10}>
            <Text size="sm" color={colors.gray[700]}>
              {task.description}
            </Text>
          </VStack>
        </VStack>
        <VStack shouldWrapChildren bg={colors.white} mt={20}>
          <VStack ph={20} pv={10}>
            <Text
              size="sm"
              color={colors.gray[700]}
              weight="semi-bold"
            >
              Timing
            </Text>
          </VStack>
          <VStack ph={20} pv={10}>
            <Text size="sm" color={colors.gray[700]}>
              {task.timing}
            </Text>
          </VStack>
        </VStack>
        <VStack shouldWrapChildren bg={colors.white} mt={20}>
          <VStack ph={20} pv={10}>
            <Text
              size="sm"
              color={colors.gray[700]}
              weight="semi-bold"
            >
              Location
            </Text>
          </VStack>
          <Stack ph={20}>
            <Stack
              minH={200}
              pointerEvents="box-only"
              radius={20}
              overflow="hidden"
            >
              <StaticMapWithMarker
                longLat={{
                  longitude: task.longitude,
                  latitude: task.latitude,
                }}
              />
            </Stack>
          </Stack>
        </VStack>
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
              navigation.navigate('TaskConversation', {
                taskId,
                userId: task.user_id,
              })
            }
          >
            Message {task.user_full_name}
          </Button>
          {!myOffer && canVolunteer && (
            <Button
              color={colors.gray[500]}
              onPress={() => volunteerForTask()}
              loading={volunteerCallBusy}
            >
              Volunteer for task
            </Button>
          )}
        </VStack>
      )}
    </VStack>
  );
};
