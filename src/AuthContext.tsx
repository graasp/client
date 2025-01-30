import {
  type JSX,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { AccountType, getCurrentAccountLang } from '@graasp/sdk';

import { DEFAULT_LANG } from './config/constants';
import { API_HOST } from './config/env';
import {
  hooks,
  mutations,
  useMutation,
  useQueryClient,
} from './config/queryClient';
import CustomInitialLoader from './ui/CustomInitialLoader/CustomInitialLoader';

const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => fetch(`${API_HOST}/logout`),
    onSuccess: async () => {
      await queryClient.resetQueries();

      // cookie operations only if window is defined (operation happens in the frontend)
      // if (!isServer() && queryConfig.DOMAIN) {
      //   // save current page for further redirection
      //   saveUrlForRedirection(window.location.href, queryConfig.DOMAIN);
      //   // remove cookie and stored session from browser when the logout is confirmed
      //   // todo: find a way to do something equivalent but with httpOnly cookies
      //   // setCurrentSession(null, queryConfig.DOMAIN);
      //   // removeSession(currentMemberId, queryConfig.DOMAIN);
      // }
      // Update when the server confirmed the logout, instead optimistically updating the member
      // This prevents logout loop (redirect to logout -> still cookie -> logs back in)
      // queryClient.setQueryData(memberKeys.current().content, undefined);
    },
    onError: (error: Error) => {
      console.error('Logout failure', error);
    },
  });
};

type LoginInput = {
  email: string;
  captcha: string;
  url?: string;
};
export type AuthenticatedMember = {
  name: string;
  id: string;
  lang: string;
  type: AccountType;
};
type AuthContextLoggedMember = {
  isAuthenticated: true;
  user: AuthenticatedMember;
  logout: () => Promise<void>;
  login: null;
};
type AuthContextSignedOut = {
  isAuthenticated: false;
  user: null;
  logout: null;
  login: (args: LoginInput) => Promise<void>;
};
/**
 * Auth context used inside the router to know if the user is logged in
 */
export type AuthContextType = AuthContextLoggedMember | AuthContextSignedOut;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  const { data: currentMember, isPending } = hooks.useCurrentMember();
  const useLogin = mutations.useSignIn();
  // const useLogout = mutations.useSignOut();
  const useLogout = useLogoutMutation();

  const logout = useCallback(async () => {
    // const url = window.location.href;
    await useLogout.mutateAsync();
    // redirect to auth page with url from the page that we just left.
    // const redirectionURL = new URL('/logout', API_HOST);
    // redirectionURL.searchParams.set('url', url);
    // console.log(redirectionURL.toString());
    // // navigate to the auth page with the right params
    // window.location.assign(encodeURI(redirectionURL.toString()));
  }, [useLogout]);

  const login = useCallback(
    async (args: LoginInput) => {
      await useLogin.mutateAsync(args);
    },
    [useLogin],
  );

  useEffect(() => {
    if (currentMember) {
      localStorage.setItem(
        'i18nextLng',
        getCurrentAccountLang(currentMember, DEFAULT_LANG),
      );
    } else {
      localStorage.removeItem('i18nextLng');
    }
  }, [currentMember]);

  const value = useMemo(() => {
    if (currentMember) {
      return {
        isAuthenticated: true as const,
        user: {
          name: currentMember.name,
          id: currentMember.id,
          lang: getCurrentAccountLang(currentMember, DEFAULT_LANG),
          type: currentMember.type,
        },
        logout,
        login: null,
      };
    } else {
      return {
        isAuthenticated: false as const,
        user: null,
        login,
        logout: null,
      };
    }
  }, [currentMember, login, logout]);

  // if the query has not resolved yet, we can not render the rest of the tree
  if (isPending) {
    return <CustomInitialLoader />;
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Auth context accessible via the router to know if the user is logged in
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
