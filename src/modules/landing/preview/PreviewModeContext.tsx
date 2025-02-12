import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { isServer } from '@tanstack/react-query';

const PREVIEW_STORAGE_KEY = 'graasp-preview';

type PreviewContextType = {
  togglePreview: () => void;
  isEnabled: boolean;
};
const PreviewContext = createContext<PreviewContextType>({
  isEnabled: false,
  togglePreview: () => console.error('no Preview context present'),
});

const isPreviewEnabled = () => {
  if (!isServer) {
    // only check if the element is present, value is not checked for the moment
    // maybe if we extend the feature later we will need to
    const isPresent = localStorage.getItem(PREVIEW_STORAGE_KEY) != null;
    return isPresent;
  }
  return false;
};

export function PreviewContextProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [isEnabled, setIsEnabled] = useState(isPreviewEnabled());

  useEffect(() => {
    function listenForStorageChanges(event: StorageEvent) {
      if (event.key === PREVIEW_STORAGE_KEY) {
        // sync the local state
        setIsEnabled(isPreviewEnabled());
      }
      // discard the event otherwise
    }
    window.addEventListener('storage', listenForStorageChanges);
    return () => window.removeEventListener('storage', listenForStorageChanges);
  }, []);

  const value = useMemo(
    () => ({
      togglePreview: () => {
        if (!isServer) {
          if (isPreviewEnabled()) {
            window.localStorage.removeItem(PREVIEW_STORAGE_KEY);
            setIsEnabled(false);
          } else {
            window.localStorage.setItem(PREVIEW_STORAGE_KEY, 'enabled');
            setIsEnabled(true);
          }
        }
      },
      isEnabled,
    }),
    [isEnabled],
  );

  return (
    <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>
  );
}

export function usePreviewMode() {
  return useContext<PreviewContextType>(PreviewContext);
}

export function Preview({ children }: { children: ReactNode }) {
  const { isEnabled } = usePreviewMode();
  if (isEnabled) {
    return children;
  }
  return null;
}
