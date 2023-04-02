import { TouchableOpacity, StatusBar } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleDown } from '@fortawesome/pro-solid-svg-icons/faAngleDown';
import { faLocationDot } from '@fortawesome/pro-light-svg-icons/faLocationDot';
import { faList } from '@fortawesome/pro-light-svg-icons/faList';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './Text';
import {
  Stack,
  HStack,
  Flex,
  Spacer,
  VStack,
} from 'react-native-flex-layout';

import colors, { defaultColor } from '../styles/colors';
import { ButtonGroup } from '@rneui/themed';
import { getLocationText } from '../lib';
import { MapListMode } from '../types';
import { faLocationArrow } from '@fortawesome/sharp-solid-svg-icons';
import { useSearchLocation } from '../providers/searchLocation';

interface Props {
  mode: MapListMode;
  onChangeMode: (mode: MapListMode) => void;
}

const ModeToggleButton = ({ mode, onChangeMode }: Props) => {
  return (
    <TouchableOpacity
      onPress={() =>
        onChangeMode(
          mode === MapListMode.List
            ? MapListMode.Map
            : MapListMode.List
        )
      }
    >
      <Stack
        style={{ backgroundColor: colors.white }}
        center
        radius={20}
        w={140}
        h={40}
        ph={20}
      >
        <HStack shouldWrapChildren items="center" spacing={7}>
          <Text size="xs">
            {mode === MapListMode.List ? 'Show map' : 'Show list'}
          </Text>
          <FontAwesomeIcon
            icon={mode === MapListMode.List ? faLocationDot : faList}
            size={mode === MapListMode.List ? 25 : 18}
            color={defaultColor[500]}
          />
        </HStack>
      </Stack>
    </TouchableOpacity>
  );
};
export const LocationBar = ({ mode, onChangeMode }: Props) => {
  const insets = useSafeAreaInsets();
  const searchLocation = useSearchLocation();
  const locText = getLocationText(searchLocation.searchLocation);

  return (
    <>
      <StatusBar animated={true} barStyle={'dark-content'} />
      <Stack
        pt={insets.top + 5}
        pb={10}
        ph={insets.left + 20}
        style={{
          ...(mode === MapListMode.List
            ? { backgroundColor: colors.whiteAlpha[300] }
            : {}),
        }}
        {...{}}
        // Absolute position when in map mode
        position={mode === MapListMode.Map ? 'absolute' : 'relative'}
        top={mode === MapListMode.Map ? 0 : undefined}
        left={mode === MapListMode.Map ? 0 : undefined}
        right={mode === MapListMode.Map ? 0 : undefined}
        zIndex={mode === MapListMode.Map ? 100 : undefined}
      >
        <HStack justify="between" items="center">
          <HStack
            border={0.5}
            pv={10}
            ph={15}
            radius={50}
            borderColor={colors.white}
            style={{ backgroundColor: colors.white }}
            justify="between"
            items="center"
            spacing={10}
            h={40}
          >
            <Stack>
              <Text size="xs">
                {locText.mainText}
                {'   '}
                <Text size="xs" color={colors.gray[400]}>
                  {locText.distanceText}
                </Text>
              </Text>
            </Stack>
            <Stack>
              <FontAwesomeIcon
                icon={faLocationArrow}
                size={14}
                color={defaultColor[500]}
              ></FontAwesomeIcon>
            </Stack>
          </HStack>
          <ModeToggleButton mode={mode} onChangeMode={onChangeMode} />
        </HStack>
      </Stack>
    </>
  );
};
