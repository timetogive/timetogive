import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faThumbsDown,
  faThumbTack,
} from '@fortawesome/sharp-solid-svg-icons';
import { Button } from '@rneui/themed';
import { HStack, VStack } from 'react-native-flex-layout';
import colors, { defaultColor } from '../styles/colors';
import { AcceptDeclineButtons } from './AcceptDeclineButtons';
import { Text } from './Text';

interface Props {
  offererName: string;
  onAccept: () => void;
  onDecline: () => void;
}

export const AcceptDeclineConversationBar = ({
  offererName,
  onAccept,
  onDecline,
}: Props) => {
  return (
    <HStack
      pv={10}
      ph={20}
      bg={defaultColor[600]}
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
          {offererName} has volunteered
        </Text>
      </HStack>
      <HStack justify="end" style={{ flex: 1 }}>
        <AcceptDeclineButtons
          onAccept={onAccept}
          onDecline={onDecline}
        />
      </HStack>
    </HStack>
  );
};
