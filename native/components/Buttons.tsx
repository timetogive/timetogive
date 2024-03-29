import { Button } from '@rneui/themed';
import React from 'react';
import colors, { defaultColor } from '../styles/colors';
import { Box } from 'react-native-flex-layout';
import { Text } from './Text';

interface Props {
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children?: React.ReactNode | string;
  leftIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

interface BaseProps extends Props {
  type: 'primary' | 'secondary';
}

const padding = (size: string) => {
  switch (size) {
    case 'sm':
      return 10;
    case 'md':
      return 15;
    case 'lg':
      return 20;
    default:
      return 15;
  }
};

const fontSize = (size: string) => {
  switch (size) {
    case 'sm':
      return 14;
    case 'md':
      return 18;
    case 'lg':
      return 22;
    default:
      return 18;
  }
};

const ButtonBase = ({
  disabled,
  onPress,
  children,
  loading,
  leftIcon,
  size,
  type,
  fullWidth,
}: BaseProps) => {
  const backgroundColor =
    type === 'primary' ? defaultColor[400] : colors.gray[400];
  const paddingSize = padding(size || 'md');
  const fontSizeSize = fontSize(size || 'md');
  const width = fullWidth ? '100%' : 'auto';

  return (
    <Button
      disabled={loading}
      onPress={onPress}
      buttonStyle={{
        padding: paddingSize,
        backgroundColor,
        borderRadius: 5,
        width,
      }}
      titleStyle={{ fontSize: fontSizeSize }}
    >
      {leftIcon && (
        <Box position="absolute" left={25}>
          {leftIcon}
        </Box>
      )}
      {children}
    </Button>
  );
};

export const ButtonPrimary = (props: Props) => {
  return <ButtonBase type="primary" {...props} />;
};

export const ButtonSecondary = (props: Props) => {
  return <ButtonBase type="secondary" {...props} />;
};
