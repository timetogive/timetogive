import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  Stack,
  HStack,
  Flex,
  Spacer,
  VStack,
  StackProps,
  Box,
} from 'react-native-flex-layout';
import { Text } from './Text';
import { Chip } from './Chip';

import colors, { defaultColor } from '../styles/colors';
import { getTtgIcon } from '../lib/tasksHelpers';
import { TtgIcon } from './TtgIcon';
import { SvgUri } from 'react-native-svg';
import {
  faAlarmClock,
  faStar,
} from '@fortawesome/pro-solid-svg-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TaskCard } from './TaskCard';

export interface TaskCardProps {
  taskId: string;
  taskUserId: string;
  taskUserFullName?: string;
  taskUserAvatarUrl?: string;
  title: string;
  reason: string;
  timing: string;
  duration: string;
  distance?: number;
  shadowColor?: string;
  onPress?: () => void;
  onPressProfile?: () => void;
}

export const TaskCardWithDistanceBar = (props: TaskCardProps) => {
  const showDistanceBar = props.distance !== undefined;
  const { distance, ...rest } = props;

  console.log('DISTANCE', distance);

  // function to format distance from m into human readable format
  const formatDistance = (distance: number) => {
    if (distance < 1000) {
      return {
        distance: '< 1',
        units: 'km',
      };
    } else {
      const km = distance / 1000;
      if (km < 10) {
        return {
          distance: km.toFixed(1),
          units: 'km',
        };
      }
      return {
        distance: km.toFixed(0),
        units: 'km',
      };
    }
  };

  const formattedDistance = formatDistance(distance || 0);

  return (
    <HStack>
      {/* Distance bar */}
      {showDistanceBar && (
        <Stack w={50} items="center">
          <Stack
            w={0.5}
            grow={1}
            style={{ backgroundColor: colors.gray[300] }}
          ></Stack>
          <VStack
            position="absolute"
            top={10}
            style={{ backgroundColor: colors.white }}
            p={5}
            shouldWrapChildren
            center
            overflow="hidden"
          >
            <Text size="xs" weight="light" color={colors.gray[700]}>
              {formattedDistance.distance}
            </Text>
            <Text size="xxs" weight="light" color={colors.gray[700]}>
              {formattedDistance.units}
            </Text>
          </VStack>
        </Stack>
      )}
      <Box style={{ flex: 1 }} mb={20}>
        <TaskCard {...rest} />
      </Box>
    </HStack>
  );
};
