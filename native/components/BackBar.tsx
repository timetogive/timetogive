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
  children?: React.ReactNode;
  onBackPress?: () => void;
}

export const BACK_BAR_CONTENT_HEIGHT = 60;

export const BackBar = ({ onBackPress, children }: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <>
      <StatusBar animated={true} barStyle={'dark-content'} />

      <HStack
        bg={colors.whiteAlpha[900]}
        pt={insets.top + 5}
        pb={10}
        ph={20}
        h={BACK_BAR_CONTENT_HEIGHT + insets.top}
        items="center"
        spacing={10}
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={2}
      >
        <HStack spacing={10} items="center">
          <TouchableOpacity
            onPress={() => onBackPress && onBackPress()}
          >
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
              <VStack center>
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  color={colors.gray[800]}
                  size={25}
                />
              </VStack>
            </Stack>
          </TouchableOpacity>
        </HStack>
        {children}
      </HStack>
    </>
  );
};
