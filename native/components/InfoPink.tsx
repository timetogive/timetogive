import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faInfoCircle } from '@fortawesome/sharp-solid-svg-icons';
import { HStack, Box } from 'react-native-flex-layout';
import { Text } from './Text';
import colors from '../styles/colors';

interface InfoPinkProps {
  message: string;
}

export const InfoPink = ({ message }: InfoPinkProps) => {
  return (
    <HStack
      bg={colors.pink[500]}
      opacity={0.8}
      ph={15}
      pv={15}
      radius={5}
      spacing={10}
    >
      <FontAwesomeIcon
        icon={faInfoCircle}
        color={colors.white}
        size={20}
      />
      <Box style={{ flex: 1 }}>
        <Text size="xs" color={colors.white} style={{ flex: 1 }}>
          {message}
        </Text>
      </Box>
    </HStack>
  );
};
