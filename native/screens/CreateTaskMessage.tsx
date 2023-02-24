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
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { VStack, HStack, Box, Stack } from 'react-native-flex-layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';
import { useQuery } from 'react-query';
import { RootStackParamList } from '../App';
import { BackBar } from '../components/BackBar';
import { Text, translateFontSize } from '../components/Text';
import { supabase } from '../lib/supabase';
import colors, { defaultColor } from '../styles/colors';
import { MapListMode } from '../types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'CreateTaskMessage'
>;

const getProfileSupabaseCall = (userId: string) => {
  const query = supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return query;
};

export const CreateTaskMessage = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { toUserId } = route.params;

  const [message, setMessage] = useState<string | undefined>(
    undefined
  );

  const searchTasksQuery = useQuery(
    ['GetProfile', toUserId],
    async () => {
      const query = getProfileSupabaseCall(toUserId);
      const { data } = await query;
      return data;
    },
    { enabled: !!toUserId }
  );

  const toUser = searchTasksQuery.data;

  return (
    <>
      <BackBar navigation={navigation}>
        {toUser && (
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
                uri={toUser.avatar_url}
              />
            </Stack>
            <VStack spacing={2} shouldWrapChildren>
              <Text size="xxs" color={colors.white}>
                James Allchin
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
      <VStack justify="end" style={{ flex: 1 }} shouldWrapChildren>
        <Text>Messages will go here</Text>
      </VStack>
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
        cc
        {message && (
          <TouchableOpacity
            onPress={() => console.log('Send message pressed')}
          >
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
    </>
  );
};
