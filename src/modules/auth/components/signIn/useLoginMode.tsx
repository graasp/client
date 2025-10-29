import { LocalStorage } from '@/config/localStorage';

const LOGIN_MODE_KEY = 'login-mode';

export type Mode = 'magic-link' | 'password';

/**
 * Return login mode to use depending on URL search param or local storage
 * No forced login mode will check local storage for previous mode or default to 'magic-link'
 * @param loginMode forced login mode, usually from URL search params
 * @returns [mode, setMode]
 */
export const useLoginMode = (loginMode?: Mode) => {
  const mode: Mode =
    loginMode ??
    (LocalStorage.getItem(LOGIN_MODE_KEY) as Mode | null) ??
    'magic-link';

  const setMode = (newMode: Mode) => {
    LocalStorage.setItem(LOGIN_MODE_KEY, newMode);
  };

  return [mode, setMode] satisfies [Mode, (newMode: Mode) => void];
};
