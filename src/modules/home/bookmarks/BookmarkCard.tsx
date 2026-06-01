import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Card, Stack, Typography } from '@mui/material';

import { ShortcutItemType, formatDate, getShortcutExtra } from '@graasp/sdk';

import { CardActionAreaLink } from '@/components/ui/CardActionAreaLink';
import { NS } from '@/config/constants';
import { buildItemBookmarkCard } from '@/config/selectors';
import type { PackedItem } from '@/openapi/client';

import { BookmarkThumbnail } from './BookmarkThumbnail';

type Props = {
  item: PackedItem;
};

export function BookmarkCard({ item }: Readonly<Props>): JSX.Element {
  const { i18n } = useTranslation(NS.Player);

  const itemId =
    item.type === 'shortcut'
      ? // TODO: fix type
        getShortcutExtra((item as unknown as ShortcutItemType).extra)?.target
      : item.id;

  return (
    <Card sx={{ height: '100%' }} id={buildItemBookmarkCard(item.id)}>
      <Stack
        direction="row"
        alignItems="stretch"
        justifyContent="space-between"
        width="100%"
        height="100%"
      >
        <CardActionAreaLink
          id={`bookmarkCardAction-${item.id}`}
          to="/builder/items/$itemId"
          params={{ itemId: itemId }}
          onClick={() => {
            window.umami.track('bookmark-card');
          }}
          sx={{
            minWidth: 0,
            width: '100%',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
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
              <BookmarkThumbnail item={item} />
            </Box>
            <Stack minWidth={0} justifyContent="center">
              <Typography
                variant="h5"
                component="h2"
                alignItems="center"
                textOverflow="ellipsis"
                overflow="hidden"
                noWrap
                paddingRight={2}
              >
                {item.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                paddingRight={2}
                noWrap
              >
                {formatDate(item.updatedAt, { locale: i18n.language })}
              </Typography>
            </Stack>
          </Stack>
        </CardActionAreaLink>
      </Stack>
    </Card>
  );
}
