import { Stack, StackPropsBase } from '@my/ui'
import { ReactNode } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Props extends StackPropsBase {
  children?: ReactNode
}

export const ScreenWrapper = ({ children, ...rest }: Props) => {
  const insets = useSafeAreaInsets()
  return (
    <Stack pt={insets.top} pb={insets.bottom} pl={insets.left} pr={insets.right} {...rest}>
      {children}
    </Stack>
  )
}
