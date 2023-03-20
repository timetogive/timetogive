import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { VStack, Box, Stack } from 'react-native-flex-layout';
import colors, { defaultColor } from '../styles/colors';
import { Text } from './Text';

export const TabWithIcon = ({
  focused,
  iconDefinition,
  focussedIconDefinition,
  title,
  redAlert,
}: {
  focused: boolean;
  iconDefinition: IconDefinition;
  focussedIconDefinition: IconDefinition;
  title: string;
  redAlert?: number;
}) => {
  const color = focused ? defaultColor[500] : colors.blackAlpha[500];
  const icon = focused ? focussedIconDefinition : iconDefinition;
  const redAlertText =
    redAlert && redAlert > 0 ? redAlert : undefined;
  return (
    <VStack spacing={3} center w={70}>
      <Box w={25} h={25} position="relative">
        <FontAwesomeIcon icon={icon} size={25} color={color} />
        {redAlertText && (
          <Stack
            center
            bg={colors.red[500]}
            radius={20}
            w={20}
            h={20}
            position="absolute"
            right={-10}
            top={-5}
          >
            <Text size="xxs" color={colors.white}>
              {redAlertText}
            </Text>
          </Stack>
        )}
      </Box>
      <Text size="xxs" textAlign="center" color={color}>
        {title}
      </Text>
    </VStack>
  );
};
