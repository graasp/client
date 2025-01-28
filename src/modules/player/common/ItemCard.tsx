import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Card, Stack, Typography } from '@mui/material';

import { ItemType, PackedItem, formatDate } from '@graasp/sdk';

import { Link } from '@tanstack/react-router';

import { CardActionAreaLink } from '@/components/ui/CardActionAreaLink';
import { NS } from '@/config/constants';
import AnalyticsIcon from '@/ui/icons/AnalyticsIcon';
import BuildIcon from '@/ui/icons/BuildIcon';
import PlayIcon from '@/ui/icons/PlayIcon';

import ItemThumbnail from './ItemThumbnail';

type Props = {
  item: PackedItem;
};

const SimpleCard = ({ item }: Props): JSX.Element => {
  const { i18n } = useTranslation(NS.Player);

  const itemId =
    item.type === ItemType.SHORTCUT ? item.extra.shortcut.target : item.id;

  return (
    <Card>
      <Stack
        direction="row"
        alignItems="stretch"
        justifyContent="space-between"
        width="100%"
      >
        <CardActionAreaLink
          to="/player/$rootId/$itemId"
          params={{ rootId: itemId, itemId: itemId }}
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
        <Stack p={1}>
          <Link
            to="/builder/items/$itemId"
            params={{ itemId }}
            style={{ minHeight: 0 }}
          >
            <BuildIcon
              size={30}
              secondaryColor="white"
              disableHover={false}
              sx={{ display: 'block' }}
            />
          </Link>
          <Link
            to="/player/$rootId/$itemId"
            params={{ rootId: itemId, itemId }}
            style={{ minHeight: 0 }}
          >
            <PlayIcon
              size={30}
              secondaryColor="white"
              disableHover={false}
              sx={{ display: 'block' }}
            />
          </Link>
          <Link to="/analytics/items/$itemId" params={{ itemId }}>
            <AnalyticsIcon
              size={30}
              secondaryColor="white"
              disableHover={false}
              sx={{ display: 'block' }}
            />
          </Link>
        </Stack>
      </Stack>
    </Card>
  );
};

export default SimpleCard;
