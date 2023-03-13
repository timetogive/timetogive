import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { VStack } from 'react-native-flex-layout';
import { useQuery } from 'react-query';
import { RootStackParamList } from '../App';
import { BackBar } from '../components/BackBar';
import { NotificationCard } from '../components/NotificationCard';
import { Text } from '../components/Text';
import {
  getFeedSupabaseCall,
  getTaskSupabaseCall,
} from '../lib/supabaseCalls';
import { FeedItem } from '../types';
import { MainTabParamList } from './Main';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Notifications'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const Notifications = ({ route, navigation }: Props) => {
  const feedQuery = useQuery(['GetFeed'], async () => {
    const query = getFeedSupabaseCall();
    const { data, error } = await query;
    return data as FeedItem[];
  });

  const feedItems = feedQuery.data;

  const navigateToFeedItem = (feedItem: FeedItem) => {
    const { type } = feedItem;
    switch (type) {
      case 'Task':
      case 'TaskOffer':
        navigation.navigate('Task', {
          taskId: (feedItem.payload as any).taskId,
        });
        return;
      default:
        console.log(
          `Unknown feed item type, don't know where to navigate`
        );
    }
  };

  if (!feedItems) {
    return <></>;
  }

  return (
    <>
      <VStack shouldWrapChildren spacing={5} radius={20} pt={100}>
        {feedItems.map((item) => (
          <NotificationCard
            key={item.id}
            feedItemType={item.type}
            onPress={() => navigateToFeedItem(item)}
          />
        ))}
      </VStack>
    </>
  );
};
