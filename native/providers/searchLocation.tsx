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
import { useCurrentLocation } from './currentLocation';

export enum LocationMode {
  PointWithRadius = 'PointWithRadius',
  CustomBox = 'CustomBox',
  DrawnArea = 'DrawnArea',
}

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
  locationMode: LocationMode.PointWithRadius,
  name: 'Chesham',
  point: defaultSearchPoint,
  distance: 100000,
};

interface Context {
  set: (searchLocation: SearchLocationDef) => void;
  searchLocation: SearchLocationDef;
  // Convenience method to set to live location
  setToLiveLocation: () => void;
}

const SearchLocationContext = createContext<Context>({
  set: () => undefined,
  searchLocation: defaultSearchLocation,
  setToLiveLocation: async () => undefined,
});

interface Props {
  children: ReactNode;
}

export const SearchLocationProvider = ({
  children,
}: Props): JSX.Element => {
  const currentLocation = useCurrentLocation();

  const initialSearchLocation = currentLocation.currentLocation
    ? {
        name: 'Current Location',
        locationMode: LocationMode.PointWithRadius,
        point: currentLocation.currentLocation,
        distance: 100000,
      }
    : defaultSearchLocation;

  const [searchLocation, setSearchLocation] =
    useState<SearchLocationDef>(initialSearchLocation);

  const set = (searchLocation: SearchLocationDef) => {
    setSearchLocation(searchLocation);
  };

  // Set search location to the live location - this is
  // a user triggered action - therefore it's OK to
  // force a refresh and request permission if necessary
  const setToLiveLocation = () => {
    if (currentLocation.currentLocation) {
      const loc: SearchLocationDef = {
        name: 'Current Location',
        locationMode: LocationMode.PointWithRadius,
        point: currentLocation.currentLocation,
        distance: 100000,
      };
      setSearchLocation(loc);
      return;
    }
    if (
      !currentLocation.canAccessOnDevice ||
      !currentLocation.currentLocation
    ) {
      currentLocation.forceRefresh();
      return;
    }
  };

  return (
    <SearchLocationContext.Provider
      value={{
        set,
        searchLocation,
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
