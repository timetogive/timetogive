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
import Toast, { ToastShowParams } from 'react-native-toast-message';
import {
  RealtimeChannel,
  RealtimePresenceState,
} from '@supabase/supabase-js';

interface Context {
  realtimeChannel?: RealtimeChannel;
  presenseState?: RealtimePresenceState;
}

const PresenceContext = createContext<Context>({
  realtimeChannel: undefined,
  presenseState: undefined,
});

interface Props {
  children: ReactNode;
}

// Used to register with supabase that the user is presence / connected
// the purpose is to ensure that on the server we don't send push
// notifications to users who are online
export const PresenceProvider = ({ children }: Props) => {
  const realtimeChannel = useRef<RealtimeChannel>();
  const [presenceState, setPresenceState] =
    useState<RealtimePresenceState>();

  // Run once on load, to register the user as presence
  useEffect(() => {
    // subscribe to inserts in the presence table
    realtimeChannel.current = supabase
      .channel('online')
      .on('presence', { event: 'sync' }, () => {
        setPresenceState(realtimeChannel.current?.presenceState());
        console.log('Presence has changed');
      })
      .subscribe();
    // Unsubscribe when the app / component unmounts
    return () => {
      console.log('Unsubscribing from presence');
      if (realtimeChannel.current) {
        realtimeChannel.current?.unsubscribe();
        supabase.removeChannel(realtimeChannel.current);
      }
    };
  }, []);
  return (
    <PresenceContext.Provider
      value={{
        realtimeChannel: realtimeChannel.current,
        presenseState: presenceState,
      }}
    >
      {children}
    </PresenceContext.Provider>
  );
};

export const usePresence = () => {
  const context = useContext(PresenceContext);

  if (context === undefined) {
    throw new Error(
      '`usePresence` hook must be used within a `PresenceProvider` component'
    );
  }
  return context;
};
