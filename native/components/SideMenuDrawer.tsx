import { Box, Stack, VStack } from 'react-native-flex-layout';
import colors, { defaultColor } from '../styles/colors';

import { Text } from './Text';
import { TouchableOpacity, View } from 'react-native';
import { useSideMenu } from '../providers/sideMenu';
import { SafeWrapper } from './SafeWrapper';
import { faClose } from '@fortawesome/sharp-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useSession } from '../providers/session';
import { supabase } from '../lib/supabase';
import { Button } from '@rneui/themed';
import Animated, {
  SlideInRight,
  SlideOutRight,
} from 'react-native-reanimated';
import { usePush } from '../providers/push';
import { ButtonPrimary, ButtonSecondary } from './Buttons';
import { IconButtonWithShadow } from './IconButtonWithShadow';
import { ConfirmationModal } from './ConfirmationModal';
import { useState } from 'react';

export const SideMenuDrawer = () => {
  const push = usePush();
  const { open, setOpen } = useSideMenu();

  const [deletionConfirmationOpen, setDeletionConfirmationOpen] =
    useState<boolean>(false);

  const signOut = async () => {
    setOpen(false);
    console.log('Clicked on sign out', push.canPushOnDevice);
    // Clear the push token on the server
    await push.clearPushToken();
    await supabase.auth.signOut();
  };

  const deleteAccount = async () => {
    await push.clearPushToken();
    const { data, error } = await supabase.rpc('delete_account');
    console.log('Delete account', data, error);
    await signOut();
  };

  return (
    <>
      {open && (
        <Animated.View
          style={{
            flex: 1,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            zIndex: 1,
          }}
          entering={SlideInRight}
          exiting={SlideOutRight}
        >
          <SafeWrapper>
            <Box style={{ flex: 1 }} position="relative">
              <VStack
                style={{ flex: 1 }}
                ph={20}
                justify="end"
                spacing={10}
                shouldWrapChildren
              >
                <ButtonSecondary
                  onPress={() => {
                    console.log('Clicked on delete account');
                    setOpen(false);
                    setDeletionConfirmationOpen(true);
                  }}
                  fullWidth
                >
                  Delete my account
                </ButtonSecondary>
                <ButtonPrimary onPress={() => signOut()} fullWidth>
                  Sign out
                </ButtonPrimary>
              </VStack>
              <Box position="absolute" top={0} right={20}>
                <IconButtonWithShadow onPress={() => setOpen(false)}>
                  <FontAwesomeIcon
                    icon={faClose}
                    size={25}
                    color={defaultColor[500]}
                  />
                </IconButtonWithShadow>
              </Box>
            </Box>
          </SafeWrapper>
        </Animated.View>
      )}
      <ConfirmationModal
        title="Delete account"
        isOpen={deletionConfirmationOpen}
        onClose={() => setDeletionConfirmationOpen(false)}
        onConfirm={() => deleteAccount()}
        onCancel={() => setDeletionConfirmationOpen(false)}
      />
    </>
  );
};
