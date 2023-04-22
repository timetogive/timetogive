import { Text } from './Text';
import {
  BottomSheetModal,
  BottomSheetBackdropProps,
  BottomSheetBackdrop,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { useRef, useCallback, useEffect } from 'react';
import { ButtonPrimary, ButtonSecondary } from './Buttons';
import { VStack } from 'react-native-flex-layout';

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal = ({
  title,
  isOpen,
  onClose,
  onConfirm,
  onCancel,
}: Props) => {
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
    console.log('isOpen useEffect');
    if (isOpen) {
      console.log('Setting modal to open');
      showModal();
    } else {
      console.log('Setting modal to closed');
      hideModal();
    }
  }, [isOpen]);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={['50%']}
        backdropComponent={renderBackdrop}
        onDismiss={onClose}
        style={{ zIndex: 1000 }}
      >
        <VStack p={20} spacing={10} shouldWrapChildren>
          <Text size="xl" weight="bold">
            {title}
          </Text>
          <Text size="lg" weight="semi-bold">
            Are you sure?
          </Text>
          <Text size="md">This action can not be undone</Text>
          <ButtonPrimary onPress={() => onConfirm()} fullWidth>
            Confirm
          </ButtonPrimary>
          <ButtonSecondary onPress={() => onCancel()} fullWidth>
            Cancel
          </ButtonSecondary>
        </VStack>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
