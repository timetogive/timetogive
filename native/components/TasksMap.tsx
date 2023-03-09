import { FlatList } from 'react-native';
import {
  SearchTasksResult,
  SearchTasksResultItem,
  TaskReason,
} from '../types';
import MapView, {
  PROVIDER_GOOGLE,
  Region,
  Marker,
  LatLng,
} from 'react-native-maps';
import { memo, useEffect, useState } from 'react';
import { LongLat } from '../providers/selectedLocation';
import React from 'react';
import { Box, VStack } from 'react-native-flex-layout';
import { faLocationPin } from '@fortawesome/sharp-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import colors from '../styles/colors';
import { effortText, getTtgIcon } from '../lib/tasksHelpers';
import { Text } from '../components/Text';
import { TaskCard } from './TaskCard';

interface TasksMapMarkerProps {
  task: SearchTasksResultItem;
  latitude: number;
  longitude: number;
  onPress?: () => void;
}

// Pure component important for performance
const MapMarker = memo(
  ({ task, latitude, longitude, onPress }: TasksMapMarkerProps) => {
    const googleLatLng: LatLng = {
      latitude,
      longitude,
    };
    return (
      <Marker coordinate={googleLatLng} onPress={onPress}>
        <VStack position="relative" h={40} w={40} center>
          <FontAwesomeIcon
            icon={faLocationPin}
            color={colors.pink[400]}
            size={40}
            style={{ opacity: 0.9 }}
          />
          <VStack position="absolute" top={8}>
            <FontAwesomeIcon
              icon={getTtgIcon(task.reason)}
              color={colors.white}
              size={15}
            />
          </VStack>
        </VStack>
      </Marker>
    );
  }
);

interface TasksMapProps {
  tasks: SearchTasksResult;
  longLat: LongLat;
  distance: number;
  onTaskPressed: (taskId: string) => void;
}

export const TasksMap = ({
  tasks,
  longLat,
  distance,
  onTaskPressed,
}: TasksMapProps) => {
  // Map state
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: longLat.latitude,
    longitude: longLat.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [selectedTask, setSelectedTask] = useState<
    SearchTasksResultItem | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      setMapRegion({
        latitude: longLat.latitude,
        longitude: longLat.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, [longLat]);

  return (
    <Box style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        region={mapRegion}
        showsUserLocation
      >
        {tasks.map((task: any) => (
          <MapMarker
            key={task.id}
            task={task}
            longitude={task.longitude}
            latitude={task.latitude}
            onPress={() => setSelectedTask(task)}
          />
        ))}
      </MapView>
      {selectedTask && (
        <Box
          position="absolute"
          bottom={50}
          right={0}
          left={0}
          mh={50}
        >
          <TaskCard
            key={selectedTask.id}
            taskId={selectedTask.id}
            taskUserId={selectedTask.user_id}
            taskUserFullName={selectedTask.full_name}
            taskUserAvatarUrl={selectedTask.avatar_url}
            title={selectedTask.title}
            reason={selectedTask.reason}
            timing={selectedTask.timing}
            duration={effortText(
              selectedTask.effort_days,
              selectedTask.effort_hours,
              selectedTask.effort_minutes
            )}
            onPress={() => onTaskPressed(selectedTask.id)}
          />
        </Box>
      )}
    </Box>
  );
};
