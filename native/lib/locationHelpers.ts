import center from '@turf/center';
import { points } from '@turf/helpers';
import { Point } from 'geojson';
import {
  defaultSearchPoint,
  LocationMode,
  SearchLocationDef,
} from '../providers/searchLocation';

export const getCenterPoint = (
  searchLocation: SearchLocationDef
): Point => {
  console.log('getCenterPoint', searchLocation);
  if (
    (searchLocation.locationMode ===
      LocationMode.CustomPointWithRadius ||
      searchLocation.locationMode ===
        LocationMode.LivePointWithRadius) &&
    searchLocation.point
  ) {
    return searchLocation.point;
  }

  if (
    searchLocation.locationMode === LocationMode.CustomBox &&
    searchLocation.points
  ) {
    const box = points(
      searchLocation.points.map((point) => point.coordinates)
    );
    const ctr = center(box);
    return ctr.geometry as Point;
  }
  return defaultSearchPoint;
};

export const getMainText = (
  searchLocation: SearchLocationDef
): string => {
  if (
    searchLocation.locationMode === LocationMode.LivePointWithRadius
  ) {
    return `Live Location`;
  }
  if (
    searchLocation.locationMode ===
      LocationMode.CustomPointWithRadius &&
    searchLocation.point
  ) {
    if (searchLocation.name) {
      return searchLocation.name;
    }
    return `${searchLocation.point.coordinates[0].toFixed(
      2
    )} : ${searchLocation.point.coordinates[1].toFixed(2)}`;
  }
  if (searchLocation.locationMode === LocationMode.CustomBox) {
    if (searchLocation.name) {
      return searchLocation.name;
    }
    return `Custom Area`;
  }
  return 'Location Unknown';
};

export const getDistanceText = (
  searchLocation: SearchLocationDef
): string => {
  if (searchLocation.locationMode === LocationMode.CustomBox) {
    return '';
  }
  return `${((searchLocation.distance || 0) / 1000).toFixed(0)} km`;
};

export const getLocationText = (
  searchLocation: SearchLocationDef
) => {
  return {
    mainText: getMainText(searchLocation),
    distanceText: getDistanceText(searchLocation),
  };
};
