import 'expo-dev-client'
import React from 'react'
import { NativeNavigation } from 'app/navigation/native'
import { Providers } from 'app/providers'
import { useFonts } from 'expo-font'
import 'react-native-url-polyfill/auto'

export default function App() {
  const [loaded] = useFonts({
    InterLight: require('@tamagui/font-inter/otf/Inter-Light.otf'),
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  if (!loaded) {
    return null
  }

  return (
    <Providers>
      <NativeNavigation />
    </Providers>
  )
}
