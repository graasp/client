import { Helmet } from 'react-helmet-async';

import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';

import { RECAPTCHA_SITE_KEY } from '@/config/env';

const redirectionSchema = z.object({
  url: z.string().url().optional(),
});

export const Route = createFileRoute('/auth')({
  validateSearch: zodValidator(redirectionSchema),
  beforeLoad: ({ context, search }) => {
    // check if the user is authenticated.
    // if already authenticated, redirect to `/builder`
    if (context.auth.isAuthenticated) {
      let redirectLink = null;
      try {
        if (search.url) {
          redirectLink = new URL(search.url).pathname;
        }
      } catch (e) {
        // we don't throw, the url might be a wrong url
        console.error(e);
      }

      throw redirect({
        to: redirectLink ?? '/home',
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Helmet>
        {
          // only add these tags if the env var is defined
          RECAPTCHA_SITE_KEY && (
            <>
              <link rel="pre-connect" href="https://www.google.com" />
              <script
                defer
                src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
              />
            </>
          )
        }
      </Helmet>
      <Outlet />
    </>
  );
}
