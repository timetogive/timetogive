import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { supabase } from '../lib';
import { queryClient } from '../lib/queryClient';
import { NotificationsItem } from '../types';
import Toast from 'react-native-toast-message';

interface Context {
  count: number;
  reset: () => void;
}

const NotificationsContext = createContext<Context>({
  count: 0,
  reset: () => undefined,
});

interface Props {
  currentRouteName: string;
  children: ReactNode;
}

const toastScreenExclusions = ['TaskConversation'];

// This provider listens for notifications on the notifications
// and takes appropriate actions - it also runs a count
// of new notifications that can be displayed and cleared
export const NotificationsProvider = ({
  currentRouteName,
  children,
}: Props) => {
  // We need to use navigation to avoid showing toast on certain screens
  // Note we can't use the useRoute hook like this:
  // const route = useRoute();
  // because it's only available inside screen components

  // We use state with ref to avoid stale callback from
  // the on event handler in supabase channel
  const [notificationCount, setNotificationCount] =
    useState<number>(0);
  const refNotificationCount = useRef(0);

  const refreshTaskQueries = (taskId: string) => {
    queryClient.refetchQueries(['GetTask', taskId], {
      active: true,
    });
    queryClient.refetchQueries(['GetTaskConversations', taskId], {
      active: true,
    });
    queryClient.refetchQueries(['GetTaskOffers', taskId], {
      active: true,
    });
  };

  const incrementNotificationCount = () => {
    refNotificationCount.current = refNotificationCount.current + 1;
    setNotificationCount(refNotificationCount.current);
  };

  // Run once on load, listens for items going into the notifications
  // on the server, it's pretty simple, it adds to a count
  // that can be cleared using a hook elsewhere in the app
  useEffect(() => {
    // subscribe to inserts in the notifications table
    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (row) => {
          console.log('ROUTE NAME', currentRouteName);
          const notificationsItem = row.new as NotificationsItem;
          // This function acts as a central coordinator
          // for refreshing the various react query caches
          const { type, payload } = notificationsItem;
          if (!payload) {
            return;
          }
          if (type === 'TaskOffer') {
            const { taskId, userFullName, taskTitle } =
              payload as any;
            refreshTaskQueries(taskId);
            if (!toastScreenExclusions.includes(currentRouteName)) {
              Toast.show({
                type: 'success',
                text1: 'A new volunteer!',
                text2: `${userFullName} has offered to help with "${taskTitle}"`,
              });
            }
            incrementNotificationCount();
            return;
          }
          if (type === 'TaskOfferAccepted') {
            const { taskId, userFullName, taskTitle } =
              payload as any;
            refreshTaskQueries(taskId);
            Toast.show({
              type: 'success',
              text1: 'Your offer to help has been accepted!',
              text2: `${userFullName} has accepted your offer to help with "${taskTitle}"`,
            });
            incrementNotificationCount();
            return;
          }
          if (type === 'TaskOfferDeclined') {
            const { taskId, userFullName, taskTitle } =
              payload as any;
            refreshTaskQueries(taskId);
            Toast.show({
              type: 'warning',
              text1: 'Your offer to help has been declined',
              text2: `${userFullName} has sadly declined your offer to help with "${taskTitle}"`,
            });
            incrementNotificationCount();
            return;
          }
          if (type === 'TaskOfferCancelled') {
            const { taskId, userFullName, taskTitle } =
              payload as any;
            refreshTaskQueries(taskId);
            Toast.show({
              type: 'warning',
              text1: 'An offer to help has been withdrawn',
              text2: `${userFullName} has withdrawn the offer to help with "${taskTitle}"`,
            });
            incrementNotificationCount();
            return;
          }
          if (type === 'TaskMessage') {
            const { taskId, userFullName, taskTitle } =
              payload as any;
            refreshTaskQueries(taskId);
            Toast.show({
              type: 'success',
              text1: 'You have a new message!',
              text2: `${userFullName} has messaged you regarding "${taskTitle}"`,
            });
            incrementNotificationCount();
            return;
          }
        }
      )
      .subscribe();
    // Unsubscribe when the component unmounts
    return () => {
      console.log('Unsubscribing from notifications');
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);
  return (
    <NotificationsContext.Provider
      value={{
        count: notificationCount,
        reset: () => setNotificationCount(0),
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);

  if (context === undefined) {
    throw new Error(
      '`useNotifications` hook must be used within a `NotificationsProvider` component'
    );
  }
  return context;
};
