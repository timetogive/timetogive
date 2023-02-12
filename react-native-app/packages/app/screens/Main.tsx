import React from 'react'
import { TouchableOpacity } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Tasks } from './Tasks'
import { Circle, SizableText, Stack, Text, XStack, YStack } from '@my/ui'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHeartCircleCheck } from '@fortawesome/pro-light-svg-icons/faHeartCircleCheck'
import { faCirclePlus } from '@fortawesome/pro-light-svg-icons/faCirclePlus'
import { faMessagesQuestion } from '@fortawesome/pro-light-svg-icons/faMessagesQuestion'
import { faBars } from '@fortawesome/pro-light-svg-icons/faBars'
import { faBell } from '@fortawesome/pro-light-svg-icons/faBell'
import { LocationBar } from 'app/components'

const Tab = createBottomTabNavigator()

export const MainScreen = () => {
  return (
    <>
      <LocationBar />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { paddingTop: 20 },
        }}
      >
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <YStack alignItems="center" space={3}>
                <FontAwesomeIcon
                  icon={faHeartCircleCheck}
                  size={25}
                  color={focused ? 'black' : 'gray'}
                />
                <SizableText size="$2" color={focused ? 'black' : 'gray'}>
                  Tasks
                </SizableText>
              </YStack>
            ),
          }}
          name="Tasks"
          component={Tasks}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <YStack alignItems="center" space={3}>
                <FontAwesomeIcon
                  icon={faMessagesQuestion}
                  size={25}
                  color={focused ? 'black' : 'gray'}
                />
                <SizableText size="$2" color={focused ? 'black' : 'gray'}>
                  Questions
                </SizableText>
              </YStack>
            ),
          }}
          name="Advice"
          component={Tasks}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <TouchableOpacity>
                <Stack
                  shadowColor="black"
                  shadowOffset={{ width: 0, height: 3 }}
                  shadowOpacity={0.6}
                  shadowRadius={2}
                >
                  <Circle
                    borderWidth={4}
                    p={6}
                    backgroundColor="white"
                    alignItems="center"
                    space={3}
                    mt={-30}
                  >
                    <FontAwesomeIcon icon={faCirclePlus} size={50} />
                  </Circle>
                </Stack>
              </TouchableOpacity>
            ),
          }}
          name="Create"
          component={Tasks}
        />

        <Tab.Screen
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <YStack alignItems="center" space={3}>
                <FontAwesomeIcon icon={faBell} size={25} color={focused ? 'black' : 'gray'} />
                <SizableText size="$2" color={focused ? 'black' : 'gray'}>
                  Notifications
                </SizableText>
              </YStack>
            ),
          }}
          name="Notifications"
          component={Tasks}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <YStack alignItems="center" space={3}>
                <FontAwesomeIcon icon={faBars} size={25} color={focused ? 'black' : 'gray'} />
                <SizableText size="$2" color={focused ? 'black' : 'gray'}>
                  Menu
                </SizableText>
              </YStack>
            ),
          }}
          name="Menu>"
          component={Tasks}
        />
      </Tab.Navigator>
    </>
  )
}
