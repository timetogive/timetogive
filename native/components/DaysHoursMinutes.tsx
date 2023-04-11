import {
  BottomSheetModal,
  BottomSheetBackdropProps,
  BottomSheetBackdrop,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { HStack, VStack, Box } from 'react-native-flex-layout';
import { Text, translateFontSize } from './Text';
import { ButtonPrimary } from './Buttons';

const pickerFontSize = translateFontSize('sm');

interface Props {
  days: number;
  hours: number;
  minutes: number;
  onDaysChange?: (days: number) => void;
  onHoursChange?: (hours: number) => void;
  onMinutesChange?: (minutes: number) => void;
}

export const DaysHoursMinutes = ({
  days,
  hours,
  minutes,
  onDaysChange,
  onHoursChange,
  onMinutesChange,
}: Props) => {
  return (
    <HStack justify="center">
      <Box w={80}>
        <Picker
          selectedValue={days}
          onValueChange={(itemValue) =>
            onDaysChange && onDaysChange(itemValue)
          }
          itemStyle={{
            fontSize: pickerFontSize,
          }}
        >
          {[...Array(5)].map((_, i) => (
            <Picker.Item key={i} label={i.toFixed(0)} value={i} />
          ))}
        </Picker>
      </Box>
      <VStack justify="center">
        <Text size="xs">days</Text>
      </VStack>
      <Box w={80}>
        <Picker
          selectedValue={hours}
          onValueChange={(itemValue) =>
            onHoursChange && onHoursChange(itemValue)
          }
          itemStyle={{
            fontSize: pickerFontSize,
          }}
        >
          {[...Array(24)].map((_, i) => (
            <Picker.Item key={i} label={i.toFixed(0)} value={i} />
          ))}
        </Picker>
      </Box>
      <VStack justify="center">
        <Text size="xs">hours</Text>
      </VStack>
      <Box w={80}>
        <Picker
          selectedValue={minutes}
          onValueChange={(itemValue) =>
            onMinutesChange && onMinutesChange(itemValue)
          }
          itemStyle={{
            fontSize: pickerFontSize,
          }}
        >
          {[...Array(60)].map((_, i) => (
            <Picker.Item key={i} label={i.toFixed(0)} value={i} />
          ))}
        </Picker>
      </Box>
      <VStack justify="center">
        <Text size="xs">min</Text>
      </VStack>
    </HStack>
  );
};

interface DaysHoursMinutesSheetModalProps extends Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DaysHoursMinutesSheetModal = ({
  isOpen,
  onClose,
  days,
  hours,
  minutes,
  onDaysChange,
  onHoursChange,
  onMinutesChange,
}: DaysHoursMinutesSheetModalProps) => {
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
          <DaysHoursMinutes
            days={days}
            hours={hours}
            minutes={minutes}
            onDaysChange={onDaysChange}
            onHoursChange={onHoursChange}
            onMinutesChange={onMinutesChange}
          />
          <ButtonPrimary onPress={() => hideModal()}>
            Close
          </ButtonPrimary>
        </VStack>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
