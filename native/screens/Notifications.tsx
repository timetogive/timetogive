import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  useFocusEffect,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect } from 'react';
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
import { useNotifications } from '../providers/notifications';
import { NotificationsItem } from '../types';
import { MainTabParamList } from './Main';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Notifications'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const Notifications = ({ route, navigation }: Props) => {
  const notif = useNotifications();

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

  const reload = async () => {
    notif.reset();
    await notificationsQuery.refetch();
  };

  // When the screen is reloaded (in react navigation terms when it is focused)
  useFocusEffect(
    useCallback(() => {
      console.log('Calling useFocusEffect');
      reload();
    }, [])
  );

  useEffect(() => {
    // Reset the counter that the user sees on the notifications tab icon
    notif.reset();
  }, []);

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
