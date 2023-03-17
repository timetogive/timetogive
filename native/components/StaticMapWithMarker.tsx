import { faLocationPin } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Point } from 'geojson';
import { useEffect, useState } from 'react';
import { Stack, Box } from 'react-native-flex-layout';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import colors from '../styles/colors';
import { TaskReason } from '../types';
import { TaskPin } from './TaskPin';

interface Props {
  reason?: TaskReason;
  point: Point;
}

export const StaticMapWithMarker = ({ reason, point }: Props) => {
  const initialMapRegion: Region = {
    longitude: point.coordinates[0],
    latitude: point.coordinates[1],
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [mapRegion, setMapRegion] =
    useState<Region>(initialMapRegion);

  useEffect(() => {
    (async () => {
      setMapRegion({
        longitude: point.coordinates[0],
        latitude: point.coordinates[1],
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, [point]);

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
    </>
  );
};
