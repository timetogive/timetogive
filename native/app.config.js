// For EAS cloud builds, all environment variables are stored in secrets
// with the exception of APP_ENV which is set in the EAS json file
// For local dev, just ensure all env vars are set on your local shell

// Dev specific
const devSupabaseUrl = process.env.DEV_SUPABASE_URL;
const devSupabaseAnonKey = process.env.DEV_SUPABASE_ANON_KEY;
const devSupabaseProjectId = process.env.DEV_SUPABASE_PROJECT_ID;

// Prod specific
const prodSupabaseUrl = process.env.PROD_SUPABASE_URL;
const prodSupabaseAnonKey = process.env.PROD_SUPABASE_ANON_KEY;
const prodSupabaseProjectId = process.env.PROD_SUPABASE_PROJECT_ID;

// Generic on all envs
const appEnv = process.env.APP_ENV; // Set through EAS json or on local machine env
const multiAvatarApiUrl = process.env.MULTIAVATAR_API_URL;
const multiAvatarApiKey = process.env.MULTIAVATAR_API_KEY;
const mapBoxApiKey = process.env.MAPBOX_API_KEY;
const easExpoProjectId = process.env.EAS_EXPO_PROJECT_ID;
const easExpoUpdatesUrl = process.env.EAS_EXPO_UPDATES_URL;

const missingConfigCheck = (arr) => {
  if (arr.find((x) => !x || x === '')) {
    throw Error('Missing config');
  }
};

missingConfigCheck([
  appEnv,
  multiAvatarApiUrl,
  multiAvatarApiKey,
  mapBoxApiKey,
  easExpoProjectId,
  easExpoUpdatesUrl,
]);

const getExtra = () => {
  if (appEnv === 'dev') {
    missingConfigCheck([
      devSupabaseUrl,
      devSupabaseAnonKey,
      devSupabaseProjectId,
    ]);
    return {
      supabaseUrl: devSupabaseUrl,
      supabaseAnonKey: devSupabaseAnonKey,
      supabaseProjectId: devSupabaseProjectId,
      multiAvatarApiUrl,
      multiAvatarApiKey,
      mapBoxApiKey,
      eas: {
        projectId: easExpoProjectId,
      },
    };
  }
  if (appEnv === 'prod') {
    missingConfigCheck([
      prodSupabaseUrl,
      prodSupabaseAnonKey,
      prodSupabaseProjectId,
    ]);
    return {
      supabaseUrl: prodSupabaseUrl,
      supabaseAnonKey: prodSupabaseAnonKey,
      supabaseProjectId: prodSupabaseProjectId,
      multiAvatarApiUrl,
      multiAvatarApiKey,
      mapBoxApiKey,
      eas: {
        projectId: easExpoProjectId,
      },
    };
  }
  throw Error(`Unknown APP_ENV ${appEnv}, must be dev or prod`);
};

const extra = getExtra();

module.exports = {
  expo: {
    name: 'timetogive',
    slug: 'timetogive',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon-ios.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#B794F4',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      buildNumber: '2',
      bundleIdentifier: 'com.timetogiveapp.timetogive',
      supportsTablet: true,
      icon: './assets/icon-ios.png',
    },
    android: {
      package: 'com.timetogiveapp.timetogive',
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/icon-android-foreground.png',
        backgroundImage: './assets/icon-android-background.png',
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      [
        '@rnmapbox/maps',
        {
          RNMapboxMapsImpl: 'mapbox',
          RNMapboxMapsDownloadToken: mapBoxApiKey,
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission:
            'Allow $(PRODUCT_NAME) to access your photos in order to set your profile picture.',
        },
      ],
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Allow $(PRODUCT_NAME) to use your location in order to find tasks near you.',
          locationAlwaysPermission:
            'Allow $(PRODUCT_NAME) to use your location in order to find tasks near you.',
          locationWhenInUsePermission:
            'Allow $(PRODUCT_NAME) to use your location in order to find tasks near you.',
        },
      ],
    ],
    extra,
    scheme: 'timetogive',
    updates: {
      url: easExpoUpdatesUrl,
    },
    runtimeVersion: {
      policy: 'sdkVersion',
    },
  },
};
