import {
  useLocation,
  SelectedLocationMode,
  SelectedLocation,
} from '../providers/selectedLocation';

const getMainText = (selectedLocation: SelectedLocation) => {
  if (selectedLocation.livePointWithRadius) {
    return `Live Location`;
  }
  if (selectedLocation.customPointWithRadius) {
    if (selectedLocation.customPointWithRadius.name) {
      return selectedLocation.customPointWithRadius.name;
    }
    return `${selectedLocation.customPointWithRadius.longLat.longitude.toFixed(
      2
    )} : ${selectedLocation.customPointWithRadius.longLat.latitude.toFixed(
      2
    )}`;
  }
  return 'Location Unknown';
};

export const getDistance = (selectedLocation: SelectedLocation) => {
  if (selectedLocation.livePointWithRadius) {
    return selectedLocation.livePointWithRadius.distance;
  }
  if (selectedLocation.customPointWithRadius) {
    return selectedLocation.customPointWithRadius.distance;
  }

  return 0;
};

export const locationText = () => {
  const location = useLocation();

  const mainText = getMainText(location.selectedLocation);

  const distanceText = `${(
    getDistance(location.selectedLocation) / 1000
  ).toFixed(0)} km`;

  return {
    mainText,
    distanceText,
  };
};
