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
import { supabase } from '../lib/supabase';

export enum LocationMode {
  PointWithRadius = 'PointWithRadius',
  CustomArea = 'CustomArea',
}

// This context provider sets the selected location
export interface SearchLocationDef {
  locationMode: LocationMode;
  name?: string;
  point?: Point;
  distance?: number;
  polygon?: Polygon;
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

  const setSearchLocationOnServer = async (
    searchLocation: SearchLocationDef
  ) => {
    console.log(
      'Saving search location to the server',
      searchLocation
    );
    const { error } = await supabase.rpc(
      'save_last_search_location',
      {
        p_search_location: searchLocation as any,
      }
    );
    if (error) {
      console.log('Error saving search location to server', error);
    }
  };

  const set = (searchLocation: SearchLocationDef) => {
    // Set the context
    setSearchLocation(searchLocation);
    // Save to the server
    setSearchLocationOnServer(searchLocation);
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
      set(loc);
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
