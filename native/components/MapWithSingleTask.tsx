import { faLocationPin } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { Stack, Box } from 'react-native-flex-layout';
import colors from '../styles/colors';
import { TaskReason } from '../types';
import { TaskPin } from './TaskPin';
import { Point } from 'geojson';

import Mapbox, { Camera, PointAnnotation } from '@rnmapbox/maps';
import { mapBoxApiKey } from '../lib/consts';
import { Position } from 'geojson';
import { lineString } from '@turf/helpers';
import React from 'react';

interface Props {
  reason?: TaskReason;
  point: Point;
  interactive?: boolean;
}

export const MapWithSingleTask = ({
  reason,
  point,
  interactive,
}: Props) => {
  const cameraProps = {
    centerCoordinate: point.coordinates,
    zoomLevel: 12,
  };

  const mapRef = useRef<Mapbox.MapView>(null);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    const newCameraProps = {
      centerCoordinate: point.coordinates,
      zoomLevel: 12,
    };
    if (cameraRef.current) {
      cameraRef.current.setCamera(newCameraProps);
    }
  }, [point]);

  return (
    <Box style={{ flex: 1 }} pointerEvents="box-none">
      <Mapbox.MapView
        ref={mapRef}
        style={{ flex: 1 }}
        scaleBarEnabled={false}
        pitchEnabled={false}
        logoEnabled={false}
        scrollEnabled={false}
        zoomEnabled={interactive}
        rotateEnabled={interactive}
      >
        <Camera ref={cameraRef} defaultSettings={cameraProps} />
        <Mapbox.UserLocation />
        {/* Just a single pin */}
        <PointAnnotation
          coordinate={point.coordinates}
          style={{ zIndex: 1 }}
        >
          <TaskPin reason={reason} />
        </PointAnnotation>
      </Mapbox.MapView>
    </Box>
  );
};
