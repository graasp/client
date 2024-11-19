import { createFileRoute } from '@tanstack/react-router';

import { WorkInProgress } from '@/components/WorkInProgress';

export const Route = createFileRoute('/_landing/support')({
  component: RouteComponent,
});

function RouteComponent() {
  return <WorkInProgress />;
}