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
import { locationText } from '../lib';
import { MapListMode } from '../types';

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
        radius={100}
        h={40}
        w={40}
        p={5}
      >
        <VStack center>
          <FontAwesomeIcon
            icon={mode === MapListMode.List ? faLocationDot : faList}
            size={mode === MapListMode.List ? 25 : 18}
            color={defaultColor[500]}
          />
        </VStack>
      </Stack>
    </TouchableOpacity>
  );
};
export const LocationBar = ({ mode, onChangeMode }: Props) => {
  const insets = useSafeAreaInsets();
  const locText = locationText();

  return (
    <>
      <StatusBar
        animated={true}
        barStyle={
          mode === MapListMode.List ? 'light-content' : 'dark-content'
        }
      />
      <Stack
        position="absolute"
        top={0}
        left={0}
        right={0}
        pt={insets.top + 5}
        pb={10}
        ph={insets.left + 20}
        h={100}
        style={{
          ...(mode === MapListMode.List
            ? { backgroundColor: defaultColor[500] }
            : {}),
        }}
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
                icon={faAngleDown}
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