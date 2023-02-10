import { createNativeStackNavigator } from '@react-navigation/native-stack'

import 'react-native-url-polyfill/auto'
import { SignUpScreen } from 'app/screens'
import { MainScreen } from 'app/screens'
import { SignInScreen } from 'app/screens'
import { SignedIn } from 'app/components/SignedIn'
import { SignedOut } from 'app/components/SignedOut'

const Stack = createNativeStackNavigator()

export function NativeNavigation() {
  return (
    <>
      <SignedIn>
        <Stack.Navigator>
          <Stack.Screen
            name="home"
            component={MainScreen}
            options={{
              title: 'Main',
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </SignedIn>
      <SignedOut>
        <Stack.Navigator>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} component={SignInScreen} />
          <Stack.Screen name="sign-up" options={{ headerShown: false }} component={SignUpScreen} />
        </Stack.Navigator>
      </SignedOut>
    </>
  )
}
