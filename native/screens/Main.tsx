import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Tasks } from './Tasks';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeartCircleCheck } from '@fortawesome/pro-light-svg-icons/faHeartCircleCheck';
import { faHeartCircleCheck as faHeartCircleCheckSolid } from '@fortawesome/pro-solid-svg-icons/faHeartCircleCheck';
import { faCirclePlus } from '@fortawesome/pro-light-svg-icons/faCirclePlus';
import { faCirclePlus as faCirclePlusSolid } from '@fortawesome/pro-solid-svg-icons/faCirclePlus';
import { faMessagesQuestion } from '@fortawesome/pro-light-svg-icons/faMessagesQuestion';
import { faMessagesQuestion as faMessagesQuestionSolid } from '@fortawesome/pro-solid-svg-icons/faMessagesQuestion';
import { faBars } from '@fortawesome/pro-light-svg-icons/faBars';
import { faBars as faBarsSolid } from '@fortawesome/pro-solid-svg-icons/faBars';
import { faBell } from '@fortawesome/pro-light-svg-icons/faBell';
import { faBell as faBellSolid } from '@fortawesome/pro-solid-svg-icons/faBell';
import { VStack, Stack } from 'react-native-flex-layout';
import { Text } from '../components/Text';
import colors, { defaultColor } from '../styles/colors';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

const Tab = createBottomTabNavigator();

export const TabWithIcon = ({
  focused,
  iconDefinition,
  focussedIconDefinition,
  title,
}: {
  focused: boolean;
  iconDefinition: IconDefinition;
  focussedIconDefinition: IconDefinition;
  title: string;
}) => {
  const color = focused ? defaultColor[500] : colors.blackAlpha[500];
  const icon = focused ? focussedIconDefinition : iconDefinition;
  return (
    <VStack spacing={3} center>
      <FontAwesomeIcon icon={icon} size={25} color={color} />
      <Text size="xxs" textAlign="center" color={color}>
        {title}
      </Text>
    </VStack>
  );
};

export const Main = () => {
  return (
    <>
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
              <TabWithIcon
                iconDefinition={faHeartCircleCheck}
                focussedIconDefinition={faHeartCircleCheckSolid}
                title="Tasks"
                focused={focused}
              />
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
              <TabWithIcon
                iconDefinition={faMessagesQuestion}
                focussedIconDefinition={faMessagesQuestionSolid}
                title="Questions"
                focused={focused}
              />
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
              <TabWithIcon
                iconDefinition={faCirclePlus}
                focussedIconDefinition={faCirclePlusSolid}
                title="Create"
                focused={focused}
              />
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
              <TabWithIcon
                iconDefinition={faBell}
                focussedIconDefinition={faBellSolid}
                title="Notifications"
                focused={focused}
              />
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
              <TabWithIcon
                iconDefinition={faBars}
                focussedIconDefinition={faBarsSolid}
                title="Menu"
                focused={focused}
              />
            ),
          }}
          name="Menu>"
          component={Tasks}
        />
      </Tab.Navigator>
    </>
  );
};
