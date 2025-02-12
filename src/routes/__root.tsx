import { JSX, ReactNode, Suspense, lazy, useEffect } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';

import { CssBaseline, Direction, ThemeProvider } from '@mui/material';

import rtlPlugin from '@graasp/stylis-plugin-rtl';

import createCache, { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { Meta, Scripts } from '@tanstack/start';
import i18n from 'i18next';
import { prefixer } from 'stylis';

import {
  AuthContextType,
  AuthProvider,
  currentMemberOptions,
} from '@/AuthContext';
import { DefaultCatchBoundary } from '@/components/DefaultCatchBoundary';
import { NotFoundComponent } from '@/components/NotFoundComponent';
import '@/config/i18n';
import { ReactQueryDevtools } from '@/config/queryClient';
import { theme } from '@/ui/theme';

import { PreviewContextProvider } from '~landing/preview/PreviewModeContext';

import appCss from '../app.css?url';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth: AuthContextType;
}>()({
  beforeLoad: async ({ context }) => {
    await context.queryClient.prefetchQuery(currentMemberOptions);
    const member = context.queryClient.getQueryData(
      currentMemberOptions.queryKey,
    );
    return { auth: { isAuthenticated: Boolean(member) } };
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Graasp',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootDocument,
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: NotFoundComponent,
});

// this allows to remove the tanstack router dev tools in production
const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : lazy(() =>
        // Lazy load in development
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

type ThemeWrapperProps = {
  children: ReactNode;
};

const getCacheForDirection = (direction?: Direction): EmotionCache =>
  createCache({
    // key needs to eb different from `css`
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
    <ThemeProvider theme={{ ...theme, direction }}>
      <CacheProvider value={getCacheForDirection(direction)}>
        {children}
      </CacheProvider>
    </ThemeProvider>
  );
}

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <Meta />
      </head>
      <body>
        <I18nextProvider i18n={i18n.cloneInstance()}>
          <ThemeWrapper>
            <CssBaseline />
            <AuthProvider>
              <ToastContainer stacked position="bottom-left" />
              <PreviewContextProvider>
                <Outlet />
              </PreviewContextProvider>
            </AuthProvider>
          </ThemeWrapper>
          {import.meta.env.MODE !== 'test' && <ReactQueryDevtools />}
          <Suspense>
            <TanStackRouterDevtools />
          </Suspense>
          <Scripts />
        </I18nextProvider>
      </body>
    </html>
  );
}
