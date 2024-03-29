import { Pressable } from 'react-native';
import {
  SearchTasksResult,
  SearchTasksResultItem,
  TaskReason,
} from '../types';
import { memo, useEffect, useRef, useState } from 'react';
import {
  SearchShape,
  SearchLocationDef,
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
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOutUp,
} from 'react-native-reanimated';

import Mapbox, {
  Camera,
  CameraBoundsWithPadding,
  MarkerView,
  CameraPadding,
  MapState,
  PointAnnotation,
} from '@rnmapbox/maps';
import { mapBoxApiKey } from '../lib/consts';
import { Point, Position } from 'geojson';
import { InfoPink } from './InfoPink';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_CONTENT_HEIGHT } from './TabBar';

Mapbox.setAccessToken(mapBoxApiKey);

interface TasksMapMarkerProps {
  task: SearchTasksResultItem;
  onSelected?: () => void;
}

// Pure component important for performance
export const MapMarker = ({
  task,
  onSelected,
}: TasksMapMarkerProps) => {
  return (
    <PointAnnotation
      coordinate={[task.longitude, task.latitude]}
      style={{ zIndex: 1 }}
      onSelected={onSelected}
    >
      <TaskPin reason={task.reason} />
    </PointAnnotation>
  );
};

interface TasksMapProps {
  tasks: SearchTasksResult;
  searching?: boolean;
  onTaskPressed: (taskId: string) => void;
}

// Generic function for determining the best initial
// camera position for the mapbox map, based on
// current location, last search, and tasks (that might
// from search results)
export const getBestCameraPosition = (
  searchLocation: SearchLocationDef,
  tasks?: SearchTasksResult
) => {
  // No tasks then return the center of the current search location
  if (!tasks || tasks.length === 0) {
    console.log('NO RESULTS!!');
    return {
      centerCoordinate: getCenterPoint(searchLocation).coordinates,
      zoomLevel: 12,
    };
  }
  // If just one task then return the center of that task
  if (tasks.length === 1) {
    return {
      centerCoordinate: [tasks[0].longitude, tasks[0].latitude],
      zoomLevel: 12,
    };
  }
  const positions = tasks.map((task) => {
    const p: Position = [task.longitude, task.latitude];
    return p;
  });
  const line = lineString(positions);
  const box = bbox(line);
  // With the task coordinates - set the camnera around them
  const bounds: CameraBoundsWithPadding = {
    ne: box.slice(2, 4),
    sw: box.slice(0, 2),
  };
  return {
    bounds,
    padding: defaultCameraPadding,
  };
};

const getPolygonFromCurrentMapBounds = (bounds: Position[]) => {
  const line = lineString(bounds);
  const box = bbox(line);
  const polygon = bboxPolygon(box);
  return polygon;
};

const defaultCameraPadding: CameraPadding = {
  paddingTop: 250,
  paddingBottom: 140,
  paddingLeft: 30,
  paddingRight: 30,
};

export const TasksMap = ({
  tasks,
  searching,
  onTaskPressed,
}: TasksMapProps) => {
  const currentLocation = useCurrentLocation();
  const searchLocation = useSearchLocation();
  const insets = useSafeAreaInsets();

  const cameraProps = getBestCameraPosition(
    searchLocation.searchLocation,
    tasks
  );

  const mapRef = useRef<Mapbox.MapView>(null);
  const cameraRef = useRef<Camera>(null);

  const [selectedTask, setSelectedTask] = useState<
    SearchTasksResultItem | undefined
  >(undefined);

  const [mapMoved, setMapMoved] = useState<boolean>(false);

  const searchThisAreaPressed = async () => {
    setSelectedTask(undefined);
    if (mapRef.current) {
      const bounds = await mapRef.current.getVisibleBounds();

      const polygon = getPolygonFromCurrentMapBounds(bounds).geometry;
      searchLocation.set({
        mode: 'custom',
        searchShape: SearchShape.CustomArea,
        name: 'Custom Area',
        polygon,
      });
    }
  };

  const searchNearMePressed = async () => {
    setSelectedTask(undefined);
    await searchLocation.setToCurrentLocation();
  };

  const homeButtonPressed = async () => {
    setSelectedTask(undefined);
    await searchLocation.setToHomeArea();
  };

  const focusOnMePressed = () => {
    if (cameraRef.current && currentLocation.currentLocation) {
      cameraRef.current.setCamera({
        centerCoordinate: currentLocation.currentLocation.coordinates,
      });
    }
  };

  // When the tasks change, animate to fit all the new
  // tasks nicely on the map
  useEffect(() => {
    console.log('tasks changed');
    const cameraProps = getBestCameraPosition(
      searchLocation.searchLocation,
      tasks
    );
    if (cameraRef.current) {
      cameraRef.current.setCamera(cameraProps);
    }
    setMapMoved(false);
  }, [tasks]);

  return (
    <Box style={{ flex: 1 }}>
      <Mapbox.MapView
        ref={mapRef}
        style={{ flex: 1 }}
        onTouchMove={() => setMapMoved(true)}
        onTouchEnd={() => setSelectedTask(undefined)}
        scaleBarEnabled={false}
        pitchEnabled={false}
        logoEnabled={false}
      >
        <Camera ref={cameraRef} defaultSettings={cameraProps} />

        <Mapbox.UserLocation />

        {tasks.map((task, i) => (
          <MapMarker
            key={task.id}
            task={task}
            onSelected={() => {
              setSelectedTask(task);
            }}
          />
        ))}
      </Mapbox.MapView>

      <HStack
        position="absolute"
        top={120}
        justify="between"
        w="100%"
        shouldWrapChildren
        ph={20}
        pointerEvents="box-none"
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
          <TouchableOpacity onPress={() => focusOnMePressed()}>
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
          <TouchableOpacity onPress={() => homeButtonPressed()}>
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
        <Animated.View
          style={{
            position: 'absolute',
            bottom: insets.bottom + TAB_BAR_CONTENT_HEIGHT + 20,
            right: 0,
            left: 0,
            marginHorizontal: 50,
          }}
          entering={FadeInDown}
          exiting={FadeOutUp}
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
        </Animated.View>
      )}
      {!searching && tasks.length === 0 && (
        <Box
          style={{
            position: 'absolute',
            bottom: insets.bottom + TAB_BAR_CONTENT_HEIGHT + 20,
            right: 0,
            left: 0,
            marginHorizontal: 20,
          }}
        >
          <InfoPink message="No tasks found. Try widening your search area or create a task." />
        </Box>
      )}
    </Box>
  );
};
