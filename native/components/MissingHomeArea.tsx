import { Button } from '@rneui/themed';
import { Polygon } from 'geojson';
import { useState } from 'react';
import { Alert } from 'react-native';
import { Box, VStack } from 'react-native-flex-layout';
import { supabase } from '../lib';
import { useSession } from '../providers/session';
import colors, { defaultColor } from '../styles/colors';
import { SetPolygonSheetModal } from './SetPolygon';
import { Text } from './Text';

export const MissingHomeArea = () => {
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
      <VStack justify="center" style={{ flex: 1 }} bg={colors.white}>
        <VStack
          items="center"
          spacing={20}
          ph={20}
          shouldWrapChildren
        >
          <Text size="xl" weight="bold">
            Set your home area
          </Text>
          <Button onPress={() => setMapModalOpen(true)}>
            Start now
          </Button>
          <Text size="xs" color={defaultColor[400]}>
            TimeToGive is all about helping each other in your local
            community. The home area is used to define which areas you
            are willing to volunteer in and therefore also determines
            which tasks you will be notified about.
          </Text>
        </VStack>
      </VStack>
      <SetPolygonSheetModal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        onPolygonChange={(polygon) => setPolygon(polygon)}
      />
    </>
  );
};
