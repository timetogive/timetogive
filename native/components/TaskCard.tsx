import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouseHeart } from '@fortawesome/pro-solid-svg-icons/faHouseHeart';
import { faPeopleGroup } from '@fortawesome/pro-solid-svg-icons/faPeopleGroup';
import { faHandWave } from '@fortawesome/pro-light-svg-icons/faHandWave';
import { faHandshake } from '@fortawesome/pro-solid-svg-icons/faHandshake';
import { faHandHoldingDollar } from '@fortawesome/pro-solid-svg-icons/faHandHoldingDollar';
import { FlatList, ViewProps } from 'react-native';
import { SearchTasksResult } from '../types';
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

interface Props {
  title: string;
  description: string;
  reason: string;
  avatarUrl: string;
  timing: string;
}

export const TaskCard = ({
  title,
  description,
  avatarUrl,
  reason,
  timing,
}: Props) => {
  console.log(avatarUrl);
  return (
    <HStack>
      {/* Distance bar */}
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
      {/* Main card */}
      <Stack
        radius={5}
        p={25}
        mb={20}
        style={{
          shadowColor: colors.gray[200],
          shadowOffset: { width: -4, height: 6 },
          shadowOpacity: 0.7,
          shadowRadius: 20,
          elevation: 2,
          backgroundColor: colors.white,
          flex: 1,
        }}
      >
        <VStack spacing={20}>
          <HStack justify="between" items="start">
            <VStack spacing={12}>
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
            <HStack spacing={10}>
              <Stack
                center
                h={36}
                w={36}
                bg={colors.blue[100]}
                radius={18}
                overflow="hidden"
              >
                <SvgUri width="100%" height="100%" uri={avatarUrl} />
              </Stack>
              <VStack spacing={2} shouldWrapChildren>
                <Text size="xxs">James Allchin</Text>
                <HStack items="center" spacing={4}>
                  <FontAwesomeIcon
                    icon={faStar}
                    color={colors.yellow[400]}
                    size={15}
                  />
                  <Text size="xs" color={colors.gray[500]}>
                    5.0
                  </Text>
                </HStack>
              </VStack>
            </HStack>
            <Chip textSize="xxs">20 min task</Chip>
          </HStack>

          <HStack
            justify="between"
            items="end"
            shouldWrapChildren
          ></HStack>
        </VStack>
      </Stack>
    </HStack>
  );
};
