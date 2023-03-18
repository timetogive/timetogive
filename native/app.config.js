module.exports = {
  expo: {
    name: 'timetogive',
    slug: 'timetogive',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/ttg-white.png',
      resizeMode: 'contain',
      backgroundColor: '#B794F4',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      bundleIdentifier: 'com.timetogiveapp.timetogive',
      supportsTablet: true,
    },
    android: {
      package: 'com.timetogiveapp.timetogive',
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
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
          RNMapboxMapsDownloadToken: process.env.MAPBOX_API_KEY,
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission: 'Allow TimeToGive to access your photos',
        },
      ],
    ],
    extra: {
      supabaseAccessToken: process.env.SUPABASE_ACCESS_TOKEN,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      supabaseProjectId: process.env.SUPABASE_PROJECT_ID,
      multiAvatarApiUrl: process.env.MULTIAVATAR_API_URL,
      multiAvatarApiKey: process.env.MULTIAVATAR_API_KEY,
      eas: {
        projectId: '18442e1f-ce66-4b53-86df-d77aea5c3d8f',
      },
    },
  },
};
