import { ReactNode } from 'react';
import { View } from 'react-native';
import { Stack } from 'react-native-flex-layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  children?: ReactNode;
}

export const SafeWrapper = ({ children, ...rest }: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <Stack
      pt={insets.top}
      pb={insets.bottom}
      pl={insets.left}
      pr={insets.right}
      style={{
        flex: 1,
      }}
      {...rest}
    >
      {children}
    </Stack>
  );
};
