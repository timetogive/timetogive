import { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  children?: ReactNode;
}

export const SafeWrapper = ({ children, ...rest }: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flex: 1,
        justifyContent: 'flex-start',
      }}
      {...rest}
    >
      {children}
    </View>
  );
};
