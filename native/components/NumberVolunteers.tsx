import {
  BottomSheetModal,
  BottomSheetBackdropProps,
  BottomSheetBackdrop,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import { Button } from '@rneui/themed';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HStack, VStack, Box } from 'react-native-flex-layout';
import { Text, translateFontSize } from './Text';

const pickerFontSize = translateFontSize('sm');

interface Props {
  volunteers: number;
  onVolunteersChange?: (volunteers: number) => void;
}

export const NumberVolunteers = ({
  volunteers,
  onVolunteersChange,
}: Props) => {
  return (
    <HStack justify="center">
      <Box w={80}>
        <Picker
          selectedValue={volunteers}
          onValueChange={(itemValue) =>
            onVolunteersChange && onVolunteersChange(itemValue)
          }
          itemStyle={{
            fontSize: pickerFontSize,
          }}
        >
          {[...Array(50)].map((_, i) => (
            <Picker.Item key={i} label={i.toFixed(0)} value={i} />
          ))}
        </Picker>
      </Box>
      <VStack justify="center">
        <Text size="xs">volunteers</Text>
      </VStack>
    </HStack>
  );
};

interface NumberVolunteersSheetModalProps extends Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NumberVolunteersSheetModal = ({
  isOpen,
  onClose,
  volunteers,
  onVolunteersChange,
}: NumberVolunteersSheetModalProps) => {
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
        opacity={0.8}
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
        snapPoints={['50%']}
        backdropComponent={renderBackdrop}
        onDismiss={onClose}
      >
        <VStack ph={5}>
          <NumberVolunteers
            volunteers={volunteers}
            onVolunteersChange={onVolunteersChange}
          />
          <Button onPress={() => hideModal()}>Close</Button>
        </VStack>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
