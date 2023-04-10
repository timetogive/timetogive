import { supabase } from '../lib/supabase';
import { makeRedirectUri, startAsync } from 'expo-auth-session';
import { supabaseUrl } from '../lib/consts';

const signInWithSocial = async (provider: string) => {
  // This builds the URL for the signin page based on the
  // expo URL scheme specified in the config. Ensures it works
  // in local dev and in production.
  const redirectUrl = makeRedirectUri({
    path: 'signin',
  });

  // authUrl: https://{YOUR_PROJECT_REFERENCE_ID}.supabase.co
  // returnURL: the redirectUrl you created above.
  const authResponse = await startAsync({
    authUrl: `${supabaseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${redirectUrl}`,
    returnUrl: redirectUrl,
    projectNameForProxy: '@hoochani/timetogive',
  });

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

export const signInWithApple = async () => {
  await signInWithSocial('apple');
};

export const signInWithGoogle = async () => {
  await signInWithSocial('google');
};
