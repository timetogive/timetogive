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
} from 'react-native-flex-layout';
import { Text } from './Text';
import colors, { defaultColor } from '../styles/colors';
import { faAngleDown } from '@fortawesome/pro-solid-svg-icons/faAngleDown';
import { faLocationDot } from '@fortawesome/pro-light-svg-icons/faLocationDot';
import { faList } from '@fortawesome/pro-light-svg-icons/faList';

import { TaskReason } from '../types';

interface TaskIconProps {
  reason: string;
}

const getIcon = ({ reason }: TaskIconProps) => {
  switch (reason) {
    case 'Charity':
      return faHouseHeart;
    case 'Community':
      return faPeopleGroup;
    case 'In Need':
      return faHandWave;
    case 'Mutual Benefit':
      return faHandshake;
    case 'Return For Pledge':
      return faHandHoldingDollar;
    default:
      return faHandWave;
  }
};

const TaskIcon = ({ reason }: TaskIconProps) => {
  const icon = getIcon({ reason });
  return (
    <FontAwesomeIcon
      icon={icon}
      size={20}
      color={defaultColor[500]}
    />
  );
};

interface Props {
  title: string;
  description: string;
  reason: string;
}

export const TaskCard = ({ title, description, reason }: Props) => {
  return (
    <Stack
      radius={5}
      style={{
        shadowColor: colors.gray[300],
        shadowOffset: { width: -4, height: 6 },
        shadowOpacity: 0.7,
        shadowRadius: 20,
        elevation: 6,
        backgroundColor: colors.white,
      }}
      p={25}
      h={150}
      overflow="hidden"
    >
      <VStack spacing={25}>
        <HStack justify="between">
          <Stack style={{ flex: 1 }}>
            <Text weight="bold">{title}</Text>
          </Stack>
          <Stack
            w={40}
            h={40}
            style={{
              backgroundColor: defaultColor[50],
            }}
            radius={10}
            center
          >
            <TaskIcon reason={reason} />
          </Stack>
        </HStack>
      </VStack>
    </Stack>
  );
};
