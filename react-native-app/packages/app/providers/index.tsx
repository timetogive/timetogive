import config from '../tamagui.config'
import { NavigationProvider } from './navigation'
import { QueryClientProvider, QueryClient } from 'react-query'
import { TamaguiProvider, TamaguiProviderProps } from '@my/ui'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { SessionProvider } from './session'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

export function Providers({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  const scheme = useColorScheme()
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <SessionProvider>
          <TamaguiProvider
            config={config}
            disableInjectCSS
            defaultTheme={scheme === 'dark' ? 'dark' : 'light'}
            {...rest}
          >
            <NavigationProvider>{children}</NavigationProvider>
          </TamaguiProvider>
        </SessionProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  )
}
