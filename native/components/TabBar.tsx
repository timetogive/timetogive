import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { HStack } from 'react-native-flex-layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotifications } from '../providers/notifications';
import { useSideMenu } from '../providers/sideMenu';
import { TabWithIcon } from './TabWithIcon';
import colors from '../styles/colors';
import { CreateActionMenuBottomSheetModal } from './CreateActionMenu';
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
import { faMagnifyingGlass } from '@fortawesome/sharp-solid-svg-icons';

export const TAB_BAR_CONTENT_HEIGHT = 70;

export const TabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  // Bottom tab navigation
  const insets = useSafeAreaInsets();

  // Side menu navigation
  const { setOpen } = useSideMenu();

  const { routes, index } = state;

  const { count } = useNotifications();

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

  const onMenuPress = () => {
    setOpen(true);
  };

  const onCreateMenuItemPress = (action: string) => {
    setCreateModalOpen(false);
    navigation.navigate('CreateTask', { reason: action });
  };

  return (
    <>
      <HStack
        h={TAB_BAR_CONTENT_HEIGHT}
        mb={insets.bottom}
        ml={insets.left + 10}
        mr={insets.right + 10}
        ph={18}
        bg={colors.white}
        radius={20}
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        justify="between"
        items="center"
        style={{
          shadowColor: colors.gray[700],
          shadowOffset: { width: -4, height: 6 },
          shadowOpacity: 0.7,
          shadowRadius: 10,
          elevation: 2,
        }}
      >
        <TouchableOpacity onPress={() => onNavPress('Tasks')}>
          <TabWithIcon
            iconDefinition={faMagnifyingGlass}
            focussedIconDefinition={faMagnifyingGlass}
            title="Find Tasks"
            focused={routes[index].name === 'Tasks'}
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
            redAlert={count}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onMenuPress()}>
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
