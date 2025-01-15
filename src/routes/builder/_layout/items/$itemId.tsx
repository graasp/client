import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/builder/_layout/items/$itemId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/builder/items/$itemId"!</div>;
}
