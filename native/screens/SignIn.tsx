import React, { useState } from 'react';
import { SafeWrapper } from '../components/SafeWrapper';
import { Alert, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { Image, Input, Button, Text } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { VStack, Stack } from 'react-native-flex-layout';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

export const SignIn = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  }

  return (
    <SafeWrapper>
      <VStack ph={5} spacing={10}>
        <Stack
          style={{
            height: 200,
          }}
        >
          <Image
            source={require('../assets/ttg.png')}
            resizeMode="contain"
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </Stack>

        <Input
          placeholder="Email address"
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        <Button disabled={loading} onPress={() => signInWithEmail()}>
          Sign in
        </Button>
        <Stack>
          <Text style={{ textAlign: 'center' }}>
            Don&apos;t have account?{' '}
            <Text
              style={{ color: 'blue' }}
              onPress={() => navigation.navigate('SignUp')}
            >
              Sign up here.
            </Text>
          </Text>
        </Stack>
      </VStack>
    </SafeWrapper>
  );
};
