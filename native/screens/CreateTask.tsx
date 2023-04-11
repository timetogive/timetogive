import {
  faChevronLeft,
  faChevronRight,
  faInfoCircle,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input } from '@rneui/themed';
import { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Box, Stack, VStack, HStack } from 'react-native-flex-layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../App';
import { DaysHoursMinutesSheetModal } from '../components/DaysHoursMinutes';
import { SafeWrapper } from '../components/SafeWrapper';
import { Text, translateFontSize } from '../components/Text';
import { effortText, reasonToTitle } from '../lib/tasksHelpers';
import colors, { defaultColor } from '../styles/colors';
import pluralize from 'pluralize';
import { IntegerPickerSheetModal } from '../components/IntegerPicker';
import { SetPointSheetModal } from '../components/SetPoint';
import { MapWithSingleTask } from '../components/MapWithSingleTask';
import { ScrollView } from 'react-native-gesture-handler';
import { Switch } from '@rneui/themed';
import axios from 'axios';
import { supabase } from '../lib';
import {
  BackBar,
  BACK_BAR_CONTENT_HEIGHT,
} from '../components/BackBar';
import { Point } from 'geojson';
import { ScrollWithAvoidKeyboardView } from '../components/ScrollWithAvoidKeyboardView';
import { ButtonPrimary } from '../components/Buttons';

const integerText = (value: number, word: string) => {
  const text = `${value} ${pluralize(word, value)}`;
  return text;
};

const InfoTip = ({ text }: { text: string }) => {
  return (
    <Text size="xxs" color={defaultColor[300]}>
      {text}
    </Text>
  );
};

type Props = NativeStackScreenProps<RootStackParamList, 'CreateTask'>;

export const CreateTask = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { reason } = route.params;

  // State variables for the form
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(
    undefined
  );
  const [dhmModalOpen, setDhmModalOpen] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const [volunteers, setVolunteers] = useState(1);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [location, setLocation] = useState<Point | undefined>(
    undefined
  );
  const [remote, setRemote] = useState(false);
  const [lifespanDaysModalOpen, setLifespanDaysModalOpen] =
    useState(false);
  const [lifespanDays, setLifespanDays] = useState(30);
  const [timing, setTiming] = useState<string | undefined>(undefined);

  // State variables for submission
  const [saving, setSaving] = useState(false);

  // Generated text
  const screenTitle = `Create ${reasonToTitle(reason).toLowerCase()}`;
  const effText = effortText(days, hours, minutes);
  const volText = integerText(volunteers, 'volunteer');
  const lifespanText = integerText(lifespanDays, 'day');

  const clickSubmit = async () => {
    if (!title || !description || !timing || !location) {
      Alert.alert('Missing fields', 'Please fill in all fields');
      return;
    }
    setSaving(true);
    const payload = {
      reason,
      will_pledge: false,
      title,
      description,
      effort_days: days,
      effort_hours: hours,
      effort_minutes: minutes,
      effort_people: volunteers,
      timing,
      remote,
      longitude: location?.coordinates[0],
      latitude: location?.coordinates[1],
      lifespan_days: lifespanDays,
    };
    const { data, error } = await supabase.rpc(
      'create_task',
      payload
    );

    if (error) {
      Alert.alert('Error', error.message);
      setSaving(false);
      return;
    }

    setSaving(false);

    navigation.goBack();
    return;
  };

  return (
    <>
      {/* Top box with back button */}
      <BackBar onBackPress={() => navigation.goBack()} />
      {/* Create task form */}
      <ScrollWithAvoidKeyboardView>
        <Box
          ph={15}
          pt={BACK_BAR_CONTENT_HEIGHT + insets.top}
          pb={insets.bottom + 20}
          bg={colors.white}
        >
          <Box pv={20}>
            <Text size="xl" weight="bold">
              {screenTitle}
            </Text>
          </Box>

          {/* Title */}
          <VStack spacing={30}>
            <VStack>
              <Text size="xs" weight="semi-bold">
                Title
              </Text>
              <Input
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Sorting clothes in our high street shop"
                inputStyle={{
                  fontSize: translateFontSize('sm'),
                }}
                containerStyle={{
                  paddingHorizontal: 0,
                }}
                errorStyle={{ margin: 0, padding: 0 }}
              />
              <InfoTip text="Keep it short and sweet" />
            </VStack>

            {/* Description */}
            <VStack>
              <Text size="xs" weight="semi-bold">
                Description
              </Text>
              <Input
                value={description}
                onChangeText={setDescription}
                placeholder="e.g. Willing and able volunteers to help with a backlog of clothing that needs sorting through"
                inputStyle={{
                  fontSize: translateFontSize('sm'),
                  lineHeight: 25,
                  paddingBottom: 10,
                }}
                containerStyle={{
                  paddingHorizontal: 0,
                }}
                errorStyle={{ margin: 0, padding: 0 }}
                multiline
              />
              <InfoTip text="Add as much information as you can, the more the better." />
            </VStack>

            {/* Timing */}
            <VStack>
              <Text size="xs" weight="semi-bold">
                Timing
              </Text>
              <Input
                value={timing}
                onChangeText={setTiming}
                placeholder="e.g. any time, or any time after 10am on the weekends"
                inputStyle={{
                  fontSize: translateFontSize('sm'),
                  lineHeight: 25,
                  paddingBottom: 10,
                }}
                containerStyle={{
                  paddingHorizontal: 0,
                }}
                errorStyle={{ margin: 0, padding: 0 }}
                multiline
              />
              <InfoTip text="Provide any information on when the task can be completed" />
            </VStack>

            {/* Effort */}
            <VStack spacing={10} shouldWrapChildren>
              <Text size="xs" weight="semi-bold">
                How long will it take?
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
              <InfoTip text="This can be approximate but be realistic" />
            </VStack>

            {/* People */}
            <VStack spacing={10} shouldWrapChildren>
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
              <InfoTip text="Less volunteers = more interest" />
            </VStack>

            {/* Remote */}
            <VStack spacing={10} shouldWrapChildren>
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
              <InfoTip text="Remote tasks widen the net for volunteers. So if it's not a physical task, think about whether or not it could be done remotely." />
            </VStack>

            {/* Location */}
            <VStack spacing={10} shouldWrapChildren>
              <Text size="xs" weight="semi-bold">
                Location
              </Text>
              <TouchableOpacity
                onPress={() => setLocationModalOpen(true)}
              >
                {location ? (
                  <Stack minH={240} pointerEvents="none">
                    <MapWithSingleTask
                      point={location}
                      reason={reason}
                      interactive={false}
                    />
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
              <InfoTip text="For safety we never reveal the exact location in the listing. We still require the location for remote tasks because members still like to know where and who the task will help." />
            </VStack>

            {/* Lifespan */}
            <VStack spacing={10} shouldWrapChildren>
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
              <InfoTip text="Tasks automatically close after this period of time if they don't attract any volunteers. You can also close a task any time you like." />
            </VStack>

            {/* Submit */}
            <ButtonPrimary
              onPress={() => clickSubmit()}
              loading={saving}
            >
              Create task
            </ButtonPrimary>
          </VStack>
        </Box>
      </ScrollWithAvoidKeyboardView>

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
      <SetPointSheetModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        point={location}
        onPointChange={setLocation}
      />
    </>
  );
};
