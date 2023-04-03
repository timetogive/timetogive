import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/sharp-solid-svg-icons';
import { Box, HStack, Stack, VStack } from 'react-native-flex-layout';
import { SvgUri } from 'react-native-svg';
import colors from '../styles/colors';
import { Text } from '../components/Text';
import { Image, Pressable } from 'react-native';

interface Props {
  avatarUrl: string;
  fullName: string;
  onPressProfile?: () => void;
}

export const MiniProfile = ({
  avatarUrl,
  fullName,
  onPressProfile,
}: Props) => {
  // Decide whether to use image or svg
  const isSvg = avatarUrl.endsWith('.svg');
  return (
    <Pressable onPress={() => onPressProfile && onPressProfile()}>
      <HStack spacing={10}>
        <Stack
          center
          h={36}
          w={36}
          bg={colors.blue[100]}
          radius={18}
          overflow="hidden"
        >
          {isSvg ? (
            <SvgUri width="100%" height="100%" uri={avatarUrl} />
          ) : (
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: 36, height: 36 }}
            />
          )}
        </Stack>
        <VStack spacing={2} shouldWrapChildren>
          <Text size="xxs" color={colors.gray[500]}>
            {fullName}
          </Text>
          <HStack items="center" spacing={4}>
            <FontAwesomeIcon
              icon={faStar}
              color={colors.yellow[400]}
              size={15}
            />
            <Text size="xs" color={colors.gray[500]}>
              5.0
            </Text>
          </HStack>
        </VStack>
      </HStack>
    </Pressable>
  );
};
