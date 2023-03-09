import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LocationBar } from '../components/LocationBar';
import { TasksMap } from '../components/TasksMap';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useInfiniteQuery } from 'react-query';
import { Text } from '../components/Text';

import {
  defaultLongLat,
  LongLat,
  useLocation,
} from '../providers/selectedLocation';
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
import { getDistance } from '../lib';

const RESULTS_PER_PAGE = 500;

const supabaseCall = (
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

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Tasks'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const Tasks = ({ navigation }: Props) => {
  const [mode, setMapListMode] = useState<MapListMode>(
    MapListMode.Map
  );
  const [longLat, setLongLat] = useState<LongLat>(defaultLongLat);
  const location = useLocation();

  const searchTasksQuery = useInfiniteQuery(
    ['SearchTasks'],
    async ({ pageParam = 0 }) => {
      const ll = await location.getSelectedLongLat();
      setLongLat(ll);
      const query = supabaseCall(
        pageParam,
        ll.longitude,
        ll.latitude,
        getDistance(location.selectedLocation)
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
    searchTasksQuery.refetch();
  }, [location.selectedLocation]);

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
          longLat={longLat}
          distance={location.selectedLocation.distance}
          onTaskPressed={(taskId) =>
            navigation.navigate('Task', { taskId })
          }
        />
      )}
    </>
  );
};
