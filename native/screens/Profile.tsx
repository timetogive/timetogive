import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '../providers/session';
import { Alert, RefreshControl, ScrollView } from 'react-native';
import { useQuery } from 'react-query';
import {
  getFullProfileSupabaseCall,
  getTaskSupabaseCall,
} from '../lib/supabaseCalls';
import { Box, HStack, Stack, VStack } from 'react-native-flex-layout';
import {
  BACK_BAR_CONTENT_HEIGHT,
  BackBar,
} from '../components/BackBar';
import colors, { defaultColor } from '../styles/colors';
import { Text } from '../components/Text';
import { SvgUri } from 'react-native-svg';
import { Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/sharp-solid-svg-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

// Profile screen
export const Profile = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const session = useSession();

  const { userId } = route.params;

  const fullProfileQuery = useQuery(
    ['GetFullProfile', userId],
    async () => {
      const query = getFullProfileSupabaseCall(userId);
      const { data, error } = await query;
      if (error) {
        Alert.alert('Error', error.message);
      }
      return data;
    },
    { enabled: !!userId }
  );

  const reload = async () => {
    await fullProfileQuery.refetch();
  };

  const fullProfile = fullProfileQuery.data;

  const isSvg = !!fullProfile?.avatar_url?.endsWith('.svg');

  if (!fullProfile) {
    return null;
  }

  return (
    <Box style={{ flex: 1 }}>
      <BackBar onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Box
          style={{ flex: 1 }}
          bg={colors.white}
          pt={BACK_BAR_CONTENT_HEIGHT + insets.top}
        >
          <VStack spacing={20} style={{ flex: 1 }}>
            <Stack items="center">
              <Stack
                items="center"
                justify="center"
                h={165}
                w={165}
                border={0.5}
                radius={80}
                borderColor={colors.gray[300]}
              >
                <Stack
                  center
                  h={140}
                  w={140}
                  bg={colors.white}
                  radius={70}
                  overflow="hidden"
                >
                  {isSvg && (
                    <SvgUri
                      width="100%"
                      height="100%"
                      uri={fullProfile.avatar_url}
                    />
                  )}
                  {!isSvg && fullProfile.avatar_url && (
                    <Image
                      source={{ uri: fullProfile.avatar_url }}
                      style={{ width: '100%', height: '100%' }}
                    />
                  )}
                </Stack>
              </Stack>
            </Stack>
            <VStack items="center" spacing={5} shouldWrapChildren>
              <Text
                size="xl"
                color={colors.gray[600]}
                weight="semi-bold"
              >
                {fullProfile.full_name}
              </Text>
              <HStack items="center" spacing={6}>
                <FontAwesomeIcon
                  icon={faStar}
                  color={colors.yellow[400]}
                  size={25}
                />
                <Text size="xl" color={colors.gray[500]}>
                  5.0
                </Text>
              </HStack>
            </VStack>
            <VStack
              radius={20}
              bg={defaultColor[900]}
              pt={25}
              ph={25}
              pb={60}
            >
              <VStack spacing={10} shouldWrapChildren>
                <Text color="white" size="xl" weight="medium">
                  About
                </Text>
                <Text color="white" size="sm">
                  {fullProfile.description}
                </Text>
              </VStack>
            </VStack>
            <VStack
              mt={-60}
              radius={20}
              bg={defaultColor[600]}
              pt={25}
              ph={25}
              pb={60}
              style={{ flex: 1 }}
            >
              <VStack spacing={10} shouldWrapChildren>
                <Text color="white" size="xl" weight="medium">
                  Stats & Reviews
                </Text>
                <Text color="white" size="sm">
                  Once the platform starts gaining traction, we'll be
                  adding in lister stats, volunteer stats, and
                  reviews. We're releasing quickly.
                </Text>
              </VStack>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  );
};
