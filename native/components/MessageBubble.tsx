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
        shadowColor: colors.gray[600],
        shadowOffset: { width: -4, height: 6 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 2,
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
