import { Box, HStack } from 'react-native-flex-layout';
import colors from '../styles/colors';
import { MessageBubble } from './MessageBubble';
import { Text } from './Text';

interface Props {
  messageText: string;
  isMine: boolean;
}

export const MessageRow = ({ messageText, isMine }: Props) => {
  return (
    <HStack
      justify={isMine ? 'end' : 'start'}
      mb={20}
      ml={isMine ? 50 : 0}
      mr={isMine ? 0 : 50}
    >
      <MessageBubble isMine={isMine} messageText={messageText} />
    </HStack>
  );
};
