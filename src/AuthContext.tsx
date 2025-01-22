import {
  JSX,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { AccountType, getCurrentAccountLang } from '@graasp/sdk';

import { DEFAULT_LANG } from './config/constants';
import { hooks, mutations } from './config/queryClient';
import CustomInitialLoader from './ui/CustomInitialLoader/CustomInitialLoader';

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
  const { data: currentMember, isLoading } = hooks.useCurrentMember();
  const useLogin = mutations.useSignIn();
  const useLogout = mutations.useSignOut();

  const logout = useCallback(async () => {
    const url = window.location.href;
    await useLogout.mutateAsync();
    // redirect to auth page with url from the page that we just left.
    const redirectionURL = new URL('/auth/login', window.location.origin);
    redirectionURL.searchParams.set('url', url);
    // navigate to the auth page with the right params
    window.location.assign(redirectionURL);
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
  if (isLoading) {
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
