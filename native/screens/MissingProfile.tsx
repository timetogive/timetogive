import { useState } from 'react';
import { Stack, VStack, HStack } from 'react-native-flex-layout';
import { SafeWrapper } from '../components/SafeWrapper';
import { Text } from '../components/Text';
import colors, { defaultColor } from '../styles/colors';
import { nanoid } from 'nanoid/non-secure';
import { SvgUri } from 'react-native-svg';
import Constants from 'expo-constants';
import { Button } from '@rneui/themed';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowsRotate } from '@fortawesome/pro-light-svg-icons/faArrowsRotate';
import { faCamera } from '@fortawesome/pro-light-svg-icons/faCamera';
import { Image } from 'react-native';
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

const getNewAvatarUrl = () => {
  return `${multiAvatarApiUrl}/${nanoid()}.svg?apiKey=${multiAvatarApiKey}`;
};

export const MissingProfile = () => {
  const [avatarUrl, setAvatarUrl] = useState<string>(
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
        'Permission Denied',
        'Your device would now allow access to your camera. Go to app settings and allow camera to be used',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
          { text: 'Settings', onPress: () => Linking.openSettings() },
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
      setDialogVisible(false);
      setImageUri(result.assets[0].uri);
    }
  };

  const clickFile = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    // Assuming the user picked something from their library
    if (!result.canceled) {
      setDialogVisible(false);
      setImageUri(result.assets[0].uri);
    }
  };

  const clickSaveAndContinue = async () => {
    setSaving(true);
    if (imageUri) {
      Alert.alert(
        'Custom avatar not yet supported - please regenerate'
      );
      return;
    }

    if (!avatarUrl) {
      return;
    }

    // Bit inefficient, but we need to download the avatar
    const { data } = await axios.get(avatarUrl);

    const filePath = `${nanoid()}.svg`;

    // Use supabase storage to upload the avatar
    let { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, data, { contentType: 'image/svg+xml' });

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
  };

  return (
    <>
      <Stack bg={colors.gray[200]} style={{ flex: 1 }}>
        <SafeWrapper>
          <VStack
            ph={40}
            spacing={30}
            pt={100}
            center
            shouldWrapChildren
          >
            <Stack
              center
              h={140}
              w={140}
              bg={colors.white}
              radius={70}
              overflow="hidden"
            >
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: 200, height: 200 }}
                />
              ) : (
                <SvgUri width="100%" height="100%" uri={avatarUrl} />
              )}
            </Stack>
            <Text weight="bold" size="lg">
              Your Profile Picture
            </Text>
            <HStack spacing={10} center shouldWrapChildren>
              <Button
                onPress={() => regenerateAvatarUrl()}
                color={colors.gray[500]}
              >
                Regenerate{' '}
                <FontAwesomeIcon
                  icon={faArrowsRotate}
                  color={colors.white}
                />
              </Button>
              <Button
                onPress={() => clickOwnPic()}
                color={colors.gray[500]}
              >
                Use my own{' '}
                <FontAwesomeIcon
                  icon={faCamera}
                  color={colors.white}
                />
              </Button>
            </HStack>
            <Text textAlign="center">
              To get started, you need to set a profile picture. We've
              generated one for you.
            </Text>

            <Button
              onPress={() => clickSaveAndContinue()}
              color={defaultColor[500]}
            >
              Save and continue
            </Button>
          </VStack>
        </SafeWrapper>
      </Stack>
      <StandardModal
        isVisible={dialogVisible}
        onBackdropPress={() => setDialogVisible(false)}
      >
        <VStack spacing={20}>
          <Button onPress={() => clickCamera()}>Use camera</Button>
          <Button onPress={() => clickFile()}>
            Pick from photos
          </Button>
        </VStack>
      </StandardModal>
    </>
  );
};
