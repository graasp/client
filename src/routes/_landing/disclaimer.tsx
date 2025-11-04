import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { createFileRoute } from '@tanstack/react-router';

import { NS } from '@/config/constants';

import BodyWrapper from '~landing/components/BodyWrapper';

export const Route = createFileRoute('/_landing/disclaimer')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation(NS.Landing, { keyPrefix: 'DISCLAIMER' });
  return (
    <BodyWrapper>
      <Stack direction="column" maxWidth="md" gap={8} mt={8}>
        <Typography variant="h1" color="primary">
          {t('TITLE')}
        </Typography>
        <Typography>{t('TEXT')}</Typography>
      </Stack>
    </BodyWrapper>
  );
}
