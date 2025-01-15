import { createFileRoute } from '@tanstack/react-router';

import { BookmarkedItemsScreen } from '~builder/components/pages/BookmarkedItemsScreen';

export const Route = createFileRoute('/builder/_layout/bookmarks')({
  component: RouteComponent,
});

function RouteComponent() {
  return <BookmarkedItemsScreen />;
}
