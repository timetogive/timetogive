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
import { VStack, HStack, Box } from 'react-native-flex-layout';
import { Text } from '../components/Text';
import colors, { defaultColor } from '../styles/colors';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import {
  CreateActionMenu,
  CreateActionMenuBottomSheetModal,
} from '../components/CreateActionMenu';

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
    <VStack spacing={3} center w={70}>
      <FontAwesomeIcon icon={icon} size={25} color={color} />
      <Text size="xxs" textAlign="center" color={color}>
        {title}
      </Text>
    </VStack>
  );
};

const TabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  // Bottom tab navigation
  const insets = useSafeAreaInsets();
  const { routes, index } = state;

  const [createModalOpen, setCreateModalOpen] = React.useState(false);

  // Clicking on tabs
  const onNavPress = (route: string) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route,
      canPreventDefault: true,
    });

    if (routes[index].name !== route && !event.defaultPrevented) {
      navigation.navigate(route);
    }
  };

  const onCreatePress = () => {
    setCreateModalOpen(true);
  };

  const onCreateMenuItemPress = (action: string) => {
    setCreateModalOpen(false);
    console.log(`action ${action}`);
    navigation.navigate('CreateTask', { reason: action });
  };

  return (
    <>
      <HStack
        pb={insets.bottom + 5}
        pl={insets.left + 10}
        pr={insets.right + 10}
        style={{ width: '100%' }}
        pt={10}
        bg={colors.white}
        justify="between"
      >
        <TouchableOpacity onPress={() => onNavPress('Tasks')}>
          <TabWithIcon
            iconDefinition={faHeartCircleCheck}
            focussedIconDefinition={faHeartCircleCheckSolid}
            title="Tasks"
            focused={routes[index].name === 'Tasks'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onNavPress('Advice')}>
          <TabWithIcon
            iconDefinition={faMessagesQuestion}
            focussedIconDefinition={faMessagesQuestionSolid}
            title="Advice"
            focused={routes[index].name === 'Advice'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onCreatePress()}>
          <TabWithIcon
            iconDefinition={faCirclePlus}
            focussedIconDefinition={faCirclePlusSolid}
            title="Create"
            focused={routes[index].name === 'Create'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onNavPress('Notifications')}>
          <TabWithIcon
            iconDefinition={faBell}
            focussedIconDefinition={faBellSolid}
            title="Notifications"
            focused={routes[index].name === 'Notifications'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onNavPress('Menu')}>
          <TabWithIcon
            iconDefinition={faBars}
            focussedIconDefinition={faBarsSolid}
            title="Menu"
            focused={routes[index].name === 'Menu'}
          />
        </TouchableOpacity>
      </HStack>
      <CreateActionMenuBottomSheetModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onMenuItemPress={onCreateMenuItemPress}
      />
    </>
  );
};

export const Main = () => {
  return (
    <>
      <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
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
          name="Menu"
          component={Tasks}
        />
      </Tab.Navigator>
    </>
  );
};
