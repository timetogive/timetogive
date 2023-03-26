import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '@rneui/themed';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { Box, HStack, Stack, VStack } from 'react-native-flex-layout';
import {
  ScrollView,
  RefreshControl,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';
import { useQuery } from 'react-query';
import { RootStackParamList } from '../App';
import { TaskOfferActionMenuBottomSheetModal } from '../components/TaskOfferActionMenu';
import {
  BackBar,
  BACK_BAR_CONTENT_HEIGHT,
} from '../components/BackBar';
import { InfoBar } from '../components/InfoBar';
import { StaticMapWithMarker } from '../components/StaticMapWithMarker';
import { TaskInformation } from '../components/TaskInformation';
import { TaskConversations } from '../components/TaskConversations';
import { TaskOffers } from '../components/TaskOffers';
import { Text } from '../components/Text';
import { supabase } from '../lib';
import {
  getTaskSupabaseCall,
  getConversationsSupabaseCall,
  getOffersSupabaseCall,
} from '../lib/supabaseCalls';
import { effortText } from '../lib/tasksHelpers';
import { useSession } from '../providers/session';
import colors, { defaultColor } from '../styles/colors';
import { Profile, TaskOfferStatus, TaskStatus } from '../types';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Task'>;

export const Task = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const session = useSession();
  const [taskOfferActionModalOpen, setTaskOfferActionModalOpen] =
    useState<boolean>(false);
  const [selectedOffer, setSelectedOffer] = useState<
    | {
        offerId: string;
        offerStatus: TaskOfferStatus;
        userId: string;
        fullName: string;
      }
    | undefined
  >(undefined);

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
      console.log('GetTaskOffers', data);
      if (error) {
        Alert.alert('Error', error.message);
      }
      return data;
    },
    { enabled: !!taskId }
  );

  const offers = taskOffersQuery.data;

  const [volunteerCallBusy, setVolunteerCallBusy] =
    useState<boolean>(false);

  const volunteerForTask = async () => {
    setVolunteerCallBusy(true);
    const { error } = await supabase.rpc('create_task_offer', {
      p_task_id: taskId,
    });
    if (error) {
      console.log('Error volunteering for task');
      console.log(error);
    }
    await reload();
    setVolunteerCallBusy(false);
  };

  const offerPressed = (
    offerId: string,
    offerStatus: TaskOfferStatus,
    userId: string,
    fullName: string
  ) => {
    setSelectedOffer({ offerId, offerStatus, userId, fullName });
    setTaskOfferActionModalOpen(true);
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
    setTaskOfferActionModalOpen(false);
    await reload();
  };

  const reload = async () => {
    await taskQuery.refetch();
    await taskOffersQuery.refetch();
    await taskConversationsQuery.refetch();
  };

  const isMyTask = task?.user_id === session.user?.id;

  const myOffer = offers?.find((o) => o.user_id === session.user?.id);

  const taskIsOpen =
    task &&
    (['Partially Assigned', 'Live'] as TaskStatus[]).includes(
      task?.status
    );

  const canVolunteer =
    !isMyTask &&
    (!myOffer ||
      myOffer?.status === 'Cancelled' ||
      myOffer?.status === 'Declined') &&
    taskIsOpen;

  // When the screen is reloaded (in react navigation terms when it is focused)
  useFocusEffect(
    useCallback(() => {
      console.log('Calling useFocusEffect');
      reload();
    }, [])
  );

  if (!task) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <VStack style={{ flex: 1 }}>
        <BackBar onBackPress={() => navigation.goBack()} />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={
                taskQuery.isLoading ||
                taskConversationsQuery.isLoading ||
                taskOffersQuery.isLoading
              }
              onRefresh={reload}
              title="Pull to refresh"
            />
          }
        >
          <Box
            style={{ flex: 1 }}
            bg={colors.white}
            pt={BACK_BAR_CONTENT_HEIGHT + insets.top}
            pb={insets.bottom + 20}
          >
            {isMyTask && <InfoBar message="You created this task" />}
            {task.status === 'Assigned' && (
              <InfoBar message="This task has been assigned" />
            )}
            {task.status === 'Partially Assigned' && (
              <InfoBar message="This task still needs more volunteers" />
            )}
            {task.status === 'Closed' && (
              <InfoBar message="This task is now closed" />
            )}
            {task.status === 'Completed' && (
              <InfoBar message="This task has been completed" />
            )}

            <Box p={20}>
              <TaskInformation
                taskId={task.id}
                taskUserId={task.user_id}
                taskUserFullName={task.user_full_name}
                taskUserAvatarUrl={task.user_avatar_url}
                title={task.title}
                reason={task.reason}
                timing={task.timing}
                duration={effortText(
                  task.effort_days,
                  task.effort_hours,
                  task.effort_minutes
                )}
              />
            </Box>

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
                offers={offers}
                onOfferPressed={offerPressed}
              ></TaskOffers>
            )}

            {myOffer && (
              <VStack shouldWrapChildren bg={colors.white} mt={20}>
                <VStack ph={20} pv={10}>
                  {myOffer.status === 'Pending' && (
                    <Text
                      size="sm"
                      color={colors.gray[700]}
                      weight="semi-bold"
                    >
                      You have sent an offer to volunteer. Let's see
                      what comes back.
                    </Text>
                  )}
                  {myOffer.status === 'Accepted' && (
                    <HStack
                      items="center"
                      spacing={5}
                      shouldWrapChildren
                    >
                      <Text size="sm">🎉</Text>
                      <Text
                        size="sm"
                        color={colors.gray[700]}
                        weight="semi-bold"
                      >
                        Woohoo! Your offer to volunteer has been
                        accepted.
                      </Text>
                    </HStack>
                  )}
                  {myOffer.status === 'Declined' && (
                    <Text
                      size="sm"
                      color={colors.gray[700]}
                      weight="semi-bold"
                    >
                      Your offer to volunteer has very kindly been
                      declined. You can offer to volunteer again, or
                      message {task.user_full_name} if you are still
                      keen.
                    </Text>
                  )}
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
                  pointerEvents="none"
                  radius={20}
                  overflow="hidden"
                >
                  <StaticMapWithMarker
                    point={{
                      type: 'Point',
                      coordinates: [task.longitude, task.latitude],
                    }}
                  />
                </Stack>
              </Stack>
            </VStack>
          </Box>
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
            {canVolunteer && (
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
      {selectedOffer?.fullName && selectedOffer.offerStatus && (
        <TaskOfferActionMenuBottomSheetModal
          isOpen={taskOfferActionModalOpen}
          onClose={() => setTaskOfferActionModalOpen(false)}
          offerStatus={selectedOffer.offerStatus}
          fullName={selectedOffer.fullName}
          onAccept={() =>
            selectedOffer &&
            actionTaskOffer(selectedOffer.offerId, 'Accepted')
          }
          onDecline={() =>
            selectedOffer &&
            actionTaskOffer(selectedOffer.offerId, 'Declined')
          }
          onMessage={() =>
            selectedOffer &&
            navigation.navigate('TaskConversation', {
              taskId,
              userId: selectedOffer?.userId,
            })
          }
        />
      )}
    </>
  );
};
