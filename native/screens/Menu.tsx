import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { BackBar } from '../components/BackBar';
import { Text } from '../components/Text';
import { MainTabParamList } from './Main';

type Props = NativeStackScreenProps<MainTabParamList, 'Menu'>;

export const Menu = ({ route, navigation }: Props) => {
  return (
    <>
      <BackBar onBackPress={() => navigation.goBack()} />
      <Text>Menu</Text>
    </>
  );
};
