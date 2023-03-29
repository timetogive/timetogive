import React, { useState } from 'react';
import { SafeWrapper } from '../components/SafeWrapper';
import { Alert, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { Image, Input, Button, Text } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { VStack, Stack } from 'react-native-flex-layout';
import { nanoid } from 'nanoid/non-secure';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

type Mode = 'form' | 'verify';

export const SignUp = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>('form');

  const signUpWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
    setMode('verify');
  };

  const confirmCode = async () => {
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: verificationCode,
      type: 'signup',
    });

    if (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  };

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
      </VStack>

      {mode === 'form' && (
        <VStack ph={5} spacing={10}>
          <Input
            placeholder="Email address"
            onChangeText={(text) => setEmail(text)}
          />
          <Input
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />

          <Button
            disabled={loading}
            onPress={() => signUpWithEmail()}
          >
            Sign up
          </Button>
          <Stack>
            <Text style={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Text
                style={{ color: 'blue' }}
                onPress={() => navigation.navigate('SignIn')}
              >
                Sign in here.
              </Text>
            </Text>
          </Stack>
        </VStack>
      )}

      {mode === 'verify' && (
        <VStack ph={5} spacing={10}>
          <Input
            placeholder="Enter verification code"
            onChangeText={(text) => setVerificationCode(text)}
          />
          <Button disabled={loading} onPress={() => confirmCode()}>
            Submit Code
          </Button>
          <Text style={{ textAlign: 'center' }}>
            You should have received an email with a verification
            code. In can take a few seconds for it to arrive.
          </Text>
          <Text
            style={{ color: 'blue', textAlign: 'center' }}
            onPress={() => signUpWithEmail()}
          >
            Resend email
          </Text>
        </VStack>
      )}
    </SafeWrapper>
  );
};
