import { Navigate, getRouteApi } from '@tanstack/react-router';

import { useOutletContext } from '~builder/contexts/OutletContext';

import ItemPublishTab from '../../item/publish/ItemPublishTab';

const itemRoute = getRouteApi('/builder/_layout/items/$itemId');

export function LibrarySettingsPage() {
  const { itemId } = itemRoute.useParams();
  const { canAdmin } = useOutletContext();

  if (canAdmin) {
    return <ItemPublishTab />;
  }

  // redirect the user to the item if he doesn't have the permission to access this page
  return <Navigate to="/builder/items/$itemId" params={{ itemId }} replace />;
}
