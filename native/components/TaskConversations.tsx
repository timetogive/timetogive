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
                        uri={c.avatar_url}
                      />
                    </Stack>
                    <VStack spacing={2} shouldWrapChildren>
                      <Text size="xxs" color={colors.gray[500]}>
                        {c.full_name}
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
                        {c.my_unread_count}
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
    </>
  );
};
