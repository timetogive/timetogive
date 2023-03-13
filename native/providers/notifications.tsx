import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { supabase } from '../lib';
import { queryClient } from '../lib/queryClient';
import { FeedItem } from '../types';

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
  const [notificationCount, setNotificationCount] =
    useState<number>(0);
  // Run once on load, listens for items going into the feed
  // on the server, it's pretty simple, it adds to a count
  // that can be cleared using a hook elsewhere in the app
  useEffect(() => {
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
            default:
              console.log('Unknown feed item type', type);
          }

          // Finally increment the count
          setNotificationCount(notificationCount + 1);
        }
      )
      .subscribe();
    // Unsubscribe when the component unmounts
    return () => {
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
