import {
  faBackwardFast,
  faBackwardStep,
  faInfoCircle,
  faLocationCrosshairs,
  faTrash,
  faUndo,
} from '@fortawesome/sharp-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  BottomSheetModal,
  BottomSheetBackdropProps,
  BottomSheetBackdrop,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import { Button } from '@rneui/themed';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HStack, Stack, Box, VStack } from 'react-native-flex-layout';
import colors, { defaultColor } from '../styles/colors';
import { Text, translateFontSize } from './Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorSpace } from 'react-native-reanimated';
import { Pressable, TouchableOpacity } from 'react-native';
import { useQueryClient, useQuery } from 'react-query';
import { getCenterPoint, supabase } from '../lib';
import {
  Feature,
  GeoJsonProperties,
  Geometry,
  LineString,
  Point,
  Polygon,
} from 'geojson';
import { useCurrentLocation } from '../providers/currentLocation';
import { useSearchLocation } from '../providers/searchLocation';
import { TaskPin } from './TaskPin';
import { TaskReason } from '../types';
import { getBestCameraPosition } from './TasksMap';

import Mapbox, { Camera, PointAnnotation } from '@rnmapbox/maps';
import { mapBoxApiKey } from '../lib/consts';
import { Position } from 'geojson';
import { lineString } from '@turf/helpers';
import { ButtonPrimary } from './Buttons';

Mapbox.setAccessToken(mapBoxApiKey);

const initialInstructions =
  'Tap anywhere on the map as the starting point of your shape';

interface Props {
  onPolygonChange?: (polygon: Polygon) => void;
}

export const SetPolygon = ({ onPolygonChange }: Props) => {
  const currentLocation = useCurrentLocation();
  const searchLocation = useSearchLocation();
  const insets = useSafeAreaInsets();
  const [instructionMessage, setInstructionMessage] =
    useState<string>(initialInstructions);

  const cameraProps = getBestCameraPosition(
    searchLocation.searchLocation,
    []
  );

  const mapRef = useRef<Mapbox.MapView>(null);
  const cameraRef = useRef<Camera>(null);

  const positions = useRef<Position[]>([]);

  const [polygon, setPolygon] = useState<Polygon | undefined>(
    undefined
  );

  const [firstPoint, setFirstPoint] = useState<Point | undefined>(
    undefined
  );

  const [lineString, setLineString] = useState<
    LineString | undefined
  >(undefined);

  const syncPositionsToState = () => {
    if (positions.current.length === 0) {
      setInstructionMessage(initialInstructions);
    }
    if (positions.current.length === 1) {
      setFirstPoint({
        type: 'Point',
        coordinates: positions.current[0],
      });
      setInstructionMessage('Tap again to create your first edge');
    }
    if (positions.current.length >= 2) {
      setLineString({
        type: 'LineString',
        coordinates: positions.current,
      });
      if (positions.current.length === 2) {
        setInstructionMessage('Keep tapping to build up your shape');
      } else {
        setInstructionMessage(
          'When you are done, tap the first point again to complete your shape'
        );
      }
    }
    // Set the instructions accordingly
  };

  const addPoint = (point: Point) => {
    setPolygon(undefined);
    console.log(`point`, point);
    positions.current = [...positions.current, point.coordinates];
    syncPositionsToState();
  };

  const onClickFirstPoint = () => {
    // If there are at least 3 points, then we can close
    // off the polygon
    if (positions.current.length >= 3) {
      setFirstPoint(undefined);
      setLineString(undefined);
      console.log('Setting the polygon');
      positions.current = [
        ...positions.current,
        positions.current[0],
      ];
      setPolygon({
        type: 'Polygon',
        coordinates: [positions.current],
      });
    }
  };

  const focusOnMe = () => {
    if (cameraRef.current && currentLocation.currentLocation) {
      cameraRef.current.setCamera({
        centerCoordinate: currentLocation.currentLocation.coordinates,
      });
    }
  };

  const reset = () => {
    positions.current = [];
    setFirstPoint(undefined);
    setLineString(undefined);
    setPolygon(undefined);
    syncPositionsToState();
  };

  const undo = () => {
    if (positions.current.length > 0) {
      positions.current = positions.current.slice(0, -1);
      syncPositionsToState();
    }
  };

  // After loading get the best camera position
  useEffect(() => {
    const cameraProps = getBestCameraPosition(
      searchLocation.searchLocation,
      []
    );
    if (cameraRef.current) {
      cameraRef.current.setCamera(cameraProps);
    }
  }, []);

  return (
    <Box style={{ flex: 1 }}>
      <Mapbox.MapView
        ref={mapRef}
        style={{ flex: 1 }}
        scaleBarEnabled={false}
        pitchEnabled={false}
        logoEnabled={false}
        onPress={(feature: Feature<Geometry, GeoJsonProperties>) => {
          if (feature.geometry.type === 'Point') {
            const point = feature.geometry as Point;
            addPoint(point);
          }
        }}
      >
        <Camera ref={cameraRef} defaultSettings={cameraProps} />
        <Mapbox.UserLocation />
        {firstPoint && (
          <PointAnnotation
            coordinate={firstPoint.coordinates}
            style={{ zIndex: 100 }}
            onSelected={() => onClickFirstPoint()}
          >
            <Box
              w={20}
              h={20}
              radius={10}
              borderColor="red"
              border={1}
            ></Box>
          </PointAnnotation>
        )}
        {lineString && (
          <Mapbox.ShapeSource
            id="custom-linestring-source"
            shape={lineString}
          >
            <Mapbox.LineLayer
              sourceID="custom-linestring-source"
              id="custom-line-layer"
              style={{
                lineColor: defaultColor[400],
                lineWidth: 4,
                lineDasharray: [1, 1],
              }}
            />
          </Mapbox.ShapeSource>
        )}
        {polygon && (
          <Mapbox.ShapeSource
            id="custom-polygon-source"
            shape={polygon}
          >
            <Mapbox.FillLayer
              sourceID="custom-polygon"
              id="custom-polygon-fill"
              style={{
                fillOpacity: 0.3,
                fillColor: defaultColor[400],
              }}
            />
          </Mapbox.ShapeSource>
        )}
      </Mapbox.MapView>
      <HStack
        position="absolute"
        top={20}
        justify="between"
        spacing={10}
        w="100%"
        shouldWrapChildren
        ph={20}
        pointerEvents="box-none"
      >
        <HStack spacing={10}>
          {(lineString || firstPoint) && (
            <TouchableOpacity onPress={() => undo()}>
              <Stack
                radius={50}
                style={{ backgroundColor: defaultColor[700] }}
                spacing={10}
                h={30}
                w={30}
                center
              >
                <FontAwesomeIcon
                  icon={faUndo}
                  color={colors.white}
                  size={15}
                />
              </Stack>
            </TouchableOpacity>
          )}
          {(polygon || lineString || firstPoint) && (
            <TouchableOpacity onPress={() => reset()}>
              <Stack
                radius={50}
                style={{ backgroundColor: defaultColor[700] }}
                spacing={10}
                h={30}
                w={30}
                center
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  color={colors.white}
                  size={15}
                />
              </Stack>
            </TouchableOpacity>
          )}
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
        </HStack>
      </HStack>

      <VStack
        position="absolute"
        right={0}
        left={0}
        bottom={insets.bottom + 20}
        mh={20}
      >
        {!polygon && (
          <HStack
            bg={colors.pink[500]}
            opacity={0.8}
            ph={15}
            pv={15}
            radius={5}
            spacing={10}
            maxW={400}
          >
            <FontAwesomeIcon
              icon={faInfoCircle}
              color={colors.white}
              size={20}
            />
            <Box style={{ flex: 1 }}>
              <Text
                size="xs"
                color={colors.white}
                style={{ flex: 1 }}
              >
                {instructionMessage}
              </Text>
            </Box>
          </HStack>
        )}
        {polygon && (
          <ButtonPrimary
            onPress={() =>
              onPolygonChange && onPolygonChange(polygon)
            }
          >
            <Text color={colors.white} size="xs">
              Set this as my home area
            </Text>
          </ButtonPrimary>
        )}
      </VStack>
    </Box>
  );
};

interface SetPolygonSheetModalProps extends Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SetPolygonSheetModal = ({
  isOpen,
  onClose,
  onPolygonChange,
}: SetPolygonSheetModalProps) => {
  // Bottom sheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const showModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const hideModal = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);
  const renderBackdrop = useCallback(
    (props_: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props_}
        pressBehavior="close"
        opacity={0.8}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  useEffect(() => {
    if (isOpen) {
      showModal();
    } else {
      hideModal();
    }
  }, [isOpen]);

  const interceptOnPolygonChange = (polygon: Polygon) => {
    hideModal();
    onPolygonChange && onPolygonChange(polygon);
  };

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={['90%']}
        backdropComponent={renderBackdrop}
        onDismiss={onClose}
      >
        <Box style={{ flex: 1 }} pt={10} overflow="hidden">
          <SetPolygon onPolygonChange={interceptOnPolygonChange} />
        </Box>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
