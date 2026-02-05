import type { JSX } from 'react';

import { useNavigate } from '@tanstack/react-router';

import type { Item } from '@/openapi/client';

import MapView from '../item/MapView';

type Props = {
  parentId?: Item['id'];
};

export const DesktopMap = ({ parentId }: Props): JSX.Element => {
  const navigate = useNavigate();

  const viewItem = (itemId: Item['id']) => {
    navigate({
      to: '/player/$rootId/$itemId',
      params: { rootId: itemId, itemId },
    });
  };

  const viewItemInBuilder = (itemId: Item['id']) => {
    navigate({
      to: '/builder/items/$itemId',
      params: { itemId },
    });
  };

  return (
    <MapView
      parentId={parentId}
      height="100%"
      viewItem={viewItem}
      viewItemInBuilder={viewItemInBuilder}
    />
  );
};
