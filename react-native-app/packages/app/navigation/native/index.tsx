import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from 'app/screens/HomeScreen'

import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from 'app/lib/supabase'
import SignInScreen from 'app/screens/SignInScreen'
import { Session } from '@supabase/supabase-js'
import SignUpScreen from 'app/screens/SignUpScreen'

const Stack = createNativeStackNavigator()

export function NativeNavigation() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <Stack.Navigator>
      {session && session.user ? (
        <>
          <Stack.Screen
            name="home"
            component={HomeScreen}
            options={{
              title: 'Home',
              headerShown: false,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} component={SignInScreen} />
          <Stack.Screen name="sign-up" options={{ headerShown: false }} component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}
