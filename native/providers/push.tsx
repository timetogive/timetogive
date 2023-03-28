import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import React from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { supabase } from '../lib';
import { useSession } from './session';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

interface Context {
  canPushOnDevice: boolean;
  clearPushToken: () => Promise<void>;
  forceRefresh: () => void;
}

const PushContext = createContext<Context>({
  canPushOnDevice: false,
  clearPushToken: async () => undefined,
  forceRefresh: () => undefined,
});

interface Props {
  children: ReactNode;
}

// Tracks the current location of the user
export const PushProvider = ({ children }: Props): JSX.Element => {
  const session = useSession();
  const [canPushOnDevice, setCanPushOnDevice] =
    useState<boolean>(false);
  const [requestedAccess, setRequestedAccess] = useState(false);

  const [expoPushToken, setExpoPushToken] = useState<
    string | undefined
  >(undefined);

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  console.log(
    'notificationListener.current',
    notificationListener.current
  );
  console.log('responseListener.current', responseListener.current);

  const savePushTokenToServer = async (pushToken: string) => {
    if (session.user) {
      console.log('Saving push token to the server', pushToken);
      const { data, error } = await supabase
        .from('push_tokens')
        .upsert({ push_token: pushToken, user_id: session.user.id });
      if (error) {
        console.log('Error saving push token to server', error);
      }
    }
  };

  const clearPushToken = async () => {
    console.log('Clearing push token from the server');
    if (session.user) {
      console.log('Session has a user');
      const { data, error } = await supabase
        .from('push_tokens')
        .delete()
        .eq('push_token', expoPushToken);
      if (error) {
        console.log('Error clearing push token from server', error);
      }
      setExpoPushToken(undefined);
    }
  };

  const initialise = async () => {
    if (!requestedAccess) {
      setRequestedAccess(true);
      // Only allow push notifications on real devices
      // Just ignore it on simulators
      if (!Device.isDevice) {
        return;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } =
          await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync())
        .data;

      console.log('-------------------------');
      console.log(token);

      await savePushTokenToServer(token);

      // Save the push token to the server

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      console.log('Calling setCanPushOnDevice');
      setCanPushOnDevice(true);
      setExpoPushToken(token);
    }
  };

  const forceRefresh = () => {
    setRequestedAccess(false);
    initialise();
  };

  useEffect(() => {
    const a = async () => {
      console.log('AAAAAAAAAA');
      await initialise();
      notificationListener.current =
        Notifications.addNotificationReceivedListener(
          (notification) => {
            console.log('Notification received', notification);
          }
        );

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener(
          (response) => {
            console.log('Response received', response);
          }
        );
    };

    a();

    return () => {
      console.log('Unmounting push provider');
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(
          responseListener.current
        );
      }
    };
  }, []);

  return (
    <PushContext.Provider
      value={{
        canPushOnDevice,
        clearPushToken,
        forceRefresh,
      }}
    >
      {children}
    </PushContext.Provider>
  );
};

export const usePush = () => {
  const context = useContext(PushContext);

  if (context === undefined) {
    throw new Error(
      '`usePush` hook must be used within a `PushProvider` component'
    );
  }
  return context;
};
