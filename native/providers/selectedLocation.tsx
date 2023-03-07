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
  Current,
  Custom,
}

export interface LongLat {
  longitude: number;
  latitude: number;
}

// This context provider sets the selected location
export interface SelectedLocation {
  mode: SelectedLocationMode;
  custom?: {
    name?: string;
    longitude: number;
    latitude: number;
  };
  distance: number; // distance in m
}

interface Context {
  // Can we access the current location on the device
  canAccessCurrentLocation: () => Promise<boolean>;
  // The live long lat of the user - might throw an error alert
  getCurrentLongLat: () => Promise<LongLat>;
  // The global long lat of the user - whatever they've selected
  getSelectedLongLat: () => Promise<LongLat>;
  // Set the global long lat of the user to the current location - might throw an error alert
  setSelectedToCurrentLocation: () => void;
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
  mode: SelectedLocationMode.Custom,
  custom: {
    ...defaultLongLat,
    name: 'Chesham',
  },
  distance: 100000,
};

const LocationContext = createContext<Context>({
  canAccessCurrentLocation: async () => false,
  getCurrentLongLat: async () => defaultLongLat,
  getSelectedLongLat: async () => defaultLongLat,
  setSelectedToCurrentLocation: () => undefined,
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
      await setSelectedToCurrentLocation();
    })();
  }, []);

  const set = (selectedLocation: SelectedLocation) => {
    setSelectedLocation(selectedLocation);
  };

  const canAccessCurrentLocation = async (): Promise<boolean> => {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    return status === 'granted';
  };
  // Returns the current live location of the user
  // Will pop an alert if the user has not granted permission
  const getCurrentLongLat = async (): Promise<LongLat> => {
    const canAccess = await canAccessCurrentLocation();

    if (!canAccess) {
      Alert.alert(
        'Permission Denied',
        'Your device would now allow your current location to be used. Go to app settings and allow location to be used',
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
    if (selectedLocation.mode === SelectedLocationMode.Current) {
      return await getCurrentLongLat();
    }
    if (
      selectedLocation.custom?.longitude &&
      selectedLocation.custom?.longitude
    ) {
      return {
        longitude: selectedLocation.custom?.longitude,
        latitude: selectedLocation.custom?.latitude,
      };
    }
    return defaultLongLat;
  };

  const setSelectedToCurrentLocation = async () => {
    let { status } =
      await Location.requestForegroundPermissionsAsync();
    console.log(status);
    if (status === 'granted') {
      setSelectedLocation({
        mode: SelectedLocationMode.Current,
        distance: 100000,
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
        canAccessCurrentLocation,
        getCurrentLongLat,
        getSelectedLongLat,
        setSelectedToCurrentLocation,
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
