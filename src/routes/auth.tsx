import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { RECAPTCHA_SITE_KEY } from '@/config/env';

export const Route = createFileRoute('/auth')({
  head: () => {
    if (RECAPTCHA_SITE_KEY) {
      return {
        links: [{ rel: 'pre-connect', href: 'https://www.google.com' }],
        scripts: [
          {
            defer: true,
            src: `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`,
          },
        ],
      };
    }
    return {};
  },
  beforeLoad: ({ context }) => {
    // check if the user is authenticated.
    // if already authenticated, redirect to `/account`
    if (context.auth.isAuthenticated) {
      throw redirect({
        // TODO: we redirect to the builder while we work on the home page.
        // it should be changed once the home page is a bit more like the home of the builder.
        to: '/builder',
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
