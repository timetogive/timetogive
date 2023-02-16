import 'react-native-url-polyfill/auto';

import { Button, ThemeProvider } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import * as Linking from 'expo-linking';
import { NavigationContainer } from '@react-navigation/native';
import { useMemo } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider } from './providers/session';
import { SelectedLocationProvider } from './providers/selectedLocation';
import { SignedIn, SignedOut } from './components';
import { SignIn, SignUp, Main } from './screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export type RootStackParamList = {
  Main: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SafeAreaProvider>
          <SelectedLocationProvider>
            <SessionProvider>
              <NavigationContainer>
                <SignedIn>
                  <Stack.Navigator>
                    <Stack.Screen
                      name="Main"
                      component={Main}
                      options={{
                        title: 'Main',
                        headerShown: false,
                      }}
                    />
                  </Stack.Navigator>
                </SignedIn>
                <SignedOut>
                  <Stack.Navigator>
                    <Stack.Screen
                      name="SignIn"
                      options={{ headerShown: false }}
                      component={SignIn}
                    />
                    <Stack.Screen
                      name="SignUp"
                      options={{ headerShown: false }}
                      component={SignUp}
                    />
                  </Stack.Navigator>
                </SignedOut>
              </NavigationContainer>
            </SessionProvider>
          </SelectedLocationProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
