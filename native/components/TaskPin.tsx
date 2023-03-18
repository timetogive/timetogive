import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationPin } from '@fortawesome/sharp-solid-svg-icons';
import { faLocationPin as faLocationPinOpen } from '@fortawesome/sharp-regular-svg-icons';
import { VStack, Box } from 'react-native-flex-layout';
import { getTtgIcon } from '../lib/tasksHelpers';
import colors, { defaultColor } from '../styles/colors';
import { TaskReason } from '../types';

interface Props {
  reason?: TaskReason;
  opacity?: number;
}
export const TaskPin = ({ opacity, reason }: Props) => {
  return (
    <VStack position="relative" h={40} w={40} center>
      <FontAwesomeIcon
        icon={faLocationPin}
        color={defaultColor[400]}
        size={40}
        style={{ opacity: opacity || 0.9 }}
      />
      <FontAwesomeIcon
        icon={faLocationPinOpen}
        color={defaultColor[700]}
        size={40}
        style={{
          opacity: opacity || 0.9,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <VStack position="absolute" top={8}>
        <FontAwesomeIcon
          icon={getTtgIcon(reason || 'Charity')}
          color={colors.white}
          size={15}
        />
      </VStack>
    </VStack>
  );
};
