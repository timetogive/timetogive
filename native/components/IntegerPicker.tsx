import {
  BottomSheetModal,
  BottomSheetBackdropProps,
  BottomSheetBackdrop,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import { Button } from '@rneui/themed';
import pluralize from 'pluralize';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HStack, VStack, Box } from 'react-native-flex-layout';
import { Text, translateFontSize } from './Text';

const pickerFontSize = translateFontSize('sm');

interface Props {
  value: number;
  min: number;
  max: number;
  onChange?: (value: number) => void;
  label?: string;
}

export const IntegerPicker = ({
  min,
  max,
  value,
  onChange,
  label,
}: Props) => {
  const finalLabel = label ? pluralize(label, value) : undefined;
  const length = max - min + 1;
  return (
    <HStack justify="center">
      <Box w={80}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) =>
            onChange && onChange(itemValue)
          }
          itemStyle={{
            fontSize: pickerFontSize,
          }}
        >
          {[...Array(length)].map((_, i) => (
            <Picker.Item
              key={i}
              label={(i + min).toFixed(0)}
              value={i + min}
            />
          ))}
        </Picker>
      </Box>
      {finalLabel && (
        <VStack justify="center">
          <Text size="xs">{finalLabel}</Text>
        </VStack>
      )}
    </HStack>
  );
};

interface IntegerPickerSheetModalProps extends Props {
  isOpen: boolean;
  onClose: () => void;
}

export const IntegerPickerSheetModal = ({
  isOpen,
  onClose,
  value,
  onChange,
  label,
  min,
  max,
}: IntegerPickerSheetModalProps) => {
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
          <IntegerPicker
            value={value}
            onChange={onChange}
            label={label}
            min={min}
            max={max}
          />
          <Button onPress={() => hideModal()}>Close</Button>
        </VStack>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
