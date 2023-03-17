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
  faHome,
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
import { lineString } from '@turf/helpers';
import { getCenterPoint } from '../lib/locationHelpers';
import { useCurrentLocation } from '../providers/currentLocation';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import { Polygon } from 'react-native-svg';
import { TaskPin } from './TaskPin';

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
      <TaskPin reason={task.reason} />
    </Marker>
  );
});

interface TasksMapProps {
  tasks: SearchTasksResult;
  onTaskPressed: (taskId: string) => void;
}

export const TasksMap = ({ tasks, onTaskPressed }: TasksMapProps) => {
  const searchLocation = useSearchLocation();
  const currentLocation = useCurrentLocation();

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
      const line = lineString([
        [
          boundaries.northEast.longitude,
          boundaries.northEast.latitude,
        ],
        [
          boundaries.southWest.longitude,
          boundaries.southWest.latitude,
        ],
      ]);
      const box = bbox(line);
      const polygon = bboxPolygon(box).geometry;

      searchLocation.set({
        locationMode: LocationMode.CustomArea,
        name: 'Custom Area',
        polygon,
      });
    }
    setMapMoved(false);
  };

  const searchNearMePressed = async () => {
    console.log('Search near me pressed');
    await searchLocation.setToLiveLocation();
    setMapMoved(false);
  };

  const focusOnMe = () => {
    if (currentLocation.currentLocation) {
      mapRef.current?.animateToRegion({
        longitude: currentLocation.currentLocation.coordinates[0],
        latitude: currentLocation.currentLocation.coordinates[1],
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      return;
    }
    currentLocation.forceRefresh();
  };

  const home = () => {
    console.log('Home pressed');
  };

  // When the tasks change, animate to fit all the new
  // tasks nicely on the map
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

  return (
    <Box style={{ flex: 1 }} pointerEvents="box-none">
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={initialMapRegion}
        onTouchStart={() => {
          console.log('map moved');
          setMapMoved(true);
        }}
        showsUserLocation
      >
        {tasks.map((task) => (
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
        w="100%"
        shouldWrapChildren
        ph={20}
      >
        <HStack spacing={5}>
          <TouchableOpacity onPress={() => searchNearMePressed()}>
            <Stack
              ph={15}
              radius={50}
              style={{ backgroundColor: defaultColor[700] }}
              spacing={10}
              h={30}
              center
            >
              <Text size="xs" color={colors.white}>
                Search Near Me
              </Text>
            </Stack>
          </TouchableOpacity>
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
                <HStack
                  shouldWrapChildren
                  spacing={10}
                  items="center"
                >
                  <Text size="xs" color={colors.white}>
                    Search This Area
                  </Text>
                </HStack>
              </Stack>
            </TouchableOpacity>
          )}
        </HStack>
        <HStack spacing={5}>
          <TouchableOpacity onPress={() => focusOnMe()}>
            <Stack
              radius={50}
              style={{ backgroundColor: defaultColor[700] }}
              spacing={10}
              h={30}
              w={30}
              center
            >
              <FontAwesomeIcon
                icon={faLocationCrosshairs}
                color={colors.white}
                size={15}
              />
            </Stack>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => home()}>
            <Stack
              radius={50}
              style={{ backgroundColor: defaultColor[700] }}
              spacing={10}
              h={30}
              w={30}
              center
            >
              <FontAwesomeIcon
                icon={faHome}
                color={colors.white}
                size={15}
              />
            </Stack>
          </TouchableOpacity>
        </HStack>
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
