import { Input } from '@rneui/base';
import { Button } from '@rneui/themed';
import { useState } from 'react';
import { Alert } from 'react-native';
import { VStack, Stack, Box } from 'react-native-flex-layout';
import { Text, translateFontSize } from '../components/Text';
import { supabase } from '../lib';
import { useSession } from '../providers/session';
import colors, { defaultColor } from '../styles/colors';

export const MissingName = () => {
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
    <VStack justify="center" style={{ flex: 1 }} bg={colors.white}>
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
        <Box>
          <Text size="xs" color={defaultColor[400]}>
            TimeToGive is a volunteering platform. This ultimately
            means making real life connections. We take safety
            seriously. It's important to use your real name in your
            profile so other members of the community know who you
            are.
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
