import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;
const multiAvatarApiUrl =
  Constants.expoConfig?.extra?.multiAvatarApiUrl;
const multiAvatarApiKey =
  Constants.expoConfig?.extra?.multiAvatarApiKey;
const mapBoxApiKey = Constants.expoConfig?.extra?.mapBoxApiKey;

if (
  !supabaseUrl ||
  !supabaseAnonKey ||
  !multiAvatarApiUrl ||
  !multiAvatarApiKey ||
  !mapBoxApiKey
) {
  throw Error('Missing config values.');
}

export {
  supabaseUrl,
  supabaseAnonKey,
  multiAvatarApiUrl,
  multiAvatarApiKey,
  mapBoxApiKey,
};
