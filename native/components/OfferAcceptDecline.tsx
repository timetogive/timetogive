import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faThumbsDown,
  faThumbTack,
} from '@fortawesome/sharp-solid-svg-icons';
import { Button } from '@rneui/themed';
import { HStack, VStack } from 'react-native-flex-layout';
import colors from '../styles/colors';
import { Text } from './Text';

interface Props {
  offererName: string;
  onAccept: () => void;
  onDecline: () => void;
}

export const OfferAcceptDecline = ({
  offererName,
  onAccept,
  onDecline,
}: Props) => {
  return (
    <HStack
      pv={10}
      ph={20}
      bg={colors.gray[500]}
      justify="between"
      items="center"
    >
      <HStack
        spacing={5}
        shouldWrapChildren
        style={{ flex: 1 }}
        items="center"
      >
        <Text size="sm">🎉</Text>
        <Text size="sm" color={colors.white}>
          {offererName} has offered to help
        </Text>
      </HStack>
      <HStack justify="end">
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
      </HStack>
    </HStack>
  );
};
