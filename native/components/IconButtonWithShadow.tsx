import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { StatusBar, TouchableOpacity } from 'react-native';
import { Box, HStack, Stack, VStack } from 'react-native-flex-layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../App';
import { SafeWrapper } from '../components/SafeWrapper';
import { Text } from '../components/Text';
import colors, { defaultColor } from '../styles/colors';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
}
export const IconButtonWithShadow = ({
  onPress,
  children,
}: Props) => {
  return (
    <TouchableOpacity onPress={() => onPress && onPress()}>
      <Stack
        style={{
          backgroundColor: colors.white,
          shadowColor: colors.gray[600],
          shadowOffset: { width: -4, height: 6 },
          shadowOpacity: 0.7,
          shadowRadius: 20,
          elevation: 2,
        }}
        center
        radius={100}
        h={40}
        w={40}
        p={5}
      >
        <VStack center>{children}</VStack>
      </Stack>
    </TouchableOpacity>
  );
};
