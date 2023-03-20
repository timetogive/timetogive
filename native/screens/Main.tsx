import React, { useCallback, useMemo, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
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
import { VStack, HStack, Box, Stack } from 'react-native-flex-layout';
import { Text } from '../components/Text';
import colors, { defaultColor } from '../styles/colors';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreateActionMenuBottomSheetModal } from '../components/CreateActionMenu';
import { Advice } from './Advice';
import { Notifications } from './Notifications';
import { Menu } from './Menu';
import { useNotifications } from '../providers/notifications';
import { useSideMenu } from '../providers/sideMenu';
import { TabBar } from '../components/TabBar';

export type MainTabParamList = {
  Tasks: undefined;
  Advice: undefined;
  Notifications: undefined;
  Menu: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const Main = () => {
  return (
    <>
      <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          name="Tasks"
          component={Tasks}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          name="Advice"
          component={Advice}
        />

        <Tab.Screen
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          name="Notifications"
          component={Notifications}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          name="Menu"
          component={Menu}
        />
      </Tab.Navigator>
    </>
  );
};
