import {
  faLocationPin,
  faCrosshairsSimple,
  faLocationCrosshairs,
} from '@fortawesome/sharp-solid-svg-icons';
import { width } from '@fortawesome/pro-solid-svg-icons/faAngleDown';
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
import { HStack, Stack, Box } from 'react-native-flex-layout';
import colors, { defaultColor } from '../styles/colors';
import { Text, translateFontSize } from './Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { useCurrentLocation } from '../providers/currentLocation';
import { useSearchLocation } from '../providers/searchLocation';
import { TaskPin } from './TaskPin';
import { TaskReason } from '../types';
import { getBestCameraPosition } from './TasksMap';
import {
  Feature,
  GeoJsonProperties,
  Geometry,
  LineString,
  Point,
  Polygon,
} from 'geojson';

import Mapbox, { Camera, PointAnnotation } from '@rnmapbox/maps';
import { mapBoxApiKey } from '../lib/consts';
import { Position } from 'geojson';
import { lineString } from '@turf/helpers';

interface Props {
  reason?: TaskReason;
  point?: Point;
  onPointChange?: (point: Point) => void;
}

export const SetPoint = ({ reason, point, onPointChange }: Props) => {
  const searchLocation = useSearchLocation();
  const currentLocation = useCurrentLocation();

  const insets = useSafeAreaInsets();

  const mapRef = useRef<Mapbox.MapView>(null);
  const cameraRef = useRef<Camera>(null);

  const cameraProps = point
    ? {
        centerCoordinate: point.coordinates,
        zoomLevel: 12,
      }
    : getBestCameraPosition(searchLocation.searchLocation, []);

  const confirmPinLocation = async () => {
    if (mapRef.current && onPointChange) {
      const position = await mapRef.current.getCenter();
      onPointChange({ type: 'Point', coordinates: position });
    }
  };

  const focusOnMe = () => {
    if (cameraRef.current && currentLocation.currentLocation) {
      cameraRef.current.setCamera({
        centerCoordinate: currentLocation.currentLocation.coordinates,
      });
    }
  };

  return (
    <Box style={{ flex: 1 }} pointerEvents="box-none">
      <Mapbox.MapView
        ref={mapRef}
        style={{ flex: 1 }}
        scaleBarEnabled={false}
        pitchEnabled={false}
        logoEnabled={false}
      >
        <Camera ref={cameraRef} defaultSettings={cameraProps} />
        <Mapbox.UserLocation />
      </Mapbox.MapView>
      {/* Fixed Pin overlay */}
      <Stack
        pointerEvents="none"
        position="absolute"
        top={0}
        right={0}
        left={0}
        bottom={0}
        center
      >
        <TaskPin reason={reason} />
      </Stack>

      {/* My location button */}
      <Box position="absolute" top={20} right={20}>
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
      </Box>
      {/* Confirm location button */}
      <Stack
        position="absolute"
        right={0}
        left={0}
        bottom={insets.bottom + 20}
        mh={20}
      >
        <Button
          color={defaultColor[500]}
          style={{ width: '100%' }}
          onPress={() => confirmPinLocation()}
        >
          <Text color={colors.white} size="xs">
            Pin location looks good
          </Text>
        </Button>
      </Stack>
    </Box>
  );
};

interface SetPointSheetModalProps extends Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SetPointSheetModal = ({
  isOpen,
  onClose,
  reason,
  point,
  onPointChange,
}: SetPointSheetModalProps) => {
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

  const interceptOnPointChange = (point: Point) => {
    hideModal();
    onPointChange && onPointChange(point);
  };

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={['80%']}
        backdropComponent={renderBackdrop}
        onDismiss={onClose}
      >
        <Box style={{ flex: 1 }} pt={10} overflow="hidden">
          <SetPoint
            reason={reason}
            point={point}
            onPointChange={interceptOnPointChange}
          />
        </Box>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
