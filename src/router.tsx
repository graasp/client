import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';

import { DefaultCatchBoundary } from './components/DefaultCatchBoundary';
import { NotFoundComponent } from './components/NotFoundComponent';
import { queryClient } from './config/queryClient';
import { routeTree } from './routeTree.gen';

export function createRouter() {
  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: {
        queryClient,
        // at this stage, we set it to `undefined`. A more appropriate value will be set later in AuthProvider when we wrap the app.
        auth: undefined!,
      },
      scrollRestoration: true,
      defaultPreload: 'intent',
      defaultErrorComponent: DefaultCatchBoundary,
      defaultNotFoundComponent: () => <NotFoundComponent />,
    }),
    queryClient,
  );
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
