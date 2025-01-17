import React, { ReactNode, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';

import {
  CssBaseline,
  Direction,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material';

import rtlPlugin from '@graasp/stylis-plugin-rtl';

import createCache from '@emotion/cache';
import { CacheProvider, EmotionCache } from '@emotion/react';
import {
  init as SentryInit,
  browserTracingIntegration,
  replayIntegration,
} from '@sentry/react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { prefixer } from 'stylis';

import '@/config/i18n';
import { theme } from '@/ui/theme';

import pkg from '../package.json';
import { AuthProvider, useAuth } from './AuthContext';
import './app.css';
import { APP_VERSION, SENTRY_DSN, SENTRY_ENV } from './config/env';
import { QueryClientProvider, queryClient } from './config/queryClient';
import { routeTree } from './routeTree.gen';

SentryInit({
  dsn: SENTRY_DSN,
  integrations: [
    browserTracingIntegration(),
    replayIntegration({
      maskAllText: false,
      maskAllInputs: true,
    }),
  ],
  release: `${pkg.name}@${APP_VERSION}`,
  environment: SENTRY_ENV,
  tracesSampleRate: 0.5,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 0.5,
});

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    // at this stage, we set it to `undefined`. A more appropriate value will be set later in AuthProvider when we wrap the app.
    auth: undefined!,
  },
});

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
}

type ThemeWrapperProps = {
  children: ReactNode;
};

const getCacheForDirection = (direction?: Direction): EmotionCache =>
  createCache({
    key: `mui-dir-${direction}`,
    stylisPlugins: [prefixer, ...(direction === 'rtl' ? [rtlPlugin] : [])],
  });

function ThemeWrapper({ children }: Readonly<ThemeWrapperProps>): JSX.Element {
  // use the hook as it allows to use the correct instance of i18n
  const { i18n: i18nInstance } = useTranslation();
  const direction = i18nInstance.dir(i18nInstance.language);

  // needed to set the right attribute on the HTML
  useEffect(
    () => {
      const dir = i18nInstance.dir(i18nInstance.language);
      console.debug(
        `Language changed to ${i18nInstance.language}, updating direction to ${dir}`,
      );
      document.documentElement.setAttribute('dir', dir);
    },
    // here we need to react to the change of the language, the instance does not change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18nInstance.language],
  );

  return (
    <MuiThemeProvider theme={{ ...theme, direction }}>
      <CacheProvider value={getCacheForDirection(direction)}>
        {children}
      </CacheProvider>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeWrapper>
          <CssBaseline />
          <AuthProvider>
            <ToastContainer stacked position="bottom-left" />
            <InnerApp />
          </AuthProvider>
        </ThemeWrapper>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
