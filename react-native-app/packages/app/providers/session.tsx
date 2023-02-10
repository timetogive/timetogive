import { Profile } from 'app/types'
import { createContext, ReactNode, useContext, useEffect } from 'react'
import { useQuery, useQueryClient, UseQueryResult } from 'react-query'
import { supabase } from '../lib/supabase'
import { AuthChangeEvent } from '@supabase/supabase-js'

type Query = UseQueryResult<Profile | null>

const Context = createContext<{
  user: Query['data']
  isReady: Query['isSuccess']
}>({
  user: undefined,
  isReady: false,
})

interface Props {
  children: ReactNode
  initialUser?: undefined
}

export const SessionProvider = ({ children, initialUser = undefined }: Props): JSX.Element => {
  const queryClient = useQueryClient()
  const userQuery = useQuery(
    'activeUser',
    async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data) {
        return undefined
      }

      const user = data.user

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profileData) {
        return undefined
      }

      return profileData
    },
    {
      initialData: initialUser,
    }
  )

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          await userQuery.refetch()
        }

        if (event === 'SIGNED_OUT') {
          await queryClient.clear()
          window.location.reload()
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userQuery])

  return (
    <Context.Provider value={{ user: userQuery.data, isReady: userQuery.isSuccess }}>
      {children}
    </Context.Provider>
  )
}

export const useSession = () => useContext(Context)
