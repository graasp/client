import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/builder/_layout/items/$itemId/_itemPage/share',
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/builder/_layout/items/$itemId/_itemPage/share"!</div>;
}
