import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { getTtgIcon } from '../lib/tasksHelpers';
import { defaultColor } from '../styles/colors';
import { TaskReason } from '../types';

interface TtgIconProps {
  reason: TaskReason | string;
}

export const TtgIcon = ({ reason }: TtgIconProps) => {
  const icon = getTtgIcon(reason);
  return (
    <FontAwesomeIcon
      icon={icon}
      size={20}
      color={defaultColor[500]}
    />
  );
};
