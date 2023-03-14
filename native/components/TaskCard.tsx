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
import { TaskCardProps } from './TaskCardWithDistanceBar';
import { TaskInformation } from './TaskInformation';

export const TaskCard = ({
  onPress,
  shadowColor,
  ...rest
}: TaskCardProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Stack
        radius={5}
        p={25}
        style={{
          shadowColor: shadowColor ? shadowColor : colors.gray[200],
          shadowOffset: { width: -4, height: 6 },
          shadowOpacity: 0.7,
          shadowRadius: 20,
          elevation: 2,
          backgroundColor: colors.white,
          flex: 1,
        }}
      >
        <TaskInformation {...rest} />
      </Stack>
    </TouchableOpacity>
  );
};
