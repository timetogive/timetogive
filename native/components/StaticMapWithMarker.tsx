import { faLocationPin } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useEffect, useState } from 'react';
import { Stack, Box } from 'react-native-flex-layout';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { LongLat } from '../providers/selectedLocation';
import colors from '../styles/colors';

interface Props {
  longLat: LongLat;
}

export const StaticMapWithMarker = ({ longLat }: Props) => {
  const initialMapRegion: Region = {
    latitude: longLat.latitude,
    longitude: longLat.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [mapRegion, setMapRegion] =
    useState<Region>(initialMapRegion);

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
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={initialMapRegion}
        region={mapRegion}
        pitchEnabled={false}
        rotateEnabled={false}
        zoomEnabled={false}
        scrollEnabled={false}
        toolbarEnabled={false}
        zoomControlEnabled={false}
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
    </>
  );
};
