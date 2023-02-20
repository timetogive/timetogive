import { ReactNode } from 'react';
import { TextProps, Text as ReactNativeText } from 'react-native';
import { Size, Weight } from '../types';

// OpenSans_300Light,
// OpenSans_400Regular,
// OpenSans_500Medium,
// OpenSans_600SemiBold,
// OpenSans_700Bold,
// OpenSans_800ExtraBold,

interface Props extends TextProps {
  size?: Size;
  weight?: Weight;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  children?: ReactNode;
  color?: string;
}

const translateFontSize = (size?: Size) => {
  switch (size) {
    case 'xxs':
      return 11;
    case 'xs':
      return 14;
    case 'sm':
      return 15;
    case 'md':
      return 16;
    case 'lg':
      return 18;
    case 'xl':
      return 20;
    case '2xl':
      return 25;
    case '3xl':
      return 34;
    default:
      return 16;
  }
};

const translateWeightToFamily = (weight?: Weight) => {
  switch (weight) {
    case 'light':
      return 'OpenSans_300Light';
    case 'regular':
      return 'OpenSans_400Regular';
    case 'medium':
      return 'OpenSans_500Medium';
    case 'semi-bold':
      return 'OpenSans_600SemiBold';
    case 'bold':
      return 'OpenSans_700Bold';
    case 'extra-bold':
      return 'OpenSans_800ExtraBold';
    default:
      return 'OpenSans_400Regular';
  }
};

export const Text = ({
  children,
  size,
  weight,
  textAlign,
  color,
}: Props) => {
  const finalSize = translateFontSize(size);
  const finalFamily = translateWeightToFamily(weight);

  return (
    <ReactNativeText
      style={{
        fontSize: finalSize,
        fontFamily: finalFamily,
        ...(textAlign ? { textAlign } : {}),
        ...(color ? { color } : {}),
      }}
    >
      {children}
    </ReactNativeText>
  );
};
