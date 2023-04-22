import { Button } from '@rneui/themed';
import { Polygon } from 'geojson';
import { useState } from 'react';
import { Alert, StatusBar } from 'react-native';
import { Box, VStack } from 'react-native-flex-layout';
import { supabase } from '../lib';
import { useSession } from '../providers/session';
import colors, { defaultColor } from '../styles/colors';
import { SetPolygonSheetModal } from './SetPolygon';
import { Text } from './Text';
import { ScrollWithAvoidKeyboardView } from './ScrollWithAvoidKeyboardView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ButtonPrimary } from './Buttons';

export const MissingHomeArea = () => {
  const insets = useSafeAreaInsets();
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const session = useSession();

  const setPolygon = async (polygon: Polygon) => {
    console.log('Saving search location to the server', polygon);
    const { error } = await supabase.rpc('save_home_polygon', {
      p_home_polygon: polygon as any,
    });
    if (error) {
      console.log('Error saving search location to server', error);
    }
    // Refetch the user session
    session.refetch();
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
              spacing={20}
              ph={20}
              shouldWrapChildren
            >
              <Text size="xl" weight="bold">
                Set your home area
              </Text>
              <Text size="xs" color={defaultColor[400]}>
                TimeToGive is all about helping each other in your
                local community. The home area determines the default
                area you are willing to volunteer in and also
                determines which tasks you will be notified about.
              </Text>
            </VStack>
            <VStack
              spacing={10}
              ph={20}
              style={{ flex: 1 }}
              shouldWrapChildren
            >
              <ButtonPrimary onPress={() => setMapModalOpen(true)}>
                Draw on map
              </ButtonPrimary>
            </VStack>
          </VStack>
        </Box>
        <SetPolygonSheetModal
          isOpen={mapModalOpen}
          onClose={() => setMapModalOpen(false)}
          onPolygonChange={(polygon) => setPolygon(polygon)}
        />
      </ScrollWithAvoidKeyboardView>
    </>
  );
};
