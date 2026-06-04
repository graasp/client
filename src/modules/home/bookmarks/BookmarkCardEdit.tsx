import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Badge,
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

import { formatDate } from '@graasp/sdk';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { XIcon } from 'lucide-react';

import { NS } from '@/config/constants';
import { buildBookmarkCardEditClassName } from '@/config/selectors';
import type { PackedItem } from '@/openapi/client';
import {
  deleteBookmarkMutation,
  getOwnBookmarkQueryKey,
} from '@/openapi/client/@tanstack/react-query.gen';
import CardThumbnail from '@/ui/Card/CardThumbnail';
import { useButtonColor } from '@/ui/buttons/hooks';

type Props = {
  item: PackedItem;
};

export function BookmarkCardEdit({ item }: Readonly<Props>): JSX.Element {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const { color } = useButtonColor('error');
  const { t } = useTranslation(NS.Common, { keyPrefix: 'ARIA' });

  const { mutate: removeBookmark } = useMutation({
    ...deleteBookmarkMutation(),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getOwnBookmarkQueryKey(),
      });
    },
  });

  return (
    <Badge
      className={buildBookmarkCardEditClassName(item.id)}
      sx={{ width: '100%' }}
      badgeContent={
        <IconButton
          aria-label={t('REMOVE_BOOKMARK')}
          onClick={() => {
            removeBookmark({ path: { itemId: item.id } });
          }}
        >
          <XIcon color={color} />
        </IconButton>
      }
    >
      <Card sx={{ height: '100%', width: '100%' }} id={`bookmark-${item.id}`}>
        <CardContent
          id={`bookmarkCardAction-${item.id}`}
          sx={{ p: 0, '&:last-child': { pb: 0 } }}
        >
          <Stack
            direction="row"
            alignItems="stretch"
            width="100%"
            height="100%"
            gap={2}
            paddingRight={2}
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              // do not allow icons to shrink
              flexShrink={0}
            >
              <CardThumbnail
                width={60}
                minHeight={60}
                thumbnail={item.thumbnails?.medium}
                alt={item.name}
              />
            </Box>

            <Stack minWidth={0} justifyContent="center">
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
        </CardContent>
      </Card>
    </Badge>
  );
}
