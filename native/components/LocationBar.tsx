import * as Location from 'expo-location';
import { faLocationDot } from '@fortawesome/pro-light-svg-icons/faLocationDot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { locationText } from '../lib';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useSelectedLocation } from '../providers/selectedLocation';
import { TouchableOpacity } from 'react-native';

export const LocationBar = () => {
  const insets = useSafeAreaInsets();
  const locText = locationText();
  const location = useSelectedLocation();

  const onPress = async () => {
    console.log('Clicking on location bar');
    await location.setToCurrentLocation();
  };

  return <></>;
  // return (
  //   <Stack
  //     pt={insets.top + 5}
  //     pl={insets.left + 5}
  //     pr={insets.right + 5}
  //     pb={10}
  //     backgroundColor="$background"
  //   >
  //     <TouchableOpacity onPress={onPress}>
  //       <XStack space={2} alignItems="center">
  //         <FontAwesomeIcon icon={faLocationDot} size={20} />
  //         <SizableText color="$color"> {locText} </SizableText>
  //       </XStack>
  //     </TouchableOpacity>
  //   </Stack>
  // );
};
