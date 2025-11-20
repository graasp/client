import { useTranslation } from 'react-i18next';

import { Button, Stack, Typography } from '@mui/material';

import { NS } from '@/config/constants';

export function NewsLetter() {
  const { t } = useTranslation(NS.Landing, { keyPrefix: 'NEWSLETTER' });
  return (
    <Stack
      maxWidth={{ xs: '600px', md: 'lg' }}
      gap={3}
      alignItems="center"
      bgcolor="#E4DFFF"
      p={{ xs: 4, md: 8 }}
      px={{ xs: 5, md: 10 }}
      width="100%"
      borderRadius={{ xs: 10, md: 20 }}
      direction={{ xs: 'column', md: 'row' }}
    >
      <Stack
        width="100%"
        textAlign={{ xs: 'center', md: 'left' }}
        alignItems={{ xs: 'center', md: 'flex-start' }}
        gap={1}
      >
        <Typography variant="h2" color="primary">
          {t('TITLE')}
        </Typography>
        <Typography>{t('DESCRIPTION')}</Typography>
      </Stack>
      <Stack gap={2} width="100%">
        <Button
          variant="contained"
          color="primary"
          href="https://forms.gle/QAUYtioZvDtKwozXA"
        >
          {t('BUTTON_TEXT')}
        </Button>
      </Stack>
    </Stack>
  );
}
