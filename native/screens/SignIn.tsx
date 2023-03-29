import React, { useEffect, useState } from 'react';
import { SafeWrapper } from '../components/SafeWrapper';
import { Alert, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { Image, Input, Button, Text } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { VStack, Stack } from 'react-native-flex-layout';
import {
  makeRedirectUri,
  startAsync,
  useAuthRequest,
} from 'expo-auth-session';
import { supabaseUrl } from '../lib/consts';

export type SignInScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SignIn'
>;

// This builds the URL for the signin page based on the
// expo URL scheme specified in the config. Ensures it works
// in local dev and in production.
const redirectUrl = makeRedirectUri({
  path: 'signin',
});

export const SignIn = ({ navigation }: SignInScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signInWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    }
    console.log('signInWithEmail');
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    // This will create a redirectUri

    // This builds the URL for the signin page based on the
    // expo URL scheme specified in the config. Ensures it works
    // in local dev and in production.
    const redirectUrl = makeRedirectUri({
      path: 'signin',
    });

    console.log('signInWithGoogle 1', redirectUrl);

    // authUrl: https://{YOUR_PROJECT_REFERENCE_ID}.supabase.co
    // returnURL: the redirectUrl you created above.
    const authResponse = await startAsync({
      authUrl: `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectUrl}`,
      returnUrl: redirectUrl,
      projectNameForProxy: '@hoochani/timetogive',
    });

    console.log('signInWithGoogle 3');

    // If the user successfully signs in
    // we will have access to an accessToken and an refreshToken
    // and then we'll use setSession (https://supabase.com/docs/reference/javascript/auth-setsession)
    // to create a Supabase-session using these token
    if (authResponse.type === 'success') {
      supabase.auth.setSession({
        access_token: authResponse.params.access_token,
        refresh_token: authResponse.params.refresh_token,
      });
    }
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
        <Button disabled={loading} onPress={() => signInWithGoogle()}>
          Sign in with Google
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
