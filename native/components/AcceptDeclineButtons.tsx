import { Button } from '@rneui/themed';
import { HStack, VStack } from 'react-native-flex-layout';
import colors from '../styles/colors';
import { Text } from './Text';

interface Props {
  onAccept: () => void;
  onDecline: () => void;
}

export const AcceptDeclineButtons = ({
  onAccept,
  onDecline,
}: Props) => {
  return (
    <HStack spacing={5}>
      <Button
        color={colors.green[700]}
        onPress={() => onAccept()}
        size="md"
      >
        <Text size="xs" color={colors.white}>
          Accept
        </Text>
      </Button>
      <Button
        color={colors.red[700]}
        onPress={() => onDecline()}
        size="md"
      >
        <Text size="xs" color={colors.white}>
          Decline
        </Text>
      </Button>
    </HStack>
  );
};
