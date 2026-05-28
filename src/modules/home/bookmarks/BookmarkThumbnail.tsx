import type { JSX } from 'react';

import type { PackedItem } from '@/openapi/client';
import CardThumbnail from '@/ui/Card/CardThumbnail';

export const BOOKMARK_CARD_HEIGHT = 60;

type Props = {
  item: PackedItem;
};

export function BookmarkThumbnail({ item }: Readonly<Props>): JSX.Element {
  return (
    <CardThumbnail
      width={BOOKMARK_CARD_HEIGHT}
      minHeight={BOOKMARK_CARD_HEIGHT}
      thumbnail={item.thumbnails?.medium}
      alt={item.name}
    />
  );
}
