import { useTranslation } from 'react-i18next';

import { Box, Stack, Typography } from '@mui/material';

import { createFileRoute } from '@tanstack/react-router';

import { TypographyLink } from '@/components/ui/TypographyLink';
import { NS } from '@/config/constants';

export const Route = createFileRoute('/_landing/terms')({
  component: RouteComponent,
});

const EPFL_DISCLAIMER_LINK =
  'https://www.epfl.ch/about/overview/regulations-and-guidelines/disclaimer/';

function RouteComponent() {
  const { t } = useTranslation(NS.Landing, { keyPrefix: 'TERMS' });
  return (
    <Stack direction="column" gap={8} maxWidth="md" mt={8}>
      <Typography variant="h1" color="primary">
        {t('TITLE')}
      </Typography>
      <Box>
        <Typography>{t('INTRODUCTION')}</Typography>
        <Stack component="ol" gap={1}>
          <Typography component="li">{t('TERM_1')}</Typography>
          <Typography component="li">{t('TERM_2')}</Typography>
          <Typography component="li">{t('TERM_3')}</Typography>
          <Typography component="li">{t('TERM_4')}</Typography>
          <Typography component="li">{t('TERM_5')}</Typography>
        </Stack>
        <Typography>{t('FINAL_NOTE')}</Typography>
      </Box>
      <Box>
        <Typography variant="h4" color="primary">
          {t('REFERENCES')}
        </Typography>
        <ul>
          <li>
            <TypographyLink to="/disclaimer">
              {t('GRAASP_LEGAL_DISCLAIMER.TEXT')}
            </TypographyLink>
          </li>
          <li>
            <Typography component="a" href={EPFL_DISCLAIMER_LINK}>
              {t('EPFL_LEGAL_DISCLAIMER.TEXT')}
            </Typography>
          </li>
        </ul>
      </Box>
    </Stack>
  );
}
