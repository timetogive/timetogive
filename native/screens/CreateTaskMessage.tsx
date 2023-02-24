import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { BackBar } from '../components/BackBar';
import { Text } from '../components/Text';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'CreateTaskMessage'
>;

export const CreateTaskMessage = ({ navigation }: Props) => {
  return (
    <>
      <BackBar navigation={navigation} />
      <Text>Create a task message</Text>
    </>
  );
};
