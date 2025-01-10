import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';

import { CssBaseline } from '@mui/material';

import { BUILDER_ITEMS_PREFIX, ClientHostManager, Context } from '@graasp/sdk';

import {
  init as SentryInit,
  browserTracingIntegration,
  replayIntegration,
} from '@sentry/react';
import { RouterProvider } from '@tanstack/react-router';

import '@/config/i18n';

import pkg from '../package.json';
import { AuthProvider, useAuth } from './AuthContext';
import './app.css';
import {
  APP_VERSION,
  GRAASP_BUILDER_HOST,
  SENTRY_DSN,
  SENTRY_ENV,
} from './config/env';
import { QueryClientProvider, queryClient } from './config/queryClient';

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

ClientHostManager.getInstance()
  .addPrefix(Context.Builder, BUILDER_ITEMS_PREFIX)
  .addHost(Context.Builder, new URL(GRAASP_BUILDER_HOST));

function InnerApp() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeWrapper>
        <CssBaseline />
        <AuthProvider>
          <ToastContainer stacked position="bottom-left" />
          <InnerApp />
        </AuthProvider>
      </ThemeWrapper>
    </QueryClientProvider>
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
