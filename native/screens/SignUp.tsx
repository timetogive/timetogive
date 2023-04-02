import React, { useState } from 'react';
import { SafeWrapper } from '../components/SafeWrapper';
import {
  Alert,
  Pressable,
  Touchable,
  View,
  TextInput,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Image, Input, Button } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { VStack, Stack, Box } from 'react-native-flex-layout';
import { nanoid } from 'nanoid/non-secure';
import { Text } from '../components/Text';
import { ButtonPrimary } from '../components/ButtonPrimary';
import colors, { defaultColor } from '../styles/colors';
import * as Linking from 'expo-linking';
import { Link } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faGoogle,
  faGoogleDrive,
} from '@fortawesome/free-brands-svg-icons';
import { faStar } from '@fortawesome/sharp-solid-svg-icons';

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

    if (!email || !password) {
      Alert.alert('Please enter an email address and password');
      setLoading(false);
      return;
    }

    // First check and see if the account already exists
    const { data: dataAccountCheck } = await supabase.rpc(
      'account_check',
      {
        p_email_address: email.toLowerCase(),
      }
    );

    if (dataAccountCheck) {
      Alert.alert(
        'Account already exists',
        'Please sign in to your account.'
      );
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
    });

    console.log(data);

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
    <Box style={{ flex: 1 }} bg={defaultColor[900]}>
      <SafeWrapper>
        <VStack ph={20} spacing={10}>
          <Stack
            style={{
              height: 200,
            }}
          >
            <Image
              source={require('../assets/ttg-white.png')}
              resizeMode="contain"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </Stack>
        </VStack>

        {mode === 'form' && (
          <VStack ph={20} spacing={20} shouldWrapChildren>
            <VStack spacing={15} shouldWrapChildren>
              <TextInput
                placeholder="Email address"
                onChangeText={(text) => setEmail(text)}
                placeholderTextColor={colors.whiteAlpha[500]}
                style={{
                  padding: 15,
                  borderRadius: 5,
                  backgroundColor: colors.whiteAlpha[100],
                  color: colors.whiteAlpha[900],
                  fontSize: 16,
                }}
              />
              <TextInput
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
                placeholderTextColor={colors.whiteAlpha[500]}
                style={{
                  padding: 15,
                  borderRadius: 5,
                  backgroundColor: colors.whiteAlpha[100],
                  color: colors.whiteAlpha[900],
                  fontSize: 16,
                }}
              />
            </VStack>
            <VStack spacing={5} shouldWrapChildren>
              <Text size="sm" textAlign="center" color="white">
                By signing up, you agree to our{' '}
              </Text>
              <Text size="sm" textAlign="center" color="white">
                <Text
                  decoration="underline"
                  size="sm"
                  onPress={() =>
                    Linking.openURL(
                      'https://timetogiveapp.com/terms.html'
                    )
                  }
                >
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text
                  decoration="underline"
                  size="sm"
                  onPress={() =>
                    Linking.openURL(
                      'https://timetogiveapp.com/privacy.html'
                    )
                  }
                >
                  Privacy Policy
                </Text>
              </Text>
            </VStack>

            <ButtonPrimary
              disabled={loading}
              onPress={() => signUpWithEmail()}
            >
              Sign up with email
            </ButtonPrimary>

            <ButtonPrimary
              disabled={loading}
              onPress={() => signUpWithEmail()}
              leftIcon={
                <FontAwesomeIcon
                  icon={faGoogle as any}
                  color={colors.white}
                  size={20}
                />
              }
            >
              Sign up with Google
            </ButtonPrimary>

            <VStack spacing={5} shouldWrapChildren>
              <Text size="sm" textAlign="center" color="white">
                Already have an account?{' '}
              </Text>
              <Text
                decoration="underline"
                size="sm"
                textAlign="center"
                color="white"
                onPress={() => navigation.navigate('SignIn')}
              >
                Sign in here
              </Text>{' '}
            </VStack>
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
    </Box>
  );
};
