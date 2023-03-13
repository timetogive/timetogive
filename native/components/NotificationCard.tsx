// Dumb component for displaying a notification card

import { Stack } from 'react-native-flex-layout';
import colors from '../styles/colors';
import { Text } from '../components/Text';
import { FeedItemType } from '../types';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
  feedItemType: FeedItemType;
  onPress: () => void;
}

const feedItemText = (feedItemType: FeedItemType) => {
  switch (feedItemType) {
    case 'Task':
      return 'New task you might interested in';
    case 'TaskOffer':
      return 'A new volunteer for your task!';
    case 'TaskOfferAccepted':
      return 'Your offer to volunteer has been accepted';
    case 'TaskOfferDeclined':
      return 'Your offer to volunteer was declined';
    case 'TaskOfferCancelled':
      return 'An active offer to volunteer was cancelled';
    case 'TaskMessage':
      return 'You have a new message';
    default:
      return 'Unknown';
  }
};

export const NotificationCard = ({
  onPress,
  feedItemType,
}: Props) => {
  return (
    <TouchableOpacity onPress={() => onPress()}>
      <Stack p={20} bg={colors.white}>
        <Text size="md" weight="bold">
          {feedItemText(feedItemType)}
        </Text>
      </Stack>
    </TouchableOpacity>
  );
};
