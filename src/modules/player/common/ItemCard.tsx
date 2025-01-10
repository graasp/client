import { useTranslation } from 'react-i18next';

import { Box, Card, Stack, Typography } from '@mui/material';

import { PackedItem, formatDate } from '@graasp/sdk';
import { AnalyticsIcon, PlayIcon } from '@graasp/ui';

import { Link } from '@tanstack/react-router';

import { CardActionAreaLink } from '@/components/ui/CardActionAreaLink';
import { NS } from '@/config/constants';

import ItemThumbnail from './ItemThumbnail';

type Props = {
  item: PackedItem;
};

const SimpleCard = ({ item }: Props): JSX.Element => {
  const { i18n } = useTranslation(NS.Player);

  return (
    <Card>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <CardActionAreaLink
          to="/player/$rootId/$itemId"
          params={{ rootId: item.id, itemId: item.id }}
          sx={{
            minWidth: 0,
            width: '100%',
            p: 2,
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
        <Stack paddingInlineEnd={2}>
          <Link
            to="/player/$rootId/$itemId"
            params={{ rootId: item.id, itemId: item.id }}
            style={{ minHeight: 0 }}
          >
            <PlayIcon
              size={30}
              secondaryColor="white"
              disableHover={false}
              sx={{ display: 'block' }}
            />
          </Link>
          <Link to="/analytics/items/$itemId" params={{ itemId: item.id }}>
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
