import { ReactNode, createContext, useContext, useMemo, useState } from 'react';

import { LocalStorage } from '@/config/localStorage';

const LOGIN_MODE_KEY = 'login-mode';

type Mode = 'magic-link' | 'password';

type LoginMethodContextType = {
  mode: Mode;
  setMode: (newMode: Mode) => void;
};

const LoginMethodContext = createContext<LoginMethodContextType>({
  mode: 'magic-link',
  setMode: () => {},
});

/**
 * Return login mode to use depending on local storage, or default to 'magic-link'
 * @returns [mode, setMode]
 */
export const LoginMethodContextProvider = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const [mode, setMode] = useState<Mode>(
    (LocalStorage.getItem(LOGIN_MODE_KEY) as Mode | null) ?? 'magic-link',
  );

  const setModeAndSetCache = (newMode: Mode) => {
    setMode(newMode);
    LocalStorage.setItem(LOGIN_MODE_KEY, newMode);
  };

  const value = useMemo(() => ({ mode, setMode: setModeAndSetCache }), [mode]);

  return (
    <LoginMethodContext.Provider value={value}>
      {children}
    </LoginMethodContext.Provider>
  );
};

export const useLoginMethodContext = (): LoginMethodContextType =>
  useContext(LoginMethodContext);
