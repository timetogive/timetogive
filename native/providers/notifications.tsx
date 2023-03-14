import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { supabase } from '../lib';
import { queryClient } from '../lib/queryClient';
import { FeedItem } from '../types';
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
  children: ReactNode;
}

// This provider listens for notifications on the feed
// and takes appropriate actions - it also runs a count
// of new notifications that can be displayed and cleared
export const NotificationsProvider = ({ children }: Props) => {
  // We use state with ref to avoid stale callback from
  // the on event handler in supabase channel
  const [notificationCount, setNotificationCount] =
    useState<number>(0);
  const refNotificationCount = useRef(0);

  // Run once on load, listens for items going into the feed
  // on the server, it's pretty simple, it adds to a count
  // that can be cleared using a hook elsewhere in the app
  useEffect(() => {
    console.log('How many times am i called');
    // subscribe to inserts in the feed table
    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feed',
        },
        (row) => {
          const feedItem = row.new as FeedItem;
          // This function acts as a central coordinator
          // for refreshing the various react query caches
          const { type, payload } = feedItem;
          if (!payload) {
            return;
          }
          switch (type) {
            case 'Task':
            case 'TaskOffer':
            case 'TaskOfferAccepted':
            case 'TaskOfferDeclined':
            case 'TaskOfferCancelled':
            case 'TaskMessage':
              const taskId = (payload as any).taskId;
              queryClient.refetchQueries(['GetTask', taskId], {
                active: true,
              });
              queryClient.refetchQueries(
                ['GetTaskConversations', taskId],
                {
                  active: true,
                }
              );
              queryClient.refetchQueries(['GetTaskOffers', taskId], {
                active: true,
              });
              break;
            default:
              console.log('Unknown feed item type', type);
              break;
          }

          refNotificationCount.current =
            refNotificationCount.current + 1;

          setNotificationCount(refNotificationCount.current);

          Toast.show({
            type: 'success',
            text1: 'New notification',
            text2: 'This is some something 👋',
          });
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
