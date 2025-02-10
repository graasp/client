import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Card, Stack, Typography } from '@mui/material';

import {
  ItemType,
  PackedItem,
  formatDate,
  getShortcutExtra,
} from '@graasp/sdk';

import { CardActionAreaLink } from '@/components/ui/CardActionAreaLink';
import { NS } from '@/config/constants';

import ItemThumbnail from '../../player/common/ItemThumbnail';

type Props = {
  item: PackedItem;
};

export function ItemCard({ item }: Readonly<Props>): JSX.Element {
  const { i18n } = useTranslation(NS.Player);

  const itemId =
    item.type === ItemType.SHORTCUT
      ? getShortcutExtra(item.extra)?.target
      : item.id;

  return (
    <Card id={`bookmark-${item.id}`}>
      <Stack
        direction="row"
        alignItems="stretch"
        justifyContent="space-between"
        width="100%"
      >
        <CardActionAreaLink
          id={`recentItemCardAction-${item.id}`}
          to="/builder/items/$itemId"
          params={{ itemId: itemId }}
          sx={{
            minWidth: 0,
            width: '100%',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            padding: 2,
          }}
        >
          <Stack direction="row" spacing={2} width="100%" minWidth={0}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              // do not allow icons to shrink
              flexShrink={0}
            >
              <ItemThumbnail item={item} />
            </Box>
            <Stack minWidth={0}>
              <Typography
                variant="h5"
                component="h2"
                alignItems="center"
                textOverflow="ellipsis"
                overflow="hidden"
                noWrap
              >
                {item.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(item.updatedAt, { locale: i18n.language })}
              </Typography>
            </Stack>
          </Stack>
        </CardActionAreaLink>
      </Stack>
    </Card>
  );
}
