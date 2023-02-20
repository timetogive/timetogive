import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;
const multiAvatarApiUrl =
  Constants.expoConfig?.extra?.multiAvatarApiUrl;
const multiAvatarApiKey =
  Constants.expoConfig?.extra?.multiAvatarApiKey;

if (
  !supabaseUrl ||
  !supabaseAnonKey ||
  !multiAvatarApiUrl ||
  !multiAvatarApiKey
) {
  throw Error('Missing config values.');
}

export {
  supabaseUrl,
  supabaseAnonKey,
  multiAvatarApiUrl,
  multiAvatarApiKey,
};
