import type { JSX } from 'react';

import { ThumbnailSize } from '@graasp/sdk';

import { useQuery } from '@tanstack/react-query';

import type { PackedItem } from '@/openapi/client';
import { downloadItemThumbnailOptions } from '@/openapi/client/@tanstack/react-query.gen';
import CardThumbnail from '@/ui/Card/CardThumbnail';

import { getItemType } from '~builder/utils/capsule';

export const BOOKMARK_CARD_HEIGHT = 60;

type Props = {
  item: PackedItem;
};

export function BookmarkThumbnail({ item }: Readonly<Props>): JSX.Element {
  const hasThumbnail = item.type === 'folder' && item.settings.hasThumbnail;
  const thumbnailUrl = item.thumbnails?.medium;

  const { data: fetchedThumbnailUrl } = useQuery({
    ...downloadItemThumbnailOptions({
      path: { id: item.id, size: ThumbnailSize.Medium },
    }),
    enabled: hasThumbnail && !thumbnailUrl,
  });

  const itemWithThumbnail =
    fetchedThumbnailUrl && !thumbnailUrl
      ? {
          ...item,
          thumbnails: {
            small: fetchedThumbnailUrl,
            medium: fetchedThumbnailUrl,
          },
        }
      : item;

  return (
    <CardThumbnail
      width={BOOKMARK_CARD_HEIGHT}
      minHeight={BOOKMARK_CARD_HEIGHT}
      thumbnail={itemWithThumbnail.thumbnails?.medium}
      alt={item.name}
      type={getItemType(item)}
    />
  );
}
