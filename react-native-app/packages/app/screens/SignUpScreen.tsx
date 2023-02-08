import React, { useState } from 'react'
import { ScreenWrapper } from 'app/components'
import { Alert } from 'react-native'
import { supabase } from '../lib/supabase'
import { Stack, YStack, Image, Input, Button, Text } from '@my/ui'
import { useLink } from 'solito/link'

export const SignUpScreen = () => {
  const linkToSignInProps = useLink({
    href: '/sign-in',
  })

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signUpWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
    })

    if (error) {
      Alert.alert(error.message)
    }
    setLoading(false)
  }

  return (
    <ScreenWrapper px={5}>
      <YStack space={10}>
        <Stack h={200} w="100%" p={40}>
          <Image
            src={require('app/media/ttg.png')}
            resizeMode="contain"
            height="100%"
            width="100%"
          />
        </Stack>
        <Input placeholder="Email address" onChangeText={(text) => setEmail(text)} />
        <Input
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        <Button theme="blue" disabled={loading} onPress={() => signUpWithEmail()}>
          Sign up
        </Button>
        <Stack pt={20} alignItems="center">
          <Text color="$color">
            Already have an account?{' '}
            <Text color="blue" {...linkToSignInProps}>
              Sign in here.
            </Text>
          </Text>
        </Stack>
      </YStack>
    </ScreenWrapper>
  )
}
