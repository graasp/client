import type { JSX } from 'react';

import { useNavigate } from '@tanstack/react-router';

import type { GenericItem } from '@/openapi/client';

import MapView from '../item/MapView';

type Props = {
  parentId?: GenericItem['id'];
};

export const DesktopMap = ({ parentId }: Props): JSX.Element => {
  const navigate = useNavigate();

  const viewItem = (itemId: GenericItem['id']) => {
    navigate({
      to: '/player/$rootId/$itemId',
      params: { rootId: itemId, itemId },
    });
  };

  const viewItemInBuilder = (itemId: GenericItem['id']) => {
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
