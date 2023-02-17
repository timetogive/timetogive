import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LocationBar } from '../components/LocationBar';
import { TasksList } from '../components/TasksList';
import { TasksMap } from '../components/TasksMap';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useInfiniteQuery } from 'react-query';
import { Text } from '../components/Text';

import {
  defaultLongLat,
  LongLat,
  useSelectedLocation,
} from '../providers/selectedLocation';
import { MapListMode } from '../types';

const RESULTS_PER_PAGE = 500;

export const supabaseCall = (
  pageParam: number,
  longitude: number,
  latitude: number,
  distance: number // distance in m
) => {
  const startRange = pageParam * RESULTS_PER_PAGE;
  const endRange = startRange + (RESULTS_PER_PAGE - 1);

  const query = supabase
    .rpc(
      'search_tasks',
      {
        p_longitude: longitude,
        p_latitude: latitude,
        p_distance: distance,
      },
      { count: 'exact' }
    )
    .select('*')
    .range(startRange, endRange);

  return query;
};

export const Tasks = () => {
  const [mode, setMapListMode] = useState<MapListMode>(
    MapListMode.List
  );
  const [longLat, setLongLat] = useState<LongLat>(defaultLongLat);
  const location = useSelectedLocation();

  const insets = useSafeAreaInsets();

  const SearchTasksQuery = useInfiniteQuery(
    ['SearchTasks'],
    async ({ pageParam = 0 }) => {
      const ll = await location.getLongLat();
      console.log('In Tasks calling getLongLat');
      setLongLat(ll);
      console.log(ll);
      const query = supabaseCall(
        pageParam,
        ll.longitude,
        ll.latitude,
        location.selectedLocation.distance
      );
      const { data, count } = await query;

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

  useEffect(() => {
    console.log('In Tasks, selected location has changed');
    SearchTasksQuery.refetch();
  }, [location.selectedLocation]);

  const tasks =
    SearchTasksQuery.data?.pages.flatMap(({ data }) => data) || [];

  if (SearchTasksQuery.isLoading || SearchTasksQuery.isIdle) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      {mode === MapListMode.List ? (
        <TasksList tasks={tasks} />
      ) : (
        <TasksMap
          tasks={tasks}
          longLat={longLat}
          distance={location.selectedLocation.distance}
        />
      )}

      <LocationBar mode={mode} onChangeMode={setMapListMode} />
    </>
  );
};
