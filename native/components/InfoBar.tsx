import { faInfoCircle } from '@fortawesome/sharp-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { HStack } from 'react-native-flex-layout';
import colors, { defaultColor } from '../styles/colors';
import { Text } from '../components/Text';

interface Props {
  message: string;
}

export const InfoBar = ({ message }: Props) => {
  return (
    <HStack
      ph={20}
      pv={10}
      bg={defaultColor[800]}
      justify="between"
      items="center"
      shouldWrapChildren
    >
      <Text color={colors.white} size="sm">
        {message}
      </Text>
      <FontAwesomeIcon
        icon={faInfoCircle}
        color={colors.white}
        size={20}
      />
    </HStack>
  );
};
