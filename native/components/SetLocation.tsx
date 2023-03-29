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
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import colors, { defaultColor } from '../styles/colors';
import { Text, translateFontSize } from './Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorSpace } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native';
import { useQueryClient, useQuery } from 'react-query';
import { getCenterPoint, supabase } from '../lib';
import { Point } from 'geojson';
import { useCurrentLocation } from '../providers/currentLocation';
import { useSearchLocation } from '../providers/searchLocation';
import { TaskPin } from './TaskPin';
import { TaskReason } from '../types';

interface Props {
  reason?: TaskReason;
  point?: Point;
  onPointChange?: (point: Point) => void;
}

export const SetLocation = ({
  reason,
  point,
  onPointChange,
}: Props) => {
  const searchLocation = useSearchLocation();
  const currentLocation = useCurrentLocation();
  const centerPointOfSearchLocation = getCenterPoint(
    searchLocation.searchLocation
  );

  const initialMapRegion: Region = point
    ? {
        longitude: point.coordinates[0],
        latitude: point.coordinates[1],
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : {
        longitude: centerPointOfSearchLocation.coordinates[0],
        latitude: centerPointOfSearchLocation.coordinates[1],
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();

  const mapRegionTracker = useRef<Region | undefined>();

  const onRegionChange = (region: Region) => {
    mapRegionTracker.current = region;
  };

  const confirmPinLocation = () => {
    if (
      mapRegionTracker.current?.longitude &&
      mapRegionTracker.current?.latitude
    ) {
      onPointChange &&
        onPointChange({
          type: 'Point',
          coordinates: [
            mapRegionTracker.current.longitude,
            mapRegionTracker.current.latitude,
          ],
        });
    }
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

  return (
    <Box style={{ flex: 1 }} pointerEvents="box-none">
      <MapView
        ref={mapRef}
        //provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={initialMapRegion}
        onRegionChangeComplete={onRegionChange}
        showsUserLocation
      ></MapView>
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

interface SetLocationSheetModalProps extends Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SetLocationSheetModal = ({
  isOpen,
  onClose,
  reason,
  point,
  onPointChange,
}: SetLocationSheetModalProps) => {
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
          <SetLocation
            reason={reason}
            point={point}
            onPointChange={interceptOnPointChange}
          />
        </Box>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
