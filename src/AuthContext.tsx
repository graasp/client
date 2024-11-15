import { ReactNode, createContext, useCallback, useContext } from 'react';

import { getCurrentAccountLang } from '@graasp/sdk';
import { DEFAULT_LANG } from '@graasp/translations';
import { CustomInitialLoader } from '@graasp/ui';

import { hooks, mutations } from './config/queryClient';

type LoginInput = {
  email: string;
  captcha: string;
  url?: string;
};
export type AuthenticatedMember = {
  name: string;
  id: string;
  lang: string;
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

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { data: currentMember, isLoading } = hooks.useCurrentMember();

  const useLogin = mutations.useSignIn();
  const useLogout = mutations.useSignOut();

  const logout = useCallback(async () => {
    await useLogout.mutateAsync();
  }, [useLogout]);

  const login = useCallback(
    async (args: LoginInput) => {
      await useLogin.mutateAsync(args);
    },
    [useLogin],
  );

  // if the query has not resolved yet, we can not render the rest of the tree
  if (isLoading) {
    return <CustomInitialLoader />;
  }

  const value = currentMember
    ? {
        isAuthenticated: true as const,
        user: {
          name: currentMember.name,
          id: currentMember.id,
          lang: getCurrentAccountLang(currentMember, DEFAULT_LANG),
        },
        logout,
        login: null,
      }
    : { isAuthenticated: false as const, user: null, login, logout: null };

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
