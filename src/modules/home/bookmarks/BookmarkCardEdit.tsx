import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Cancel } from '@mui/icons-material';
import {
  Badge,
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

import { PackedItem, formatDate } from '@graasp/sdk';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteBookmarkMutation } from '@/openapi/client/@tanstack/react-query.gen';
import { memberKeys } from '@/query/keys';

import ItemThumbnail from '../../player/common/ItemThumbnail';

type Props = {
  item: PackedItem;
};

export function BookmarkCardEdit({ item }: Readonly<Props>): JSX.Element {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();

  const { mutate: removeBookmark } = useMutation({
    ...deleteBookmarkMutation(),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: memberKeys.current().bookmarkedItems,
      });
    },
  });

  return (
    <Badge
      sx={{ width: '100%' }}
      badgeContent={
        <IconButton
          onClick={() => {
            removeBookmark({ path: { itemId: item.id } });
          }}
        >
          <Cancel color="error" />
        </IconButton>
      }
    >
      <Card sx={{ height: '100%', width: '100%' }} id={`bookmark-${item.id}`}>
        <CardContent id={`bookmarkCardAction-${item.id}`}>
          <Stack
            direction="row"
            alignItems="stretch"
            width="100%"
            height="100%"
            gap={1}
          >
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
        </CardContent>
      </Card>
    </Badge>
  );
}
