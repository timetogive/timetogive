import { faStar } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button } from '@rneui/themed';
import { VStack, HStack, Stack } from 'react-native-flex-layout';
import { SvgUri } from 'react-native-svg';
import colors from '../styles/colors';
import { GetTaskConversationsResult } from '../types';
import { Text } from '../components/Text';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { faChevronRight } from '@fortawesome/sharp-solid-svg-icons';
import { MiniProfile } from './MiniProfile';

interface Props {
  conversations?: GetTaskConversationsResult | null;
  onClickConversation: (userId: string) => void;
}

export const TaskConversations = ({
  conversations,
  onClickConversation,
}: Props) => {
  if (!conversations || conversations.length === 0) {
    return null;
  }
  return (
    <>
      {conversations && conversations.length > 0 && (
        <VStack shouldWrapChildren bg={colors.white} mt={20}>
          <VStack ph={20} pv={10}>
            <Text
              size="sm"
              color={colors.gray[700]}
              weight="semi-bold"
            >
              Conversations on this task
            </Text>
          </VStack>
          <VStack spacing={10} shouldWrapChildren>
            {conversations.map((c) => (
              <TouchableOpacity
                onPress={() => onClickConversation(c.user_id)}
                key={`${c.user_id}`}
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
                  <MiniProfile
                    avatarUrl={c.avatar_url}
                    fullName={c.full_name}
                  />
                  <HStack spacing={5}>
                    {c.my_unread_count > 0 && (
                      <VStack
                        center
                        radius={15}
                        bg={colors.red[500]}
                        w={25}
                        h={25}
                      >
                        <Text color={colors.white} size="xxs">
                          {c.my_unread_count}
                        </Text>
                      </VStack>
                    )}
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
    </>
  );
};
