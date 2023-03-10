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
import { Point, Polygon } from 'geojson';

export enum LocationMode {
  LivePointWithRadius = 'LivePointWithRadius',
  CustomPointWithRadius = 'CustomPointWithRadius',
  CustomBox = 'CustomBox',
  DrawnArea = 'DrawnArea',
}

// export interface BBox {
//   northEast: LongLat;
//   southWest: LongLat;
// }

// export interface LongLat {
//   longitude: number;
//   latitude: number;
// }

// This context provider sets the selected location
export interface SearchLocationDef {
  locationMode: LocationMode;
  name?: string;
  point?: Point;
  distance?: number;
  points?: Point[];
}
export const defaultSearchPoint: Point = {
  type: 'Point',
  coordinates: [-0.6130131525736177, 51.70449870090452],
};

// Set a default when the user hasn't set a location
const defaultSearchLocation: SearchLocationDef = {
  locationMode: LocationMode.CustomPointWithRadius,
  name: 'Chesham',
  point: defaultSearchPoint,
  distance: 100000,
};

interface Context {
  set: (searchLocation: SearchLocationDef) => void;
  searchLocation: SearchLocationDef;
  // Can we access the current location on the device
  canAccessLiveLocationOnDevice: () => Promise<boolean>;
  // Refresh the live location (if being used)
  setToLiveLocation: () => Promise<void>;
}

const SearchLocationContext = createContext<Context>({
  set: () => undefined,
  searchLocation: defaultSearchLocation,
  canAccessLiveLocationOnDevice: async () => false,
  setToLiveLocation: async () => undefined,
});

interface Props {
  children: ReactNode;
}

export const SearchLocationProvider = ({
  children,
}: Props): JSX.Element => {
  const [searchLocation, setSearchLocation] =
    useState<SearchLocationDef>(defaultSearchLocation);

  const set = (searchLocation: SearchLocationDef) => {
    setSearchLocation(searchLocation);
  };

  // Convenience method for understand if user has the app permissions
  const canAccessLiveLocationOnDevice =
    async (): Promise<boolean> => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      return status === 'granted';
    };

  // Set search location to the live location
  const setToLiveLocation = async () => {
    const canAccess = await canAccessLiveLocationOnDevice();
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
      return;
    }
    const liveLocation = await Location.getCurrentPositionAsync({});
    const livePoint: Point = {
      type: 'Point',
      coordinates: [
        liveLocation.coords.longitude,
        liveLocation.coords.latitude,
      ],
    };
    const liveLocationDef: SearchLocationDef = {
      locationMode: LocationMode.LivePointWithRadius,
      point: livePoint,
      distance: 100000,
    };
    setSearchLocation(liveLocationDef);
  };

  return (
    <SearchLocationContext.Provider
      value={{
        set,
        searchLocation,
        canAccessLiveLocationOnDevice,
        setToLiveLocation,
      }}
    >
      {children}
    </SearchLocationContext.Provider>
  );
};

export const useSearchLocation = () => {
  const context = useContext(SearchLocationContext);

  if (context === undefined) {
    throw new Error(
      '`useLocation` hook must be used within a `SearchLocationProvider` component'
    );
  }
  return context;
};
