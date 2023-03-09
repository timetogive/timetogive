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
import { memo, useEffect, useRef, useState } from 'react';
import { LongLat } from '../providers/selectedLocation';
import React from 'react';
import { Box, HStack, Stack, VStack } from 'react-native-flex-layout';
import {
  faLocationArrow,
  faLocationPin,
} from '@fortawesome/sharp-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import colors, { defaultColor } from '../styles/colors';
import { effortText, getTtgIcon } from '../lib/tasksHelpers';
import { Text } from '../components/Text';
import { TaskCard } from './TaskCard';
import { Button } from '@rneui/themed';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
  onTaskPressed: (taskId: string) => void;
  onSearchThisAreaPressed: () => void;
}

export const TasksMap = ({
  tasks,
  longLat,
  onTaskPressed,
}: TasksMapProps) => {
  // Map state
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: longLat.latitude,
    longitude: longLat.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mapRef = useRef<MapView>(null);
  const [selectedTask, setSelectedTask] = useState<
    SearchTasksResultItem | undefined
  >(undefined);

  const [mapMoved, setMapMoved] = useState<boolean>(false);

  // The location might get changed from up
  // the component tree, so we need to update
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

  const searchThisAreaPressed = async () => {
    const boundaries = await mapRef.current?.getMapBoundaries();
    console.log(boundaries);
  };

  return (
    <Box style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        region={mapRegion}
        onTouchEnd={() => setMapMoved(true)}
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
      {mapMoved && (
        <VStack items="center" position="absolute" top={120} w="100%">
          <TouchableOpacity onPress={() => searchThisAreaPressed()}>
            <Stack
              ph={15}
              radius={50}
              style={{ backgroundColor: defaultColor[700] }}
              justify="center"
              spacing={10}
              h={30}
            >
              <Stack>
                <Text size="xs" color={colors.white}>
                  Search This Area
                </Text>
              </Stack>
            </Stack>
          </TouchableOpacity>
        </VStack>
      )}
      {selectedTask && (
        <Box
          position="absolute"
          bottom={30}
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
            shadowColor={colors.gray[700]}
            onPress={() => onTaskPressed(selectedTask.id)}
          />
        </Box>
      )}
    </Box>
  );
};
