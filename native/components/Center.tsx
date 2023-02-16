import { ReactNode } from 'react';
import { View } from 'react-native';

interface Props {
  children?: ReactNode;
}

export const Center = ({ children }: Props) => {
  return <View style={{ alignItems: 'center' }}>{children}</View>;
};
