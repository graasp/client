import type { JSX } from 'react';

import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';

import type { Item } from '@/openapi/client';

import MapView from '~builder/components/item/MapView';

const schema = z.object({
  enableGeolocation: z.boolean().default(true),
  parentId: z.string().optional(),
});

export const Route = createFileRoute('/builder/map')({
  validateSearch: zodValidator(schema),
  component: MapItemScreen,
});

// this page is used by the mobile app to display the map
function MapItemScreen(): JSX.Element | null {
  const search = Route.useSearch();
  const { enableGeolocation, parentId } = search;

  const navigate = useNavigate();

  const viewItem = (itemId: Item['id']) => {
    throw redirect({
      to: '/player/$rootId/$itemId',
      params: { rootId: itemId, itemId },
    });
  };

  const viewItemInBuilder = (itemId: Item['id']) => {
    // navigate to item in map
    navigate({
      to: '/builder/items/$itemId',
      params: { itemId },
    });
  };

  return (
    <MapView
      viewItem={viewItem}
      viewItemInBuilder={viewItemInBuilder}
      enableGeolocation={enableGeolocation}
      parentId={parentId}
    />
  );
}
