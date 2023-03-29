import center from '@turf/center';
import { points } from '@turf/helpers';
import { Point } from 'geojson';
import {
  defaultSearchPoint,
  SearchShape,
  SearchLocationDef,
} from '../providers/searchLocation';

export const getCenterPoint = (
  searchLocation: SearchLocationDef
): Point => {
  console.log('getCenterPoint', searchLocation);
  if (
    searchLocation.searchShape === SearchShape.PointWithRadius &&
    searchLocation.point
  ) {
    return searchLocation.point;
  }

  if (
    searchLocation.searchShape === SearchShape.CustomBox &&
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
  return searchLocation.name || '';
};

export const getDistanceText = (
  searchLocation: SearchLocationDef
): string => {
  if (searchLocation.searchShape === SearchShape.CustomBox) {
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
