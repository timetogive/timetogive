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
import {
  LocationMode,
  useSearchLocation,
} from '../providers/searchLocation';
import React from 'react';
import { Box, HStack, Stack, VStack } from 'react-native-flex-layout';
import {
  faLocationArrow,
  faLocationCrosshairs,
  faLocationPin,
  faSquareDashed,
} from '@fortawesome/sharp-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import colors, { defaultColor } from '../styles/colors';
import { effortText, getTtgIcon } from '../lib/tasksHelpers';
import { Text } from '../components/Text';
import { TaskCard } from './TaskCard';
import { Button } from '@rneui/themed';
import { TouchableOpacity } from 'react-native-gesture-handler';
import center from '@turf/center';
import { points } from '@turf/helpers';
import { getCenterPoint } from '../lib/locationHelpers';

interface TasksMapMarkerProps {
  task: SearchTasksResultItem;
  onPress?: () => void;
}

// Pure component important for performance
const MapMarker = memo(({ task, onPress }: TasksMapMarkerProps) => {
  const googleLatLng: LatLng = {
    latitude: task.latitude,
    longitude: task.longitude,
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
});

interface TasksMapProps {
  tasks: SearchTasksResult;
  onTaskPressed: (taskId: string) => void;
}

export const TasksMap = ({ tasks, onTaskPressed }: TasksMapProps) => {
  const searchLocation = useSearchLocation();
  console.log('TasksMap');
  console.log(searchLocation.searchLocation);

  const centerPoint = getCenterPoint(searchLocation.searchLocation);

  const initialMapRegion: Region = {
    longitude: centerPoint.coordinates[0],
    latitude: centerPoint.coordinates[1],
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const mapRef = useRef<MapView>(null);
  const [selectedTask, setSelectedTask] = useState<
    SearchTasksResultItem | undefined
  >(undefined);

  const [mapMoved, setMapMoved] = useState<boolean>(false);

  const searchThisAreaPressed = async () => {
    const boundaries = await mapRef.current?.getMapBoundaries();
    console.log('Search this area pressed');
    console.log(boundaries);
    // Set the search location
    if (boundaries) {
      searchLocation.set({
        locationMode: LocationMode.CustomBox,
        name: 'Custom Area',
        points: [
          {
            type: 'Point',
            coordinates: [
              boundaries.northEast.longitude,
              boundaries.northEast.latitude,
            ],
          },
          {
            type: 'Point',
            coordinates: [
              boundaries.southWest.longitude,
              boundaries.southWest.latitude,
            ],
          },
        ],
      });
    }
  };

  // When the tasks change, animate the map to bound the
  // results

  useEffect(() => {
    // Tranform the tasks into google long lat coords
    const googleCoords: LatLng[] = tasks.map((task) => ({
      latitude: task.latitude,
      longitude: task.longitude,
    }));
    mapRef.current?.fitToCoordinates(googleCoords, {
      edgePadding: { top: 100, right: 20, bottom: 100, left: 20 },
    });
  }, [tasks]);

  const searchNearMePressed = async () => {
    console.log('Search near me pressed');
  };

  return (
    <Box style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={initialMapRegion}
        onTouchEnd={() => {
          console.log('map moved');
          setMapMoved(true);
        }}
        showsUserLocation
      >
        {tasks.map((task: any) => (
          <MapMarker
            key={task.id}
            task={task}
            onPress={() => setSelectedTask(task)}
          />
        ))}
      </MapView>
      <HStack
        position="absolute"
        top={120}
        justify="between"
        shouldWrapChildren
        w="100%"
        ph={20}
      >
        {mapMoved && (
          <TouchableOpacity onPress={() => searchThisAreaPressed()}>
            <Stack
              ph={15}
              radius={50}
              style={{ backgroundColor: defaultColor[700] }}
              spacing={10}
              h={30}
              center
            >
              <HStack shouldWrapChildren spacing={10} items="center">
                <Text size="xs" color={colors.white}>
                  Search This Area
                </Text>
              </HStack>
            </Stack>
          </TouchableOpacity>
        )}
        {mapMoved &&
          searchLocation.searchLocation.locationMode !==
            LocationMode.LivePointWithRadius && (
            <TouchableOpacity onPress={() => searchThisAreaPressed()}>
              <Stack
                ph={15}
                radius={50}
                style={{ backgroundColor: defaultColor[700] }}
                spacing={10}
                h={30}
                center
              >
                <HStack
                  shouldWrapChildren
                  spacing={10}
                  items="center"
                >
                  <Text size="xs" color={colors.white}>
                    Search Near Me
                  </Text>
                </HStack>
              </Stack>
            </TouchableOpacity>
          )}
      </HStack>

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
