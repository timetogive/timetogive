import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Box, HStack } from 'react-native-flex-layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../App';
import { SafeWrapper } from '../components/SafeWrapper';
import { Text } from '../components/Text';
import colors, { defaultColor } from '../styles/colors';

interface Props {
  navigation: NativeStackNavigationProp<ParamListBase>;
  children?: React.ReactNode;
}

export const BackBar = ({ navigation, children }: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <HStack
      pv={4}
      bg={defaultColor[500]}
      pt={insets.top + 5}
      pb={15}
      ph={20}
      items="center"
    >
      <HStack spacing={10} items="center">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            color={colors.white}
            size={25}
          />
        </TouchableOpacity>
      </HStack>
      {children}
    </HStack>
  );
};
