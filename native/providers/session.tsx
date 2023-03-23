import { Profile } from '../types';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from 'react-query';
import { supabase } from '../lib/supabase';
import { AuthChangeEvent } from '@supabase/supabase-js';
import { queryClient } from '../lib/queryClient';
import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { SignInScreenProps } from '../screens/SignIn';

type Query = UseQueryResult<Profile | null>;

const Context = createContext<{
  user: Query['data'];
  isReady: Query['isSuccess'];
  refetch: () => void;
}>({
  user: undefined,
  isReady: false,
  refetch: () => {},
});

interface Props {
  children: ReactNode;
  initialUser?: undefined;
}

export const SessionProvider = ({
  children,
  initialUser = undefined,
}: Props) => {
  const userQuery = useQuery(
    'activeUser',
    async () => {
      console.log('I am here');
      const { data, error } = await supabase.auth.getUser();
      if (error || !data) {
        console.log('error', error);
        return undefined;
      }

      console.log('I am here 2');

      const user = data.user;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: prefsData } = await supabase
        .from('prefs')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profileData) {
        console.log('no profile data');
        return undefined;
      }

      return { ...profileData, ...prefsData } as Profile;
    },
    {
      initialData: initialUser,
    }
  );

  const refetch = () => {
    userQuery.refetch();
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          console.log('AuthChangeEvent', event);
          await userQuery.refetch();
        }

        if (event === 'SIGNED_OUT') {
          await userQuery.refetch();
          queryClient.clear();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userQuery]);

  return (
    <Context.Provider
      value={{
        user: userQuery.data,
        isReady: userQuery.isSuccess,
        refetch,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useSession = () => useContext(Context);
