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
import { useSession } from './session';
import { setStatusBarStyle } from 'expo-status-bar';

export enum SearchShape {
  PointWithRadius = 'PointWithRadius',
  CustomArea = 'CustomArea',
}

// This context provider sets the selected location
export interface SearchLocationDef {
  mode: 'current' | 'home' | 'custom' | 'fallback';
  searchShape: SearchShape;
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
const fallbackSearchLocation: SearchLocationDef = {
  mode: 'fallback',
  searchShape: SearchShape.PointWithRadius,
  name: 'Chesham',
  point: defaultSearchPoint,
  distance: 100000,
};

interface Context {
  set: (searchLocation: SearchLocationDef) => void;
  searchLocation: SearchLocationDef;
  // Convenience method to set to live location
  setToCurrentLocation: () => void;
  setToHomeArea: () => void;
}

const SearchLocationContext = createContext<Context>({
  set: () => undefined,
  searchLocation: fallbackSearchLocation,
  setToCurrentLocation: async () => undefined,
  setToHomeArea: async () => undefined,
});

interface Props {
  children: ReactNode;
}

export const SearchLocationProvider = ({
  children,
}: Props): JSX.Element => {
  const currentLocation = useCurrentLocation();
  const session = useSession();
  const [ready, setReady] = useState<boolean>(false);

  const initialSearchLocation = currentLocation.currentLocation
    ? ({
        mode: 'current',
        name: 'Near Me',
        searchShape: SearchShape.PointWithRadius,
        point: currentLocation.currentLocation,
        distance: 100000,
      } as SearchLocationDef)
    : fallbackSearchLocation;

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
  const setToCurrentLocation = () => {
    if (currentLocation.currentLocation) {
      const loc: SearchLocationDef = {
        mode: 'current',
        name: 'Near Me',
        searchShape: SearchShape.PointWithRadius,
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

  // Again triggered by the user when they click on home
  // search button
  const setToHomeArea = () => {
    if (session.user?.home_polygon) {
      const loc: SearchLocationDef = {
        mode: 'home',
        name: 'Home Area',
        searchShape: SearchShape.CustomArea,
        polygon: session.user.home_polygon as any as Polygon,
      };
      set(loc);
      return;
    }
  };

  useEffect(() => {
    const getLastSearchLocationFromServer = async () => {
      console.log('getLastSearchLocationFromServer');
      if (!session.user) {
        return;
      }

      const { data, error } = await supabase
        .from('prefs')
        .select('*')
        .eq('id', session.user.id)
        .single();

      console.log('session.user.id', session.user.id);

      console.log('prefs data', data);
      console.log('error ', error);
      if (data && data.last_search_location) {
        const searchLocation =
          data.last_search_location as any as SearchLocationDef;
        setSearchLocation(searchLocation);
      }
      setReady(true);
    };
    getLastSearchLocationFromServer();
  }, []);

  // When the current location changes, update the search location
  // if it is currently using the fall back location
  useEffect(() => {
    if (
      currentLocation.currentLocation &&
      searchLocation.mode === 'fallback'
    ) {
      const loc: SearchLocationDef = {
        mode: 'current',
        name: 'Near Me',
        searchShape: SearchShape.PointWithRadius,
        point: currentLocation.currentLocation,
        distance: 100000,
      };
      set(loc);
    }
  }, [currentLocation.currentLocation]);

  if (!ready) {
    return <></>;
  }

  return (
    <SearchLocationContext.Provider
      value={{
        set,
        searchLocation,
        setToCurrentLocation,
        setToHomeArea,
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
