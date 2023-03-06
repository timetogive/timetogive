import { ReactNode } from 'react';
import { Box, HStack } from 'react-native-flex-layout';
import colors from '../styles/colors';
import { MessageBubble } from './MessageBubble';
import { Text } from './Text';

interface Props {
  isMine: boolean;
  children: ReactNode;
}

export const MessageRow = ({ isMine, children }: Props) => {
  return (
    <HStack
      justify={isMine ? 'end' : 'start'}
      mb={20}
      ml={isMine ? 50 : 0}
      mr={isMine ? 0 : 50}
    >
      {children}
    </HStack>
  );
};
