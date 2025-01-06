import { createFileRoute, redirect } from '@tanstack/react-router';

// legacy redirection for routes using the old `signin` route.
// this should be removed 6 months after the push of the new client interface in production.
// estimated date at time of writing is July 2025
export const Route = createFileRoute('/signin')({
  beforeLoad: (ctx) => {
    throw redirect({ to: '/auth/login', search: ctx.search });
  },
});
