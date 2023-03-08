import {
  faChevronLeft,
  faList,
  faLocationDot,
  faPaperPlaneTop,
  faStar,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Input } from '@rneui/themed';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { VStack, HStack, Box, Stack } from 'react-native-flex-layout';
import { FlatList } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';
import { useQuery } from 'react-query';
import { RootStackParamList } from '../App';
import { BackBar } from '../components/BackBar';
import { MessageBubble } from '../components/MessageBubble';
import { MessageRow } from '../components/MessageRow';
import { AcceptDeclineConversationBar } from '../components/AcceptDeclineConversationBar';
import { CancelConversationBar } from '../components/CancelConversationBar';
import { Text, translateFontSize } from '../components/Text';
import { supabase } from '../lib/supabase';
import {
  getMessagesSupabaseCall,
  getPendingOfferSupabaseCall,
  getProfileSupabaseCall,
  getTaskSupabaseCall,
} from '../lib/supabaseCalls';
import { useSession } from '../providers/session';
import colors, { defaultColor } from '../styles/colors';
import { MapListMode } from '../types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'TaskConversation'
>;

export const TaskConversation = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const session = useSession();
  const [messages, setMessages] = useState<
    {
      from_user_id: string;
      to_user_id: string;
      message_text: string;
    }[]
  >([]);
  const [message, setMessage] = useState<string | undefined>(
    undefined
  );

  const { userId, taskId } = route.params;

  const profileQuery = useQuery(
    ['GetProfile', userId],
    async () => {
      const query = getProfileSupabaseCall(userId);
      const { data } = await query;
      return data;
    },
    { enabled: !!userId }
  );

  const user = profileQuery.data;

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
  const isMyTask = task?.user_id === session.user?.id;

  const pendingOfferQuery = useQuery(
    ['GetPendingOffer', taskId, userId],
    async () => {
      const query = getPendingOfferSupabaseCall(
        taskId,
        isMyTask ? userId : session.user?.id || ''
      );
      const { data, error } = await query;
      console.log('GetPendingOffer');
      console.log(data);
      return data;
    },
    { enabled: !!task && !!userId && !!session.user }
  );

  const pendingOffer = pendingOfferQuery.data;

  const messagesQuery = useQuery(
    ['GetTaskConversationMessages', taskId, userId],
    async () => {
      const query = getMessagesSupabaseCall(
        taskId,
        session.user?.id || '',
        userId
      );
      const { data } = await query;
      return data;
    },
    { enabled: !!userId && !!taskId }
  );

  useEffect(() => {
    if (messagesQuery.data) {
      setMessages(messagesQuery.data);
    }
  }, [messagesQuery.data]);

  useEffect(() => {
    console.log('messages changed');
    console.log(messages);
    const markRead = async () => {
      // When the message list gets updated mark them as read
      const { data, error } = await supabase.rpc(
        'mark_task_conversation_read',
        {
          p_task_id: taskId,
          p_user_id: userId,
        }
      );
      console.log('data', data);
      console.log('error', error);
    };
    markRead();
  }, [messages]);

  const myChannel = supabase.channel(`${taskId}-${session.user?.id}`);
  const theirChannel = supabase.channel(`${taskId}-${userId}`);

  // Setup realtime channels
  useEffect(() => {
    console.log('Calling useEffect');
    myChannel
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to my channel');
        }
      })
      .on('broadcast', { event: 'message' }, ({ payload }: any) => {
        console.log('Realtime update received');
        const newMessages = messages.concat(payload);
        setMessages(newMessages);
      });
    theirChannel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Subscribed to their channel');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    return () => {
      myChannel.unsubscribe();
      theirChannel.unsubscribe();
      supabase.removeChannel(myChannel);
      supabase.removeChannel(theirChannel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async () => {
    if (!message) {
      return;
    }

    // Send message via API (so it persists in the DB)
    const { error, data } = await supabase.rpc(
      'create_task_message',
      {
        task_id: taskId,
        to_user_id: userId,
        message_text: message,
      }
    );

    // Pop a message into messages to avoid refetching
    setMessages(
      messages.concat({
        to_user_id: userId,
        from_user_id: session.user?.id || '',
        message_text: message,
      })
    );

    // Also broadcast the message via the realtime
    // channel so that the other user gets it (if online)
    theirChannel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        theirChannel.send({
          type: 'broadcast',
          event: 'message',
          payload: {
            to_user_id: userId,
            from_user_id: session.user?.id || '',
            message_text: message,
          },
        });
      }
    });

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    setMessage(undefined);
  };

  return (
    <Stack style={{ flex: 1 }}>
      <BackBar navigation={navigation}>
        {user && (
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
                uri={user.avatar_url}
              />
            </Stack>
            <VStack spacing={2} shouldWrapChildren>
              <Text size="xxs" color={colors.white}>
                {user.full_name}
              </Text>
              <HStack items="center" spacing={4}>
                <FontAwesomeIcon
                  icon={faStar}
                  color={colors.yellow[400]}
                  size={15}
                />
                <Text size="xs" color={colors.white}>
                  5.0
                </Text>
              </HStack>
            </VStack>
          </HStack>
        )}
      </BackBar>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <VStack justify="end" style={{ flex: 1 }}>
          <FlatList
            data={messages}
            renderItem={(message) => (
              <MessageRow
                isMine={
                  message.item.from_user_id === session.user?.id
                }
              >
                <MessageBubble
                  isMine={
                    message.item.from_user_id === session.user?.id
                  }
                  messageText={message.item.message_text}
                />
              </MessageRow>
            )}
            keyExtractor={(item, i) =>
              `${item.from_user_id}${item.to_user_id}${i}`
            }
            style={{
              backgroundColor: colors.white,
              paddingTop: 10,
              paddingHorizontal: 10,
            }}
            contentContainerStyle={{
              justifyContent: 'flex-end',
              flex: 1,
            }}
          />
          {isMyTask && pendingOffer && user?.full_name && (
            <AcceptDeclineConversationBar
              offererName={user.full_name}
              onAccept={() => console.log('Accepted')}
              onDecline={() => console.log('Declined')}
            />
          )}
          {!isMyTask && pendingOffer && (
            <CancelConversationBar
              onCancel={() => console.log('Cancelled')}
            />
          )}
          <HStack
            pb={insets.bottom - 5}
            bg={defaultColor[800]}
            spacing={10}
            ph={20}
            pt={10}
            items="center"
          >
            <HStack
              bg={colors.white}
              style={{ flex: 1 }}
              radius={25}
              ph={15}
              minH={40}
              maxH={150}
              items="center"
            >
              <Input
                value={message}
                multiline
                onChangeText={setMessage}
                placeholder="Type message here..."
                labelStyle={{
                  margin: 0,
                  padding: 0,
                  height: 0,
                }}
                inputContainerStyle={{
                  borderBottomWidth: 0,
                }}
                inputStyle={{
                  fontSize: translateFontSize('sm'),
                  color: colors.gray[600],
                  lineHeight: 25,
                  paddingVertical: 15,
                }}
                errorStyle={{
                  margin: 0,
                  padding: 0,
                  height: 0,
                }}
              />
            </HStack>
            {message && (
              <TouchableOpacity onPress={() => sendMessage()}>
                <Stack
                  style={{ backgroundColor: colors.white }}
                  center
                  radius={100}
                  h={40}
                  w={40}
                  p={5}
                >
                  <VStack center>
                    <FontAwesomeIcon
                      icon={faPaperPlaneTop}
                      size={20}
                      color={defaultColor[500]}
                    />
                  </VStack>
                </Stack>
              </TouchableOpacity>
            )}
          </HStack>
        </VStack>
      </KeyboardAvoidingView>
    </Stack>
  );
};