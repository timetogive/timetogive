import {
  faLocationPin,
  faCrosshairsSimple,
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
import {
  defaultLongLat,
  LongLat,
  useLocation,
} from '../providers/selectedLocation';
import colors from '../styles/colors';
import { Text, translateFontSize } from './Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorSpace } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native';
import { useQueryClient, useQuery } from 'react-query';
import { supabase } from '../lib';

interface Props {
  longLat?: LongLat;
  onLongLatChange?: (volunteers: number) => void;
}

export const SetLocation = ({ longLat, onLongLatChange }: Props) => {
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();
  const selectedLocation = useLocation();

  const [ready, setReady] = useState(false);

  const [mapRegion, setMapRegion] = useState<Region | undefined>(
    undefined
  );

  const goCurrentLocation = async () => {
    console.log('Calling goCurrentLocation');
    // Otherwise go and get the current location
    const currentLongLat = await selectedLocation.getCurrentLongLat();
    console.log('Got the current location');
    console.log(currentLongLat);

    mapRef.current?.animateToRegion({
      latitude: currentLongLat.latitude,
      longitude: currentLongLat.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  // After mounting, determine which location to set the map to
  useEffect(() => {
    (async () => {
      // If the long lat is passed in, use that
      if (longLat) {
        setMapRegion({
          latitude: longLat.latitude,
          longitude: longLat.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setReady(true);
        return;
      }
      // See if we can use the current location
      const canAccessCurrentLocation =
        await selectedLocation.canAccessCurrentLocation();
      // No access to the current location then use a default
      if (!canAccessCurrentLocation) {
        setMapRegion({
          latitude: defaultLongLat.latitude,
          longitude: defaultLongLat.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setReady(true);
        return;
      }
      // Otherwise go and get the current location
      const currentLongLat =
        await selectedLocation.getCurrentLongLat();
      setMapRegion({
        latitude: currentLongLat.latitude,
        longitude: currentLongLat.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setReady(true);
    })();
  }, []);

  if (!ready) {
    return <Text>Loading map...</Text>;
  }

  return (
    <>
      {/* Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        region={mapRegion}
        ref={mapRef}
      />

      {/* Fixed Marker */}
      <Stack
        pointerEvents="none"
        position="absolute"
        top={0}
        right={0}
        left={0}
        bottom={0}
        center
      >
        <Box mt={-20}>
          <FontAwesomeIcon
            icon={faLocationPin}
            color={colors.pink[400]}
            size={40}
            style={{ opacity: 0.95 }}
          />
        </Box>
      </Stack>

      {/* Use my location button */}
      <Box position="absolute" top={25} left={15}>
        <TouchableOpacity onPress={() => goCurrentLocation()}>
          <HStack items="center" spacing={10}>
            <FontAwesomeIcon
              icon={faCrosshairsSimple}
              color={colors.pink[500]}
              size={20}
            />
            <Text color={colors.pink[500]} size="xs">
              Use current location
            </Text>
          </HStack>
        </TouchableOpacity>
      </Box>

      {/* Set location button */}
      <Stack
        position="absolute"
        right={0}
        left={0}
        bottom={insets.bottom + 20}
        mh={20}
      >
        <Button color={colors.pink[500]} style={{ width: '100%' }}>
          <Text color={colors.white} size="xs">
            Set task location
          </Text>
        </Button>
      </Stack>
    </>
  );
};

interface SetLocationSheetModalProps extends Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SetLocationSheetModal = ({
  isOpen,
  onClose,
  longLat,
  onLongLatChange,
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
            longLat={longLat}
            onLongLatChange={onLongLatChange}
          />
        </Box>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
