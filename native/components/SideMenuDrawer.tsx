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
import { ButtonPrimary } from './Buttons';

export const SideMenuDrawer = () => {
  const push = usePush();
  const { open, setOpen } = useSideMenu();

  const signOut = async () => {
    setOpen(false);
    console.log('Clicked on sign out', push.canPushOnDevice);
    // Clear the push token on the server
    await push.clearPushToken();
    await supabase.auth.signOut();
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
            zIndex: 100,
          }}
          entering={SlideInRight}
          exiting={SlideOutRight}
        >
          <SafeWrapper>
            <Box style={{ flex: 1 }} position="relative">
              <VStack style={{ flex: 1 }} center>
                <ButtonPrimary onPress={() => signOut()}>
                  Sign out
                </ButtonPrimary>
              </VStack>
              <Box position="absolute" top={0} right={20}>
                <TouchableOpacity onPress={() => setOpen(false)}>
                  <Stack
                    style={{ backgroundColor: colors.white }}
                    center
                    radius={100}
                    h={40}
                    w={40}
                    p={5}
                  >
                    <VStack center>
                      <FontAwesomeIcon
                        icon={faClose}
                        size={25}
                        color={defaultColor[500]}
                      />
                    </VStack>
                  </Stack>
                </TouchableOpacity>
              </Box>
            </Box>
          </SafeWrapper>
        </Animated.View>
      )}
    </>
  );
};
