import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Stack, VStack, HStack, Box } from 'react-native-flex-layout';
import { SafeWrapper } from '../components/SafeWrapper';
import { Text, translateFontSize } from '../components/Text';
import colors, { defaultColor } from '../styles/colors';
import { nanoid } from 'nanoid/non-secure';
import { SvgUri } from 'react-native-svg';
import Constants from 'expo-constants';
import { Button, Input } from '@rneui/themed';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowsRotate } from '@fortawesome/pro-light-svg-icons/faArrowsRotate';
import { faImage, faCamera } from '@fortawesome/pro-light-svg-icons';
import { Image, StatusBar, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal';
import { StandardModal } from '../components/StandardModal';
import { Alert, Linking } from 'react-native';
import axios from 'axios';
import { supabase } from '../lib';
import { useSession } from '../providers/session';
import {
  multiAvatarApiKey,
  multiAvatarApiUrl,
  supabaseUrl,
} from '../lib/consts';
import {
  BottomSheetModal,
  BottomSheetBackdropProps,
  BottomSheetBackdrop,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { CreateActionMenu } from './CreateActionMenu';
import { TaskReason } from '../types';
import { TtgIcon } from './TtgIcon';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { decode } from 'base64-arraybuffer';
import { ScrollWithAvoidKeyboardView } from './ScrollWithAvoidKeyboardView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ButtonPrimary, ButtonSecondary } from './Buttons';

interface MenuBottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuItemPress?: (action: string) => void;
}

export const MenuBottomSheetModal = ({
  isOpen,
  onClose,
  onMenuItemPress,
}: MenuBottomSheetModalProps) => {
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
        snapPoints={['35%']}
        backdropComponent={renderBackdrop}
        onDismiss={onClose}
      >
        <VStack>
          <TouchableOpacity
            onPress={() =>
              onMenuItemPress && onMenuItemPress('camera')
            }
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
                <FontAwesomeIcon
                  icon={faCamera}
                  color={colors.gray[800]}
                  size={20}
                />
              </Stack>
              <VStack shouldWrapChildren spacing={5}>
                <Text size="sm">Use your camera</Text>
                <Text size="xxs" color={colors.gray[400]}>
                  Use your camera to take a photo or selfie
                </Text>
              </VStack>
            </HStack>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              onMenuItemPress && onMenuItemPress('photos')
            }
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
                <FontAwesomeIcon
                  icon={faImage}
                  color={colors.gray[800]}
                  size={20}
                />
              </Stack>
              <VStack shouldWrapChildren spacing={5}>
                <Text size="sm">Select from photos</Text>
                <Text size="xxs" color={colors.gray[400]}>
                  Select a photo or file from your library
                </Text>
              </VStack>
            </HStack>
          </TouchableOpacity>
        </VStack>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const getNewAvatarUrl = () => {
  return `${multiAvatarApiUrl}/${nanoid()}.svg?apiKey=${multiAvatarApiKey}`;
};

export const MissingAvatar = () => {
  const insets = useSafeAreaInsets();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    getNewAvatarUrl()
  );
  const [imageUri, setImageUri] = useState<string | undefined>(
    undefined
  );
  const [dialogVisible, setDialogVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const session = useSession();

  const regenerateAvatarUrl = () => {
    setImageUri(undefined);
    setAvatarUrl(getNewAvatarUrl());
  };

  const clickOwnPic = async () => {
    setDialogVisible(true);
  };

  const clickCamera = async () => {
    let { status } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Unable to access your camera',
        'Your device would not allow access to your camera. To allow this, you will need to visit the app settings.',
        [
          {
            text: 'Dismiss',
          },
          {
            text: 'Go to settings',
            onPress: () => Linking.openSettings(),
          },
        ]
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // Assuming the user picked something from their library
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setAvatarUrl(undefined);
    }
  };

  const clickFile = async () => {
    console.log('In clickFile');
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    // Assuming the user picked something from their library
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setAvatarUrl(undefined);
    }
  };

  const clickSaveAndContinue = async () => {
    if (!imageUri) {
      Alert.alert('Please set a photo.');
      return;
    }
    setSaving(true);
    console.log('imageUri');

    console.log(imageUri);

    // We need to use base64 decoded to upload to supabase storage
    // See: https://supabase.com/docs/reference/javascript/storage-from-upload
    const { base64 } = await manipulateAsync(
      imageUri,
      [{ resize: { width: 600 } }],
      {
        compress: 1,
        format: SaveFormat.JPEG,
        base64: true,
      }
    );

    const filePath = `${nanoid()}.jpg`;

    if (!base64) {
      Alert.alert('Could not use the image. Please try a new photo.');
      return;
    }

    // Use supabase storage to upload the avatar
    let { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, decode(base64), {
        contentType: 'image/jpeg',
      });

    if (error) {
      Alert.alert('Error uploading avatar');
      throw error;
    }

    // Now update the user's profile with the new avatar URL
    const fullAvatarUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${filePath}`;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: fullAvatarUrl })
      .eq('id', session.user?.id);

    if (updateError) {
      Alert.alert('Error setting the avatar URL');
      throw error;
    }

    // Refetch the user session
    session.refetch();
    setSaving(false);
  };

  return (
    <>
      <StatusBar animated={true} barStyle={'dark-content'} />
      <ScrollWithAvoidKeyboardView>
        <Box
          style={{ flex: 1 }}
          bg={colors.white}
          pt={insets.top + 60}
        >
          <VStack spacing={20}>
            <VStack
              items="center"
              spacing={10}
              ph={20}
              style={{ flex: 1 }}
              shouldWrapChildren
            >
              <Text size="xl" weight="bold">
                Set a profile picture
              </Text>
              <Text size="xs" color={defaultColor[400]}>
                A profile picture helps other users recognise you on
                the platform. For the best trust factor, we recommend
                using a real photo of yourself.
              </Text>
              <Stack
                center
                h={140}
                w={140}
                bg={colors.gray[100]}
                radius={70}
                overflow="hidden"
              >
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={{ width: 200, height: 200 }}
                  />
                ) : (
                  <TouchableOpacity onPress={() => clickOwnPic()}>
                    <VStack items="center">
                      <FontAwesomeIcon
                        icon={faCamera}
                        color={colors.gray[600]}
                        size={40}
                      />
                      <Text size="xxs" color={colors.gray[600]}>
                        Set Photo
                      </Text>
                    </VStack>
                  </TouchableOpacity>
                )}
              </Stack>
            </VStack>
            <VStack
              spacing={10}
              ph={20}
              style={{ flex: 1 }}
              shouldWrapChildren
            >
              <ButtonSecondary
                onPress={() => clickOwnPic()}
                leftIcon={
                  <FontAwesomeIcon
                    icon={faCamera}
                    color={colors.white}
                  />
                }
                fullWidth
              >
                Take photo or upload
              </ButtonSecondary>

              <ButtonPrimary
                onPress={() => clickSaveAndContinue()}
                fullWidth
              >
                Save and continue
              </ButtonPrimary>
            </VStack>
          </VStack>
          <MenuBottomSheetModal
            isOpen={dialogVisible}
            onClose={() => setDialogVisible(false)}
            onMenuItemPress={(item) => {
              console.log('item', item);
              if (item === 'camera') {
                clickCamera();
              } else if (item === 'photos') {
                clickFile();
              }
              setDialogVisible(false);
            }}
          />
        </Box>
      </ScrollWithAvoidKeyboardView>
    </>
  );
};
