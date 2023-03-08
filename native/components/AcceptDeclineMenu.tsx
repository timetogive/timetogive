import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { HStack, VStack, Stack, Box } from 'react-native-flex-layout';
import { getTtgIcon } from '../lib/tasksHelpers';
import colors, { defaultColor } from '../styles/colors';
import { TtgIcon } from './TtgIcon';
import { Text } from './Text';
import {
  BottomSheetModal,
  BottomSheetBackdropProps,
  BottomSheetBackdrop,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { useRef, useCallback, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { Button } from '@rneui/themed';
import {
  faCircleXmark,
  faCircleCheck,
  faComment,
} from '@fortawesome/pro-regular-svg-icons';

interface AcceptDeclineMenuProps {
  fullName?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  onMessage?: () => void;
}

export const AcceptDeclineMenu = ({
  fullName,
  onAccept,
  onDecline,
  onMessage,
}: AcceptDeclineMenuProps) => {
  return (
    <VStack spacing={10}>
      <Button onPress={() => onAccept && onAccept()} size="md">
        <HStack items="center" spacing={10} shouldWrapChildren>
          <Text size="xs" color={colors.white}>
            Accept offer
          </Text>
          <FontAwesomeIcon
            icon={faCircleCheck}
            color={colors.white}
            size={17}
          />
        </HStack>
      </Button>
      <Button onPress={() => onDecline && onDecline()} size="md">
        <HStack items="center" spacing={10} shouldWrapChildren>
          <Text size="xs" color={colors.white}>
            Decline offer
          </Text>
          <FontAwesomeIcon
            icon={faCircleXmark}
            color={colors.white}
            size={17}
          />
        </HStack>
      </Button>
      <Button onPress={() => onMessage && onMessage()} size="md">
        <HStack items="center" spacing={10} shouldWrapChildren>
          <Text size="xs" color={colors.white}>
            Message {fullName}
          </Text>
          <FontAwesomeIcon
            icon={faComment}
            color={colors.white}
            size={17}
          />
        </HStack>
      </Button>
    </VStack>
  );
};

interface AcceptDeclineMenuBottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  fullName?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  onMessage?: () => void;
}

export const AcceptDeclineMenuBottomSheetModal = ({
  isOpen,
  onClose,
  fullName,
  onAccept,
  onDecline,
  onMessage,
}: AcceptDeclineMenuBottomSheetModalProps) => {
  // Bottom sheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const showModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const hideModal = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);
  const renderBackdrop = useCallback(
    (props_: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props_}
        pressBehavior="close"
        opacity={0.5}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  useEffect(() => {
    if (isOpen) {
      showModal();
    } else {
      hideModal();
    }
  }, [isOpen]);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={['40%']}
        backdropComponent={renderBackdrop}
        onDismiss={onClose}
      >
        <Box p={20}>
          <AcceptDeclineMenu
            fullName={fullName}
            onAccept={onAccept}
            onDecline={onDecline}
            onMessage={onMessage}
          />
        </Box>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
