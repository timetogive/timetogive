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
  getNotificationsSupabaseCall,
  getTaskSupabaseCall,
} from '../lib/supabaseCalls';
import { NotificationsItem } from '../types';
import { MainTabParamList } from './Main';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Notifications'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const Notifications = ({ route, navigation }: Props) => {
  const notificationsQuery = useQuery(
    ['GetNotifications'],
    async () => {
      const query = getNotificationsSupabaseCall();
      const { data, error } = await query;
      return data as NotificationsItem[];
    }
  );

  const notificationsItems = notificationsQuery.data;

  const navigateToNotificationsItem = (
    notificationsItem: NotificationsItem
  ) => {
    const { type } = notificationsItem;
    switch (type) {
      case 'Task':
      case 'TaskOffer':
        navigation.navigate('Task', {
          taskId: (notificationsItem.payload as any).taskId,
        });
        return;
      default:
        console.log(
          `Unknown notifications item type, don't know where to navigate`
        );
    }
  };

  if (!notificationsItems) {
    return <></>;
  }

  return (
    <>
      <VStack shouldWrapChildren spacing={5} radius={20} pt={100}>
        {notificationsItems.map((item) => (
          <NotificationCard
            key={item.id}
            notificationsItemType={item.type}
            onPress={() => navigateToNotificationsItem(item)}
          />
        ))}
      </VStack>
    </>
  );
};
