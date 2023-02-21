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
import { LongLat } from '../providers/selectedLocation';
import { Text, translateFontSize } from './Text';

interface Props {
  longLat?: LongLat;
  onLongLatChange?: (volunteers: number) => void;
}

export const SetLocation = ({ longLat, onLongLatChange }: Props) => {
  return (
    <HStack justify="center">
      <Text>Set Location Will Go Here</Text>
    </HStack>
  );
};

interface SetLocationSheetModalProps extends Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SetLocationSheetModal = ({
  isOpen,
  onClose,
  longLat,
  onLongLatChange,
}: SetLocationSheetModalProps) => {
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
        snapPoints={['80%']}
        backdropComponent={renderBackdrop}
        onDismiss={onClose}
      >
        <Box style={{ flex: 1 }} p={10} radius={10} overflow="hidden">
          <SetLocation
            longLat={longLat}
            onLongLatChange={onLongLatChange}
          />
        </Box>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
