import React, { useState } from 'react';
import { SafeWrapper } from '../components/SafeWrapper';
import {
  Alert,
  Pressable,
  Touchable,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Image, Input, Button } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { VStack, Stack, Box } from 'react-native-flex-layout';
import { nanoid } from 'nanoid/non-secure';
import { Text } from '../components/Text';
import {
  ButtonPrimary,
  ButtonSecondary,
} from '../components/Buttons';
import colors, { defaultColor } from '../styles/colors';
import * as Linking from 'expo-linking';
import { Link } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faApple,
  faGoogle,
  faGoogleDrive,
} from '@fortawesome/free-brands-svg-icons';
import { faStar } from '@fortawesome/sharp-solid-svg-icons';
import { makeRedirectUri, startAsync } from 'expo-auth-session';
import { supabaseUrl } from '../lib/consts';
import { ScrollWithAvoidKeyboardView } from '../components/ScrollWithAvoidKeyboardView';
import { signInWithGoogle, signInWithApple } from '../lib/auth';

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
      return;
    }
    setLoading(false);
    setMode('verify');
  };

  const confirmCode = async () => {
    setLoading(true);

    if (!verificationCode || verificationCode.length < 6) {
      Alert.alert('Please enter a valid verification code');
      setLoading(false);
      return;
    }

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
      <ScrollWithAvoidKeyboardView>
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
              <ButtonPrimary
                disabled={loading}
                onPress={() => signUpWithEmail()}
              >
                Sign up with email
              </ButtonPrimary>

              <ButtonSecondary
                disabled={loading}
                onPress={() => signInWithApple()}
                leftIcon={
                  <FontAwesomeIcon
                    icon={faApple as any}
                    color={colors.white}
                    size={25}
                  />
                }
              >
                Sign up with Apple
              </ButtonSecondary>

              <ButtonSecondary
                disabled={loading}
                onPress={() => signInWithGoogle()}
                leftIcon={
                  <FontAwesomeIcon
                    icon={faGoogle as any}
                    color={colors.white}
                    size={20}
                  />
                }
              >
                Sign up with Google
              </ButtonSecondary>

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
              <VStack spacing={5} shouldWrapChildren>
                <Text
                  size="xs"
                  textAlign="center"
                  color={colors.whiteAlpha[700]}
                >
                  By signing up to an account you are agreeing to our
                </Text>
                <Text
                  size="xs"
                  textAlign="center"
                  color={colors.whiteAlpha[700]}
                >
                  <Text
                    decoration="underline"
                    size="xs"
                    onPress={() =>
                      Linking.openURL(
                        'https://timetogiveapp.com/terms'
                      )
                    }
                  >
                    Terms of Service
                  </Text>{' '}
                  and{' '}
                  <Text
                    decoration="underline"
                    size="xs"
                    onPress={() =>
                      Linking.openURL(
                        'https://timetogiveapp.com/privacy'
                      )
                    }
                  >
                    Privacy Policy
                  </Text>
                </Text>
              </VStack>
            </VStack>
          )}

          {mode === 'verify' && (
            <VStack ph={20} spacing={20} shouldWrapChildren>
              <TextInput
                placeholder="Enter verification code"
                onChangeText={(text) => setVerificationCode(text)}
                placeholderTextColor={colors.whiteAlpha[500]}
                style={{
                  padding: 15,
                  borderRadius: 5,
                  backgroundColor: colors.whiteAlpha[100],
                  color: colors.whiteAlpha[900],
                  fontSize: 16,
                }}
              />
              <ButtonPrimary
                disabled={loading}
                onPress={() => confirmCode()}
              >
                Submit code
              </ButtonPrimary>
              <VStack spacing={5} shouldWrapChildren>
                <Text size="sm" textAlign="center" color="white">
                  You should have received an email with a
                  verification code. It can take a few seconds for it
                  to arrive.
                </Text>
                <Text
                  decoration="underline"
                  size="sm"
                  textAlign="center"
                  color="white"
                  onPress={() => signUpWithEmail()}
                >
                  Resend email verification
                </Text>{' '}
                <Text
                  decoration="underline"
                  size="sm"
                  textAlign="center"
                  color="white"
                  onPress={() => setMode('form')}
                >
                  Go back
                </Text>{' '}
              </VStack>
            </VStack>
          )}
        </SafeWrapper>
      </ScrollWithAvoidKeyboardView>
    </Box>
  );
};
