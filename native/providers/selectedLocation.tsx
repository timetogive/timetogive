import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import * as Location from 'expo-location';
import React from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import { Linking } from 'react-native';

export enum SelectedLocationMode {
  LivePointWithRadius = 'LivePointWithRadius',
  CustomPointWithRadius = 'CustomPointWithRadius',
  CustomBox = 'CustomBox',
}

export interface LongLat {
  longitude: number;
  latitude: number;
}

// This context provider sets the selected location
export interface SelectedLocation {
  livePointWithRadius?: {
    distance: number;
  };
  customPointWithRadius?: {
    name?: string;
    longLat: LongLat;
    distance: number;
  };
  customBox?: {
    name?: string;
    points: LongLat[];
  };
}

interface Context {
  // Can we access the current location on the device
  canAccessLiveLocation: () => Promise<boolean>;
  // The live long lat of the user - might throw an error alert
  getLiveLongLat: () => Promise<LongLat>;
  // The global long lat of the user - whatever they've selected
  getSelectedLongLat: () => Promise<LongLat>;
  // Set the global long lat of the user to the live location - might throw an error alert
  setSelectedToLiveLocation: () => void;
  // Manually set the global long lat of the user
  set: (selectedLocation: SelectedLocation) => void;
  selectedLocation: SelectedLocation;
}

export const defaultLongLat: LongLat = {
  longitude: -0.6130131525736177,
  latitude: 51.70449870090452,
};

// Set a default when the user hasn't set a location
const defaultSelectedLocation: SelectedLocation = {
  customPointWithRadius: {
    name: 'Chesham',
    longLat: defaultLongLat,
    distance: 100000,
  },
};

const LocationContext = createContext<Context>({
  canAccessLiveLocation: async () => false,
  getLiveLongLat: async () => defaultLongLat,
  getSelectedLongLat: async () => defaultLongLat,
  setSelectedToLiveLocation: () => undefined,
  set: () => undefined,
  selectedLocation: defaultSelectedLocation,
});

interface Props {
  children: ReactNode;
}

export const LocationProvider = ({
  children,
}: Props): JSX.Element => {
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation>(defaultSelectedLocation);

  useEffect(() => {
    (async () => {
      await setSelectedToLiveLocation();
    })();
  }, []);

  const set = (selectedLocation: SelectedLocation) => {
    setSelectedLocation(selectedLocation);
  };

  const canAccessLiveLocation = async (): Promise<boolean> => {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    return status === 'granted';
  };
  // Returns the current live location of the user
  // Will pop an alert if the user has not granted permission
  const getLiveLongLat = async (): Promise<LongLat> => {
    const canAccess = await canAccessLiveLocation();

    if (!canAccess) {
      Alert.alert(
        'Permission Denied',
        'Your device would not allow your current location to be used. Go to app settings and allow location to be used',
        [
          {
            text: 'OK',
          },
          { text: 'Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return defaultLongLat;
    }

    let location = await Location.getCurrentPositionAsync({});

    return {
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
    };
  };

  const getSelectedLongLat = async (): Promise<LongLat> => {
    if (selectedLocation.livePointWithRadius) {
      return await getLiveLongLat();
    }
    if (selectedLocation.customPointWithRadius) {
      return selectedLocation.customPointWithRadius.longLat;
    }
    return defaultLongLat;
  };

  const setSelectedToLiveLocation = async () => {
    let { status } =
      await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      setSelectedLocation({
        livePointWithRadius: {
          distance: 100000,
        },
      });
      return;
    }
    // Fall back show alert and set to a default location
    Alert.alert(
      'Permission Denied',
      'Your device would now allow your current location to be used. Go to app settings and allow location to be used',
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
        { text: 'Settings', onPress: () => Linking.openSettings() },
      ]
    );
    setSelectedLocation(defaultSelectedLocation);
  };

  return (
    <LocationContext.Provider
      value={{
        canAccessLiveLocation,
        getLiveLongLat,
        getSelectedLongLat,
        setSelectedToLiveLocation,
        set,
        selectedLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);

  if (context === undefined) {
    throw new Error(
      '`useLocation` hook must be used within a `LocationProvider` component'
    );
  }
  return context;
};
