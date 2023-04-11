import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { HStack, VStack, Stack } from 'react-native-flex-layout';
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
import { TaskReason } from '../types';

interface CreateButtonProps {
  action: string;
  title: string;
  description: string;
  onMenuItemPress?: (action: string) => void;
}

const CreateButton = ({
  action,
  description,
  title,
  onMenuItemPress,
}: CreateButtonProps) => {
  return (
    <TouchableOpacity
      onPress={() => onMenuItemPress && onMenuItemPress(action)}
    >
      <HStack
        borderBottom={1}
        p={20}
        spacing={20}
        borderColor={colors.gray[300]}
      >
        <Stack
          w={50}
          h={50}
          style={{
            backgroundColor: defaultColor[50],
          }}
          radius={50}
          center
        >
          <TtgIcon reason={action as TaskReason} />
        </Stack>
        <VStack shouldWrapChildren spacing={5} style={{ flex: 1 }}>
          <Text size="sm">{title}</Text>
          <Text size="xxs" color={colors.gray[400]}>
            {description}
          </Text>
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
};

interface CreateActionMenuProps {
  onMenuItemPress?: (action: string) => void;
}

export const CreateActionMenu = ({
  onMenuItemPress,
}: CreateActionMenuProps) => {
  return (
    <VStack>
      <CreateButton
        title="Task in return for pledge"
        description="Create a task where you will make a pledge in return"
        action="Return For Pledge"
        onMenuItemPress={() =>
          onMenuItemPress && onMenuItemPress('Return For Pledge')
        }
      />
      <CreateButton
        title="Task for those in need"
        description="Create a task directly on behalf of the vulnerable or in need"
        action="In Need"
        onMenuItemPress={() =>
          onMenuItemPress && onMenuItemPress('In Need')
        }
      />
      <CreateButton
        title="Task for charity or community"
        description="Create a task on behalf of a charity, community group, or to help neighbourhood"
        action="Charity"
        onMenuItemPress={() =>
          onMenuItemPress && onMenuItemPress('Charity')
        }
      />
    </VStack>
  );
};

interface CreateActionMenuBottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuItemPress?: (action: string) => void;
}

export const CreateActionMenuBottomSheetModal = ({
  isOpen,
  onClose,
  onMenuItemPress,
}: CreateActionMenuBottomSheetModalProps) => {
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
        snapPoints={['50%']}
        backdropComponent={renderBackdrop}
        onDismiss={onClose}
      >
        <CreateActionMenu onMenuItemPress={onMenuItemPress} />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
