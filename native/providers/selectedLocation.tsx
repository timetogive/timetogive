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
  set: (selectedLocation: SelectedLocation) => void;
  getLongLat: () => Promise<LongLat>;
  setToCurrentLocation: () => void;
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
  distance: 10000,
};

const SelectedLocationContext = createContext<Context>({
  set: () => undefined,
  selectedLocation: defaultSelectedLocation,
  getLongLat: async () => defaultLongLat,
  setToCurrentLocation: () => undefined,
});

interface Props {
  children: ReactNode;
}

export const SelectedLocationProvider = ({
  children,
}: Props): JSX.Element => {
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation>(defaultSelectedLocation);

  useEffect(() => {
    (async () => {
      await setToCurrentLocation();
    })();
  }, []);

  const set = (selectedLocation: SelectedLocation) => {
    setSelectedLocation(selectedLocation);
  };

  const getLongLat = async (): Promise<LongLat> => {
    if (selectedLocation.mode === SelectedLocationMode.Current) {
      let location = await Location.getCurrentPositionAsync({});
      if (location) {
        return {
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
        };
      }
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

  const setToCurrentLocation = async () => {
    console.log('setToCurrentLocation');
    let { status } =
      await Location.requestForegroundPermissionsAsync();
    console.log(status);
    if (status === 'granted') {
      setSelectedLocation({
        mode: SelectedLocationMode.Current,
        distance: 10000,
      });
      return;
    }
    Alert.alert(
      'Permission Denied',
      'Your device would now allow your current location to be used. Go to app settings and allow location to be used',
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
        { text: 'Settings', onPress: () => Linking.openSettings() },
      ]
    );
    console.log(
      'Location permission denied - setting a default location'
    );
    setSelectedLocation(defaultSelectedLocation);
  };

  return (
    <SelectedLocationContext.Provider
      value={{
        set,
        selectedLocation,
        getLongLat,
        setToCurrentLocation,
      }}
    >
      {children}
    </SelectedLocationContext.Provider>
  );
};

export const useSelectedLocation = () => {
  const context = useContext(SelectedLocationContext);

  if (context === undefined) {
    throw new Error(
      '`useSelectedLocation` hook must be used within a `SelectedLocationProvider` component'
    );
  }
  return context;
};
