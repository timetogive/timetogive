import { Input } from '@rneui/base';
import { Button } from '@rneui/themed';
import { useState } from 'react';
import { Alert, StatusBar } from 'react-native';
import { VStack, Stack, Box } from 'react-native-flex-layout';
import { Text, translateFontSize } from '../components/Text';
import { supabase } from '../lib';
import { useSession } from '../providers/session';
import colors, { defaultColor } from '../styles/colors';
import { ScrollWithAvoidKeyboardView } from './ScrollWithAvoidKeyboardView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ButtonPrimary } from './Buttons';

export const MissingName = () => {
  const insets = useSafeAreaInsets();
  const session = useSession();
  const [name, setName] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  const clickSaveAndContinue = async () => {
    if (!name) {
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: name,
      })
      .eq('id', session.user?.id);

    if (error) {
      Alert.alert('Error', error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    // Refetch the user session
    session.refetch();
  };

  return (
    <>
      <StatusBar animated={true} barStyle={'dark-content'} />
      <ScrollWithAvoidKeyboardView>
        <Box
          style={{ flex: 1 }}
          bg={colors.white}
          pt={insets.top + 60}
        >
          <VStack spacing={10}>
            <VStack items="center" spacing={20} ph={20}>
              <Box>
                <Text size="xl" weight="bold">
                  Provide your full name
                </Text>
              </Box>
              <Box w="100%">
                <Input
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Christine Doe"
                  inputStyle={{
                    fontSize: translateFontSize('sm'),
                    lineHeight: 25,
                    paddingBottom: 10,
                  }}
                  containerStyle={{
                    paddingHorizontal: 0,
                  }}
                  errorStyle={{ margin: 0, padding: 0 }}
                />
              </Box>
              <Text size="xs" color={defaultColor[400]}>
                TimeToGive is a volunteering platform for carrying out
                small meaningful tasks in your local community. We
                take safety seriously. It's important to use your real
                name in your profile so other members of the community
                know who you are.
              </Text>
            </VStack>
            <VStack style={{ flex: 1 }} spacing={20} ph={20}>
              <ButtonPrimary
                onPress={() => clickSaveAndContinue()}
                fullWidth
              >
                Save and continue
              </ButtonPrimary>
            </VStack>
          </VStack>
        </Box>
      </ScrollWithAvoidKeyboardView>
    </>
  );
};
