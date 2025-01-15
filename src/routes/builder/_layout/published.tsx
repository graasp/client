import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/builder/_layout/published')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/builder/_layout/published"!</div>;
}
