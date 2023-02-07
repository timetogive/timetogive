import React, { useState } from 'react'
import { ScreenWrapper } from 'app/components'
import { Alert } from 'react-native'
import { supabase } from '../lib/supabase'
import { Stack, YStack, Image, Input, Button, Text } from '@my/ui'
import { Link, useLink } from 'solito/link'

export default function SignInScreen() {
  const linkToSignUpProps = useLink({
    href: '/sign-up',
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
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
        <Button theme="blue" disabled={loading} onPress={() => signInWithEmail()}>
          Sign in
        </Button>
        <Stack pt={20} alignItems="center">
          <Text color="$color">
            Don&apos;t have account?{' '}
            <Text color="blue" {...linkToSignUpProps}>
              Sign up here.
            </Text>
          </Text>
        </Stack>
      </YStack>
    </ScreenWrapper>
  )
}
