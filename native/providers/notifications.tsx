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
import Toast, { ToastShowParams } from 'react-native-toast-message';

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

// This provider listens for notifications on the notifications
// and takes appropriate actions - it also runs a count
// of new notifications that can be displayed and cleared
export const NotificationsProvider = ({ children }: Props) => {
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

  const toast = (toastParams: ToastShowParams) => {
    Toast.show(toastParams);
  };

  const setNotificationAsDelivered = async (id: string) => {
    await supabase.rpc('mark_notification_delivered', {
      p_notification_id: id,
    });
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
          const notificationsItem = row.new as NotificationsItem;
          // This function acts as a central coordinator
          // for refreshing the various react query caches
          const { id, type, payload } = notificationsItem;
          if (!payload) {
            return;
          }
          console.log('New notification...');
          console.log(payload);
          incrementNotificationCount();
          if (type === 'TaskOffer') {
            const {
              taskId,
              taskOfferUserFullName,
              taskTitle,
              taskOfferUserId,
            } = payload as any;
            refreshTaskQueries(taskId);
            queryClient.refetchQueries(
              ['GetPendingOffer', taskId, taskOfferUserId],
              {
                active: true,
              }
            );
            toast({
              type: 'info',
              text1: 'A new volunteer!',
              text2: `${taskOfferUserFullName} has offered to help with "${taskTitle}"`,
            });
            return;
          }
          if (type === 'TaskOfferAccepted') {
            const {
              taskId,
              taskOfferUserFullName,
              taskTitle,
              taskOwnerId,
            } = payload as any;
            refreshTaskQueries(taskId);
            queryClient.refetchQueries(
              ['GetPendingOffer', taskId, taskOwnerId],
              {
                active: true,
              }
            );
            toast({
              type: 'info',
              text1: 'Your offer to help has been accepted!',
              text2: `${taskOfferUserFullName} has accepted your offer to help with "${taskTitle}"`,
            });
            return;
          }
          if (type === 'TaskOfferDeclined') {
            const {
              taskId,
              taskOfferUserFullName,
              taskTitle,
              taskOwnerId,
            } = payload as any;
            refreshTaskQueries(taskId);
            queryClient.refetchQueries(
              ['GetPendingOffer', taskId, taskOwnerId],
              {
                active: true,
              }
            );
            toast({
              type: 'info',
              text1: 'Your offer to help has been declined',
              text2: `${taskOfferUserFullName} has sadly declined your offer to help with "${taskTitle}"`,
            });
            return;
          }
          if (type === 'TaskOfferCancelled') {
            const {
              taskId,
              taskOfferUserFullName,
              taskTitle,
              taskOfferUserId,
            } = payload as any;
            refreshTaskQueries(taskId);
            queryClient.refetchQueries(
              ['GetPendingOffer', taskId, taskOfferUserId],
              {
                active: true,
              }
            );
            toast({
              type: 'info',
              text1: 'An offer to help has been withdrawn',
              text2: `${taskOfferUserFullName} has withdrawn the offer to help with "${taskTitle}"`,
            });
            return;
          }
          if (type === 'TaskMessage') {
            const { taskId } = payload as any;
            // Don't bother with toast for messages - would be too annoying
            // just stick with incrementing the notification count
            refreshTaskQueries(taskId);
            return;
          }
          // Record that we've seen this notification on server
          setNotificationAsDelivered(id);
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
