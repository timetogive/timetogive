import { ReactNode } from 'react';
import colors, { defaultColor } from '../styles/colors';
import { Stack } from 'react-native-flex-layout';
import { Text } from './Text';
import { Size, Weight } from '../types';

interface Props {
  backgroundColor?: string;
  textColor?: string;
  textSize?: Size;
  textWeight?: Weight;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children: ReactNode;
}
export const Chip = ({
  backgroundColor,
  textColor,
  textSize,
  textWeight,
  children,
}: Props) => {
  const bgColor = backgroundColor || defaultColor[500];
  const txColor = textColor || colors.white;

  return (
    <Stack
      pv={4}
      ph={10}
      style={{ backgroundColor: bgColor }}
      radius={50}
    >
      <Text color={txColor} size={textSize} weight={textWeight}>
        {children}
      </Text>
    </Stack>
  );
};
