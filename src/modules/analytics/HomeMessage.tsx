import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { Box, Stack, Typography } from '@mui/material';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { NS } from '@/config/constants';

export function HomeMessage(): JSX.Element {
  const { t } = useTranslation(NS.Analytics);
  return (
    <Box
      display="flex"
      flexDirection="column"
      flexGrow={1}
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        width="80%"
      >
        <QueryStatsIcon sx={{ fontSize: 80 }} />
        <Typography variant="h4" textAlign="center">
          {t('NO_ITEM_SELECTED')}
        </Typography>
      </Stack>
      <ButtonLink to="/account">Choose an item</ButtonLink>
    </Box>
  );
}
