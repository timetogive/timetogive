import { useSelectedLocation, SelectedLocationMode } from 'app/providers/selectedLocation'

export const locationText = () => {
  const location = useSelectedLocation()

  const distanceText = `(${(location.selectedLocation.distance / 1000).toFixed(1)} km radius)`

  //(10km radius)
  if (location.selectedLocation.mode === SelectedLocationMode.Current) {
    return `Live Location ${distanceText}`
  }
  if (!location.selectedLocation.custom) {
    return 'Location Unknown'
  }
  if (location.selectedLocation.custom.name) {
    return location.selectedLocation.custom.name
  }
  return `${location.selectedLocation.custom.longitude.toFixed(
    2
  )} ${location.selectedLocation.custom.latitude.toFixed(2)} ${distanceText}`
}
