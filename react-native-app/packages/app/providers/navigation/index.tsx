import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native'
import * as Linking from 'expo-linking'
import { useMemo } from 'react'

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  return (
    <NavigationContainer
      linking={useMemo(
        () => ({
          prefixes: [Linking.createURL('/')],
          config: {
            initialRouteName: 'home',
            screens: {
              home: '',
              'sign-in': 'sign-in',
              'sign-up': 'sign-up',
            },
          },
        }),
        []
      )}
    >
      {children}
    </NavigationContainer>
  )
}
