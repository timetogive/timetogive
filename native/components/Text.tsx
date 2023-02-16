import { ReactNode } from 'react';
import { TextProps, Text as ReactNativeText } from 'react-native';

type Size = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

type Weight =
  | 'light'
  | 'regular'
  | 'semi-bold'
  | 'bold'
  | 'extra-bold';

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

const translateWeight = (weight?: Weight) => {
  switch (weight) {
    case 'light':
      return '200';
    case 'regular':
      return 'normal';
    case 'semi-bold':
    case 'bold':
    case 'extra-bold':
      return 'bold';
    default:
      return 'normal';
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
  const finalWeight = translateWeight(weight);

  return (
    <ReactNativeText
      style={{
        fontSize: finalSize,
        fontWeight: finalWeight,
        ...(textAlign ? { textAlign } : {}),
        ...(color ? { color } : {}),
      }}
    >
      {children}
    </ReactNativeText>
  );
};
