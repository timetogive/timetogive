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
  onPress?: () => void;
}

interface Props extends TaskCardProps {
  showDistanceBar: boolean;
}

export const TaskCardWithDistanceBar = ({
  showDistanceBar,
  ...rest
}: Props) => {
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
          >
            <Text size="xs" weight="light" color={colors.gray[700]}>
              10
            </Text>
            <Text size="xxs" weight="light" color={colors.gray[700]}>
              km
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
