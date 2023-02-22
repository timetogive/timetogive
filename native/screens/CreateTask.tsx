import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input } from '@rneui/themed';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Box, Stack, VStack, HStack } from 'react-native-flex-layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../App';
import { DaysHoursMinutesSheetModal } from '../components/DaysHoursMinutes';
import { SafeWrapper } from '../components/SafeWrapper';
import { Text, translateFontSize } from '../components/Text';
import { reasonToTitle } from '../lib/tasksHelpers';
import colors, { defaultColor } from '../styles/colors';
import pluralize from 'pluralize';
import { min } from 'react-native-reanimated';
import { IntegerPickerSheetModal } from '../components/IntegerPicker';
import { SetLocationSheetModal } from '../components/SetLocation';
import { LongLat } from '../providers/selectedLocation';
import { StaticMapWithMarker } from '../components/StaticMapWithMarker';
import { ScrollView } from 'react-native-gesture-handler';
import { Switch } from '@rneui/themed';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateTask'>;

const effortText = (days: number, hours: number, minutes: number) => {
  const daysText =
    days === 0 ? [] : [`${days} ${pluralize('day', days)}`];
  const hoursText =
    hours === 0 ? [] : [`${hours} ${pluralize('hour', hours)}`];
  const minutesText =
    minutes === 0
      ? []
      : [`${minutes} ${pluralize('minute', minutes)}`];
  console.log({ daysText, hoursText, minutesText });
  const final = [...daysText, ...hoursText, ...minutesText].join(' ');
  return final;
};

const integerText = (value: number, word: string) => {
  const text = `${value} ${pluralize(word, value)}`;
  return text;
};

export const CreateTask = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { reason } = route.params;
  const [dhmModalOpen, setDhmModalOpen] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const [volunteers, setVolunteers] = useState(1);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [location, setLocation] = useState<LongLat | undefined>(
    undefined
  );
  const [remote, setRemote] = useState(false);
  const [lifespanDaysModalOpen, setLifespanDaysModalOpen] =
    useState(false);
  const [lifespanDays, setLifespanDays] = useState(30);

  const title = `Create ${reasonToTitle(reason).toLowerCase()}`;

  const effText = effortText(days, hours, minutes);

  const volText = integerText(volunteers, 'volunteer');

  const lifespanText = integerText(lifespanDays, 'day');

  return (
    <>
      <Box
        pv={4}
        bg={defaultColor[500]}
        pt={insets.top + 5}
        pb={15}
        ph={20}
      >
        <HStack spacing={10} items="center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              color={colors.white}
              size={25}
            />
          </TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView>
        <VStack ph={15} pb={insets.bottom + 15}>
          {/* Title */}
          <Box pv={20}>
            <Text size="xl" weight="bold">
              {title}
            </Text>
          </Box>
          <VStack>
            <Text size="xs" weight="semi-bold">
              Title
            </Text>
            <Input
              placeholder="e.g. Sorting clothes in our high street shop"
              inputStyle={{
                fontSize: translateFontSize('sm'),
              }}
              containerStyle={{
                paddingHorizontal: 0,
              }}
              inputContainerStyle={{
                borderBottomWidth: 0,
              }}
            />
          </VStack>

          {/* Description */}
          <VStack>
            <Text size="xs" weight="semi-bold">
              Description
            </Text>
            <Input
              placeholder="e.g. Willing and able volunteers to help with a backlog of clothing that needs sorting through"
              inputStyle={{
                fontSize: translateFontSize('sm'),
                lineHeight: 25,
              }}
              containerStyle={{
                paddingHorizontal: 0,
              }}
              inputContainerStyle={{
                borderBottomWidth: 0,
              }}
              multiline
            />
          </VStack>

          {/* Effort */}
          <VStack spacing={10} shouldWrapChildren>
            <Text size="xs" weight="semi-bold">
              How long will it take? (approximately)
            </Text>
            <TouchableOpacity onPress={() => setDhmModalOpen(true)}>
              <HStack
                justify="between"
                shouldWrapChildren
                items="center"
              >
                <Text size="md">{effText}</Text>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  size={15}
                  color={colors.gray[500]}
                />
              </HStack>
            </TouchableOpacity>
          </VStack>

          {/* People */}
          <VStack spacing={10} shouldWrapChildren pt={35}>
            <Text size="xs" weight="semi-bold">
              How many volunteers do you need?
            </Text>
            <TouchableOpacity
              onPress={() => setVolunteerModalOpen(true)}
            >
              <HStack
                justify="between"
                shouldWrapChildren
                items="center"
              >
                <Text size="md">{volText}</Text>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  size={15}
                  color={colors.gray[500]}
                />
              </HStack>
            </TouchableOpacity>
          </VStack>

          {/* Remote */}
          <VStack spacing={10} shouldWrapChildren pt={35}>
            <Text size="xs" weight="semi-bold">
              Can this task be done remotely?
            </Text>
            <HStack
              justify="between"
              shouldWrapChildren
              items="center"
            >
              <Text size="md">{remote ? 'Yes' : 'No'}</Text>
              <Switch value={remote} onValueChange={setRemote} />
            </HStack>
          </VStack>

          {/* Location */}
          <VStack spacing={10} shouldWrapChildren pt={35}>
            <Text size="xs" weight="semi-bold">
              Location
            </Text>
            <TouchableOpacity
              onPress={() => setLocationModalOpen(true)}
            >
              {location ? (
                <Stack minH={240} pointerEvents="box-only">
                  <StaticMapWithMarker longLat={location} />
                </Stack>
              ) : (
                <HStack
                  justify="between"
                  shouldWrapChildren
                  items="center"
                >
                  <Text size="md" color={colors.gray[500]}>
                    Set location
                  </Text>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    size={15}
                    color={colors.gray[500]}
                  />
                </HStack>
              )}
            </TouchableOpacity>
          </VStack>

          {/* Lifespan */}
          <VStack spacing={10} shouldWrapChildren pt={35}>
            <Text size="xs" weight="semi-bold">
              Automatically close this task
            </Text>
            <TouchableOpacity
              onPress={() => setLifespanDaysModalOpen(true)}
            >
              <HStack
                justify="between"
                shouldWrapChildren
                items="center"
              >
                <Text size="md">after {lifespanText}</Text>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  size={15}
                  color={colors.gray[500]}
                />
              </HStack>
            </TouchableOpacity>
          </VStack>
        </VStack>
      </ScrollView>

      <DaysHoursMinutesSheetModal
        isOpen={dhmModalOpen}
        onClose={() => setDhmModalOpen(false)}
        days={days}
        hours={hours}
        minutes={minutes}
        onDaysChange={setDays}
        onHoursChange={setHours}
        onMinutesChange={setMinutes}
      />
      <IntegerPickerSheetModal
        isOpen={volunteerModalOpen}
        onClose={() => setVolunteerModalOpen(false)}
        value={volunteers}
        onChange={setVolunteers}
        label="volunteer"
        min={1}
        max={50}
      />
      <IntegerPickerSheetModal
        isOpen={lifespanDaysModalOpen}
        onClose={() => setLifespanDaysModalOpen(false)}
        value={lifespanDays}
        onChange={setLifespanDays}
        label="day"
        min={1}
        max={30}
      />
      <SetLocationSheetModal
        isOpen={locationModalOpen}
        longLat={location}
        onClose={() => setLocationModalOpen(false)}
        onLongLatChange={setLocation}
      />
    </>
  );
};
