import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button } from '@rneui/themed';
import { TouchableOpacity } from 'react-native';
import { Box, Stack, VStack } from 'react-native-flex-layout';
import Modal, { ModalProps } from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { faClose } from '@fortawesome/pro-light-svg-icons/faClose';
import colors from '../styles/colors';
import { Text } from '../components/Text';
import { SafeWrapper } from './SafeWrapper';

interface Props {
  isVisible: boolean;
  onBackdropPress: () => void;
  children: React.ReactNode;
}
export const StandardModal = ({
  isVisible,
  onBackdropPress,
  children,
}: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal isVisible={isVisible} onBackdropPress={onBackdropPress}>
      <Stack bg={colors.white} p={20} radius={10} position="relative">
        <TouchableOpacity onPress={onBackdropPress}>
          <Stack direction="row-reverse">
            <Box pb={10}>
              <FontAwesomeIcon
                icon={faClose}
                color={colors.black}
                size={25}
              />
            </Box>
          </Stack>
        </TouchableOpacity>
        {children}
      </Stack>
    </Modal>
  );
};
