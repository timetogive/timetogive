import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import * as Location from 'expo-location';
import React from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import { Linking } from 'react-native';
import { Point, Polygon } from 'geojson';
import { LocationSubscription } from 'expo-location';

interface Context {
  currentLocation?: Point;
  canAccessOnDevice: boolean;
  forceRefresh: () => void;
}

const CurrentLocationContext = createContext<Context>({
  currentLocation: undefined,
  canAccessOnDevice: false,
  forceRefresh: () => undefined,
});

interface Props {
  children: ReactNode;
}

// Tracks the current location of the user
export const CurrentLocationProvider = ({
  children,
}: Props): JSX.Element => {
  const [currentLocation, setCurrentLocation] = useState<
    Point | undefined
  >(undefined);
  const [canAccessOnDevice, setCanAccessOnDevice] =
    useState<boolean>(false);
  const [requestedAccess, setRequestedAccess] = useState(false);

  const subscription = useRef<LocationSubscription>();

  const watch = async () => {
    // if already watching then stop
    if (subscription.current) {
      subscription.current.remove();
    }
    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
      },
      (loc) => {
        console.log('watchPositionAsync changed', loc);
        const {
          coords: { longitude, latitude },
        } = loc;
        const point: Point = {
          type: 'Point',
          coordinates: [longitude, latitude],
        };
        setCurrentLocation(point);
      }
    );
    subscription.current = sub;
  };

  const initialise = async () => {
    if (!requestedAccess) {
      const { status } =
        await Location.requestForegroundPermissionsAsync();
      const canAccess = status === 'granted';
      setCanAccessOnDevice(canAccess);
      setRequestedAccess(true);
      if (!canAccess) {
        Alert.alert(
          'Unable to access your location',
          'Your device would not allow access to your location. To allow this, you will need to visit the app settings.',
          [
            {
              text: 'Dismiss',
            },
            {
              text: 'Go to settings',
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return;
      }
    }
    watch();
  };

  const forceRefresh = () => {
    setRequestedAccess(false);
    initialise();
  };

  useEffect(() => {
    initialise();
    return () => {
      if (subscription.current) {
        subscription.current.remove();
      }
    };
  }, []);

  return (
    <CurrentLocationContext.Provider
      value={{
        currentLocation,
        canAccessOnDevice,
        forceRefresh,
      }}
    >
      {children}
    </CurrentLocationContext.Provider>
  );
};

export const useCurrentLocation = () => {
  const context = useContext(CurrentLocationContext);

  if (context === undefined) {
    throw new Error(
      '`useLocation` hook must be used within a `CurrentLocationProvider` component'
    );
  }
  return context;
};
