import { Input } from '@rneui/base';
import { Button } from '@rneui/themed';
import { useState } from 'react';
import { Alert } from 'react-native';
import { VStack, Stack, Box } from 'react-native-flex-layout';
import { Text, translateFontSize } from '../components/Text';
import { supabase } from '../lib';
import { useSession } from '../providers/session';
import colors, { defaultColor } from '../styles/colors';

export const MissingBio = () => {
  const session = useSession();
  const [description, setDescription] = useState<string | undefined>(
    undefined
  );
  const [saving, setSaving] = useState(false);

  const clickSaveAndContinue = async () => {
    if (!description) {
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        description,
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
    <VStack justify="center" style={{ flex: 1 }} bg={colors.white}>
      <VStack items="center" spacing={20} ph={20}>
        <Box>
          <Text size="xl" weight="bold">
            Your bio
          </Text>
        </Box>
        <Box w="100%">
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder="e.g. I live in Asheridge, have 3 kids, and a badly behaved dog. I'm really keen to help locally and I'm good with computers."
            multiline
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
        <Box>
          <Text size="xs" color={defaultColor[400]}>
            Your bio helps people to get to know you. You don't have
            to write very much but a little background helps with the
            trust factor and is more likely to get you a response.
          </Text>
        </Box>
        <Button
          onPress={() => clickSaveAndContinue()}
          color={defaultColor[500]}
          loading={saving}
        >
          Save and continue
        </Button>
      </VStack>
    </VStack>
  );
};
