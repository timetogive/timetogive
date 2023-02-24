import { Box } from 'react-native-flex-layout';
import colors from '../styles/colors';
import { Text } from './Text';

interface Props {
  messageText: string;
  isMine: boolean;
}

export const MessageBubble = ({ messageText, isMine }: Props) => {
  return (
    <Box
      pv={10}
      ph={20}
      style={{
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.7,
        shadowRadius: 5,
        elevation: 1,
        backgroundColor: isMine
          ? colors.green[800]
          : colors.gray[800],
      }}
      radius={10}
    >
      <Text size="sm" color={colors.white}>
        {messageText}
      </Text>
    </Box>
  );
};
