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
import { MiniProfile } from './MiniProfile';

export const TaskInformation = ({
  taskId,
  taskUserId,
  taskUserAvatarUrl,
  taskUserFullName,
  title,
  reason,
  timing,
  duration,
  onPress,
}: TaskCardProps) => {
  return (
    <VStack spacing={20}>
      <HStack justify="between" items="start">
        <VStack spacing={12} style={{ flex: 1 }}>
          <Stack pr={5} style={{ flex: 1 }}>
            <Text weight="bold">{title}</Text>
          </Stack>
          <HStack items="center" spacing={3}>
            <FontAwesomeIcon
              icon={faAlarmClock}
              color={colors.gray[300]}
              size={15}
            />
            <Text size="xxs" color={colors.gray[500]}>
              {timing}
            </Text>
          </HStack>
        </VStack>

        <VStack items="center" shouldWrapChildren>
          <Stack
            w={40}
            h={40}
            style={{
              backgroundColor: defaultColor[50],
            }}
            radius={10}
            center
          >
            <TtgIcon reason={reason} />
          </Stack>
          <Text size="xxs" color={colors.gray[400]}>
            {reason}
          </Text>
        </VStack>
      </HStack>
      <HStack justify="between" items="end" shouldWrapChildren>
        {taskUserAvatarUrl && taskUserFullName && (
          <MiniProfile
            avatarUrl={taskUserAvatarUrl}
            fullName={taskUserFullName}
          />
        )}
        <Chip textSize="xxs">{duration}</Chip>
      </HStack>
    </VStack>
  );
};
