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
import { SearchLocationProvider } from './providers/searchLocation';
import { SignedIn } from './components/SignedIn';
import { SignedOut } from './components/SignedOut';
import { SignIn } from './screens/SignIn';
import { SignUp } from './screens/SignUp';
import { Main } from './screens/Main';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashPreLoadProvider from './providers/splashPreLoad';
import { ProfileIsComplete } from './components/ProfileIsComplete';
import { ProfileNotComplete } from './components/ProfileNotComplete';
import { MissingAvatar } from './screens/MissingAvatar';
import { CreateTask } from './screens/CreateTask';
import { TaskReason } from './types';
import { TaskConversation } from './screens/TaskConversation';
import { MissingProfile } from './screens/MissingProfile';
import { Task } from './screens/Task';
import { queryClient } from './lib/queryClient';
import { CurrentLocationProvider } from './providers/currentLocation';

export type RootStackParamList = {
  Main: undefined;
  SignIn: undefined;
  SignUp: undefined;
  MissingProfile: undefined;
  CreateTask: { reason: TaskReason };
  TaskConversation: { taskId: string; userId: string };
  Task: { taskId: string };
};

const NavStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SplashPreLoadProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <SafeAreaProvider>
            <SessionProvider>
              <NavigationContainer>
                <SignedIn>
                  {/* location providers are only needed once signed in */}
                  <CurrentLocationProvider>
                    <SearchLocationProvider>
                      <ProfileIsComplete>
                        <NavStack.Navigator>
                          <NavStack.Screen
                            name="Main"
                            component={Main}
                            options={{
                              title: 'Main',
                              headerShown: false,
                            }}
                          />
                          <NavStack.Screen
                            name="Task"
                            options={{
                              title: 'Task',
                              headerShown: false,
                            }}
                            component={Task}
                          />
                          <NavStack.Screen
                            name="CreateTask"
                            options={{
                              title: 'CreateTask',
                              headerShown: false,
                            }}
                            component={CreateTask}
                          />
                          <NavStack.Screen
                            name="TaskConversation"
                            options={{
                              title: 'TaskConversation',
                              headerShown: false,
                            }}
                            component={TaskConversation}
                          />
                        </NavStack.Navigator>
                      </ProfileIsComplete>
                      <ProfileNotComplete>
                        <NavStack.Navigator>
                          <NavStack.Screen
                            name="MissingProfile"
                            component={MissingProfile}
                            options={{
                              title: 'MissingProfile',
                              headerShown: false,
                            }}
                          />
                        </NavStack.Navigator>
                      </ProfileNotComplete>
                    </SearchLocationProvider>
                  </CurrentLocationProvider>
                </SignedIn>
                <SignedOut>
                  <NavStack.Navigator>
                    <NavStack.Screen
                      name="SignIn"
                      options={{ headerShown: false }}
                      component={SignIn}
                    />
                    <NavStack.Screen
                      name="SignUp"
                      options={{ headerShown: false }}
                      component={SignUp}
                    />
                  </NavStack.Navigator>
                </SignedOut>
              </NavigationContainer>
            </SessionProvider>
          </SafeAreaProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SplashPreLoadProvider>
  );
}
