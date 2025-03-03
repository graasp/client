import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

import { PackedItem, formatDate } from '@graasp/sdk';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookmarkMinusIcon } from 'lucide-react';

import { deleteFavoriteMutation } from '@/openapi/client/@tanstack/react-query.gen';
import { memberKeys } from '@/query/keys';

import ItemThumbnail from '../../player/common/ItemThumbnail';

type Props = {
  item: PackedItem;
};

export function BookmarkCardEdit({ item }: Readonly<Props>): JSX.Element {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();

  const { mutate: removeBookmark } = useMutation({
    ...deleteFavoriteMutation(),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: memberKeys.current().bookmarkedItems,
      });
    },
  });

  return (
    <Card sx={{ height: '100%' }} id={`bookmark-${item.id}`}>
      <CardContent id={`bookmarkCardAction-${item.id}`} sx={{ pb: 0 }}>
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
      <CardActions sx={{ pt: 0, justifyContent: 'end' }}>
        <IconButton
          onClick={() => {
            removeBookmark({ path: { itemId: item.id } });
          }}
        >
          <BookmarkMinusIcon color={theme.palette.error.main} />
        </IconButton>
      </CardActions>
    </Card>
  );
}
