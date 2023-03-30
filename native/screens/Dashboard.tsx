import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, RefreshControl } from 'react-native';
import { VStack, Box } from 'react-native-flex-layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../App';
import {
  BackBar,
  BACK_BAR_CONTENT_HEIGHT,
} from '../components/BackBar';
import { Text } from '../components/Text';
import colors from '../styles/colors';
import { MainTabParamList } from './Main';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Dashboard'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const Dashboard = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <>
      <VStack style={{ flex: 1 }} bg={colors.white}>
        <BackBar onBackPress={() => navigation.goBack()} />
        <ScrollView>
          <Box
            style={{ flex: 1 }}
            bg={colors.white}
            pt={BACK_BAR_CONTENT_HEIGHT + insets.top}
            pb={insets.bottom + 500}
          >
            <VStack ph={20} shouldWrapChildren spacing={20}>
              <Text size="lg" weight="semi-bold">
                Dashboard
              </Text>
              <Text size="sm">
                We're currently in beta but releasing new features
                pretty much daily. This screen will contain a summary
                of all your tasks including those you have created and
                those you have volunteered for.
              </Text>
            </VStack>
          </Box>
        </ScrollView>
      </VStack>
    </>
  );
};
