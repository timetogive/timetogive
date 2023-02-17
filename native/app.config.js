module.exports = {
  expo: {
    name: 'native',
    slug: 'native',
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
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      supabaseAccessToken: process.env.SUPABASE_ACCESS_TOKEN,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      supabaseProjectId: process.env.SUPABASE_PROJECT_ID,
    },
  },
};
