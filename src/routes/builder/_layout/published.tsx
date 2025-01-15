import { createFileRoute } from '@tanstack/react-router';

import PublishedItemsScreen from '~builder/components/pages/PublishedItemsScreen';

export const Route = createFileRoute('/builder/_layout/published')({
  component: RouteComponent,
});

function RouteComponent() {
  return <PublishedItemsScreen />;
}
