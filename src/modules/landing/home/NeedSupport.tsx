import { Trans, useTranslation } from 'react-i18next';

import { Button, Stack, Typography, useTheme } from '@mui/material';

import { HeadsetIcon } from 'lucide-react';

import { NS } from '@/config/constants';

import { strongTag } from './constants';

export function NeedSupport() {
  const theme = useTheme();
  const { t } = useTranslation(NS.Landing, { keyPrefix: 'HOME.NEED_SUPPORT' });

  return (
    <Stack
      maxWidth="md"
      gap={3}
      alignItems="center"
      bgcolor="#E4DFFF"
      p={{ xs: 4, md: 6 }}
      width="100%"
      borderRadius={{ xs: 10, md: 15 }}
      direction={{ xs: 'column', md: 'row' }}
    >
      <Stack
        width="100%"
        alignItems={{ xs: 'center', md: 'flex-start' }}
        gap={3}
        direction="row"
      >
        <HeadsetIcon color={theme.palette.primary.main} size={140} />
        <Stack gap={2}>
          <Typography variant="h2" color="primary">
            {t('TITLE')}
          </Typography>
          <Typography>
            <Trans
              t={t}
              i18nKey={'DESCRIPTION'}
              components={{
                b: strongTag,
              }}
            />
          </Typography>
          <Button
            href="mailto:support@graasp.org"
            component="a"
            sx={{ maxWidth: 200 }}
            variant="contained"
            color="secondary"
            data-umami-event="need-support-button"
          >
            {t('BUTTON_TEXT')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
