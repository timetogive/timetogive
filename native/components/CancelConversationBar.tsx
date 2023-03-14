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
  onCancel: () => void;
}

export const CancelConversationBar = ({ onCancel }: Props) => {
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
          You have volunteered for this task
        </Text>
      </HStack>
      <HStack justify="end">
        <HStack spacing={5}>
          <Button
            color={colors.red[700]}
            onPress={() => onCancel()}
            size="md"
          >
            <Text size="xs" color={colors.white}>
              Cancel
            </Text>
          </Button>
        </HStack>
      </HStack>
    </HStack>
  );
};
