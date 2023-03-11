import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LocationBar } from '../components/LocationBar';
import { TasksMap } from '../components/TasksMap';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useInfiniteQuery } from 'react-query';
import { Text } from '../components/Text';

import {
  LocationMode,
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

const RESULTS_PER_PAGE = 500;

const supabaseParams = (searchLocation: SearchLocationDef) => {
  if (
    searchLocation.locationMode === LocationMode.PointWithRadius &&
    searchLocation.point
  ) {
    return {
      p_point_longitude: searchLocation.point.coordinates[0],
      p_point_latitude: searchLocation.point.coordinates[1],
      p_point_distance: searchLocation.distance,
    };
  }
  if (
    searchLocation.locationMode === LocationMode.CustomBox &&
    searchLocation.points
  ) {
    return {
      p_bbox_north_east_longitude:
        searchLocation.points[0].coordinates[0],
      p_bbox_north_east_latitude:
        searchLocation.points[0].coordinates[1],
      p_bbox_south_west_longitude:
        searchLocation.points[1].coordinates[0],
      p_bbox_south_west_latitude:
        searchLocation.points[1].coordinates[1],
    };
  }
  return {};
};

const supabaseCall = (
  pageParam: number,
  searchLocation: SearchLocationDef
) => {
  const startRange = pageParam * RESULTS_PER_PAGE;
  const endRange = startRange + (RESULTS_PER_PAGE - 1);

  const query = supabase
    .rpc('search_tasks', supabaseParams(searchLocation), {
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

  const searchTasksQuery = useInfiniteQuery(
    ['SearchTasks'],
    async ({ pageParam = 0 }) => {
      console.log('Calling the search again');
      const query = supabaseCall(
        pageParam,
        searchLocation.searchLocation
      );
      const { data, error, count } = await query;

      if (error) {
        console.log('error', error);
      }

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

  if (searchTasksQuery.isLoading || searchTasksQuery.isIdle) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <LocationBar mode={mode} onChangeMode={setMapListMode} />
      {mode === MapListMode.List ? (
        <FlatList
          data={tasks}
          renderItem={(task) => (
            <TaskCardWithDistanceBar
              key={task.item.id}
              taskId={task.item.id}
              taskUserId={task.item.user_id}
              taskUserFullName={task.item.full_name}
              taskUserAvatarUrl={task.item.avatar_url}
              title={task.item.title}
              reason={task.item.reason}
              timing={task.item.timing}
              duration={effortText(
                task.item.effort_days,
                task.item.effort_hours,
                task.item.effort_minutes
              )}
              onPress={() =>
                navigation.navigate('Task', { taskId: task.item.id })
              }
              showDistanceBar
            />
          )}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={searchTasksQuery.isLoading}
              onRefresh={searchTasksQuery.refetch}
              title="Pull to refresh"
            />
          }
          style={{
            backgroundColor: colors.white,
            flex: 1,
            paddingTop: 10,
            paddingRight: 15,
          }}
        />
      ) : (
        <TasksMap
          tasks={tasks}
          onTaskPressed={(taskId) =>
            navigation.navigate('Task', { taskId })
          }
        />
      )}
    </>
  );
};
