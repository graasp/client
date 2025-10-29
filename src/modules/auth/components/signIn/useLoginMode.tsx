import { LocalStorage } from '@/config/localStorage';

const LOGIN_MODE_KEY = 'login-mode';

type Mode = 'magic-link' | 'password';

/**
 * Return login mode to use depending on local storage, or default to 'magic-link'
 * @returns [mode, setMode]
 */
export const useLoginMode = () => {
  const mode: Mode =
    (LocalStorage.getItem(LOGIN_MODE_KEY) as Mode | null) ?? 'magic-link';

  const setMode = (newMode: Mode) => {
    LocalStorage.setItem(LOGIN_MODE_KEY, newMode);
  };

  return { mode, setMode };
};
