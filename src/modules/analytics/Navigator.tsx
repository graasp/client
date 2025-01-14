import { AnalyticsNavigator } from '@/components/ui/Navigator/Navigator';
import { hooks } from '@/config/queryClient';

import {
  BREADCRUMBS_NAVIGATOR_ID,
  buildBreadcrumbsItemLink,
  buildMenuItemId,
  buildNavigationDropDownId,
} from './config/selectors';
import { NAVIGATOR_BACKGROUND_COLOR } from './constants';

const { useItem, useParents, useChildren } = hooks;

export function Navigator({
  itemId,
}: Readonly<{ itemId: string }>): JSX.Element | null {
  const { data: item, isLoading: isItemLoading } = useItem(itemId);

  const { data: parents, isLoading: areParentsLoading } = useParents({
    id: itemId,
  });

  if (isItemLoading || areParentsLoading) {
    return null;
  }

  return (
    <AnalyticsNavigator
      id={BREADCRUMBS_NAVIGATOR_ID}
      sx={{ paddingLeft: 2 }}
      item={item}
      parents={parents}
      backgroundColor={NAVIGATOR_BACKGROUND_COLOR}
      buildBreadcrumbsItemLinkId={buildBreadcrumbsItemLink}
      buildMenuItemId={buildMenuItemId}
      useChildren={useChildren as any}
      buildIconId={buildNavigationDropDownId}
    />
  );
}
