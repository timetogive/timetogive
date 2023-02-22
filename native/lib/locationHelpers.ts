import {
  useLocation,
  SelectedLocationMode,
  SelectedLocation,
} from '../providers/selectedLocation';

const getMainText = (selectedLocation: SelectedLocation) => {
  if (selectedLocation.mode === SelectedLocationMode.Current) {
    return `Live Location`;
  }
  if (!selectedLocation.custom) {
    return 'Location Unknown';
  }
  if (selectedLocation.custom.name) {
    return selectedLocation.custom.name;
  }
  return `${selectedLocation.custom.longitude.toFixed(
    2
  )} : ${selectedLocation.custom.latitude.toFixed(2)}`;
};

export const locationText = () => {
  const location = useLocation();

  const mainText = getMainText(location.selectedLocation);

  const distanceText = `${(
    location.selectedLocation.distance / 1000
  ).toFixed(0)} km`;

  return {
    mainText,
    distanceText,
  };
};
