import { Outlet, createFileRoute } from '@tanstack/react-router';

import { PageWrapper } from '~builder/components/main/PageWrapper';

export const Route = createFileRoute('/builder/_layout')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageWrapper>
      <Outlet />
    </PageWrapper>
  );
}
