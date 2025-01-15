import { DiscriminatedItem } from '@graasp/sdk';

import { useNavigate } from '@tanstack/react-router';

import MapView from '../item/MapView';

type Props = {
  parentId?: DiscriminatedItem['id'];
};

export const DesktopMap = ({ parentId }: Props): JSX.Element => {
  const navigate = useNavigate();

  const viewItem = (item: DiscriminatedItem) => {
    navigate({
      to: '/player/$rootId/$itemId',
      params: { rootId: item.id, itemId: item.id },
    });
  };

  const viewItemInBuilder = (item: DiscriminatedItem) => {
    navigate({
      to: '/builder/items/$itemId',
      params: { itemId: item.id },
    });
  };

  // todo: improve height
  return (
    <MapView
      parentId={parentId}
      height="65vh"
      viewItem={viewItem}
      viewItemInBuilder={viewItemInBuilder}
    />
  );
};
