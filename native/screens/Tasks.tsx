import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LocationBar } from '../components/LocationBar';
import { TasksMap } from '../components/TasksMap';
import { TasksList } from '../components/TasksList';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useInfiniteQuery } from 'react-query';
import { Text } from '../components/Text';

import {
  SearchShape,
  SearchLocationDef,
  useSearchLocation,
} from '../providers/searchLocation';
import { MapListMode } from '../types';
import { FlatList } from 'react-native-gesture-handler';
import { RefreshControl } from 'react-native';
import colors, { defaultColor } from '../styles/colors';
import { CompositeScreenProps } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from './Main';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { effortText } from '../lib/tasksHelpers';
import { TaskCardWithDistanceBar } from '../components/TaskCardWithDistanceBar';
import { useCurrentLocation } from '../providers/currentLocation';
import { Point } from 'geojson';

const RESULTS_PER_PAGE = 500;

const supabaseParams = (
  searchLocation: SearchLocationDef,
  currentLocation?: Point
) => {
  if (
    searchLocation.searchShape === SearchShape.PointWithRadius &&
    searchLocation.point
  ) {
    return {
      ...(currentLocation && {
        p_current_point: JSON.parse(JSON.stringify(currentLocation)),
      }),
      p_point_json: JSON.parse(JSON.stringify(searchLocation.point)),
      p_point_distance: searchLocation.distance,
    };
  }
  if (
    searchLocation.searchShape === SearchShape.CustomArea &&
    searchLocation.polygon
  ) {
    return {
      ...(currentLocation && {
        p_current_point: JSON.parse(JSON.stringify(currentLocation)),
      }),
      p_polygon_json: JSON.parse(
        JSON.stringify(searchLocation.polygon)
      ),
    };
  }
  return {};
};

const supabaseCall = (
  pageParam: number,
  searchLocation: SearchLocationDef,
  currentLocation?: Point
) => {
  const startRange = pageParam * RESULTS_PER_PAGE;
  const endRange = startRange + (RESULTS_PER_PAGE - 1);

  const params = supabaseParams(searchLocation, currentLocation);
  console.log('PARAMS');
  console.log(params);
  const query = supabase
    .rpc('search_tasks', params, {
      count: 'exact',
    })
    .select('*')
    .range(startRange, endRange);

  return query;
};

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Tasks'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const Tasks = ({ navigation }: Props) => {
  const [mode, setMapListMode] = useState<MapListMode>(
    MapListMode.Map
  );

  const searchLocation = useSearchLocation();
  const currentLocation = useCurrentLocation();

  const searchTasksQuery = useInfiniteQuery(
    ['SearchTasks'],
    async ({ pageParam = 0 }) => {
      console.log('Calling the search again');
      const query = supabaseCall(
        pageParam,
        searchLocation.searchLocation,
        currentLocation.currentLocation
      );

      console.log('query', query);

      const { data, error, count } = await query;

      if (error) {
        console.log('error', error);
      }

      console.log('data', data);

      return {
        data: data || [],
        count: count || 0,
        currentPage: pageParam,
      };
    },
    {
      refetchOnMount: false,
      getNextPageParam(result) {
        return result.currentPage + 1;
      },
    }
  );

  // If the search location has changed then rerun the search
  useEffect(() => {
    console.log('In Tasks, selected location has changed');
    searchTasksQuery.refetch();
  }, [searchLocation.searchLocation]);

  const tasks =
    searchTasksQuery.data?.pages.flatMap(({ data }) => data) || [];

  return (
    <>
      <LocationBar mode={mode} onChangeMode={setMapListMode} />
      {mode === MapListMode.List ? (
        <TasksList
          tasks={tasks}
          onTaskPressed={(taskId) =>
            navigation.navigate('Task', { taskId })
          }
          searching={searchTasksQuery.isFetching}
          onRefresh={() => searchTasksQuery.refetch()}
        />
      ) : (
        <TasksMap
          tasks={tasks}
          onTaskPressed={(taskId) =>
            navigation.navigate('Task', { taskId })
          }
          searching={searchTasksQuery.isFetching}
        />
      )}
    </>
  );
};
