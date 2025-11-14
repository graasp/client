import { useTranslation } from 'react-i18next';

import { Stack, Typography, useTheme } from '@mui/material';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { NS } from '@/config/constants';
import GraaspLogo from '@/ui/GraaspLogo/GraaspLogo';

function CallToAction() {
  const theme = useTheme();

  const { t } = useTranslation(NS.Landing, {
    keyPrefix: 'HOME.CALL_TO_ACTION',
  });

  return (
    <Stack alignItems="center" gap={4} maxWidth="700px" mx="auto">
      <Stack direction="row" alignItems="center" gap={2}>
        <GraaspLogo height={40} sx={{ fill: theme.palette.primary.main }} />
        <Typography variant="h1" color="primary" component="h3">
          Graasp
        </Typography>
      </Stack>
      <Typography variant="h2" textAlign="center" lineHeight={1.5}>
        {t('TEXT')}
      </Typography>
      <ButtonLink
        variant="contained"
        size="large"
        to="/auth/register"
        dataUmamiEvent="call-to-action-register-button"
        sx={{ px: 8 }}
      >
        {t('BUTTON_TEXT')}
      </ButtonLink>
    </Stack>
  );
}

export default CallToAction;
