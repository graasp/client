import { Component, ElementType, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';

import { FolderLockIcon, ShareIcon, UsersIcon } from 'lucide-react';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { Image } from '@/components/ui/StyledImages';
import { NS } from '@/config/constants';

import { Message } from '../Message';

function PropCard({
  Icon,
  title,
  description,
}: {
  Icon: ElementType;
  title?: string;
  description?: string;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        background: 'white',
        borderRadius: 7,
        px: 3,
        py: 2,
        border: '2px solid #f0f0f0',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Stack>
          <Icon color={theme.palette.primary.main} size={40} />
        </Stack>
        <Stack>
          <Typography color="primary" variant="h5">
            {title}
          </Typography>
          <Typography color="primary" variant="body1">
            {description}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

export function MessageShare() {
  const { t, i18n } = useTranslation(NS.Landing, { keyPrefix: 'HOME' });

  return (
    <Stack gap={4}>
      <Message
        title={t('MESSAGES.SHARE.TITLE')}
        image="/illustration/landing-message-share.svg"
      >
        <Typography>{t('MESSAGES.SHARE.DESCRIPTION_1')}</Typography>
        <Typography>{t('MESSAGES.SHARE.DESCRIPTION_2')}</Typography>
        <ButtonLink
          to="/features"
          sx={{
            // make button take only needed space
            width: 'fit-content',
          }}
          color="secondary"
          variant="contained"
        >
          {t('MESSAGES.SHARE.BUTTON_TEXT')}
        </ButtonLink>
      </Message>
      <Grid container spacing={2} direction="row">
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <PropCard
            Icon={FolderLockIcon}
            title={t('MESSAGES.SHARE.MEMBERSHIPS.TITLE')}
            description={t('MESSAGES.SHARE.MEMBERSHIPS.DESCRIPTION')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <PropCard
            Icon={UsersIcon}
            title={t('MESSAGES.SHARE.ITEM_LOGIN.TITLE')}
            description={t('MESSAGES.SHARE.ITEM_LOGIN.DESCRIPTION')}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
