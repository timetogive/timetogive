import React, { useEffect, useState } from 'react';
import { SafeWrapper } from '../components/SafeWrapper';
import { Text } from '../components/Text';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  TextInput,
  Platform,
  View,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Image, Input, Button } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { VStack, Stack, Box } from 'react-native-flex-layout';
import { makeRedirectUri, startAsync } from 'expo-auth-session';
import { supabaseUrl } from '../lib/consts';
import {
  faApple,
  faGoogle,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  ButtonPrimary,
  ButtonSecondary,
} from '../components/Buttons';
import colors, { defaultColor } from '../styles/colors';
import { ScrollWithAvoidKeyboardView } from '../components/ScrollWithAvoidKeyboardView';
import { signInWithGoogle, signInWithApple } from '../lib/auth';

export type SignInScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SignIn'
>;

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
              onPress={() => signInWithEmail()}
            >
              Sign in with email
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
              Sign in with Apple
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
              Sign in with Google
            </ButtonSecondary>

            <VStack spacing={5} shouldWrapChildren>
              <Text size="sm" textAlign="center" color="white">
                Don't have an account?{' '}
              </Text>
              <Text
                decoration="underline"
                size="sm"
                textAlign="center"
                color="white"
                onPress={() => navigation.navigate('SignUp')}
              >
                Sign up here
              </Text>{' '}
            </VStack>
            <VStack spacing={5} shouldWrapChildren>
              <Text
                size="xs"
                textAlign="center"
                color={colors.whiteAlpha[700]}
              >
                By signing in with Google, we will automatically
                create an account for you. By doing this you are
                agreeing to our
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
                    Linking.openURL('https://timetogiveapp.com/terms')
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
        </SafeWrapper>
      </ScrollWithAvoidKeyboardView>
    </Box>
  );
};
