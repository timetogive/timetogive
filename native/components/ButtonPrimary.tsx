import { Button } from '@rneui/themed';
import React from 'react';
import { defaultColor } from '../styles/colors';
import { Box } from 'react-native-flex-layout';

interface Props {
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children?: React.ReactNode | string;
  leftIcon?: React.ReactNode;
}

export const ButtonPrimary = ({
  disabled,
  onPress,
  children,
  loading,
  leftIcon,
}: Props) => {
  return (
    <Button
      disabled={loading}
      onPress={onPress}
      buttonStyle={{
        padding: 15,
        borderRadius: 5,
        backgroundColor: defaultColor[400],
      }}
      titleStyle={{ fontSize: 18 }}
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
