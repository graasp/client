import { Stack, Typography } from '@mui/material';

import { useButtonColor } from '@graasp/ui';

import { Link } from '@tanstack/react-router';
import { RadarIcon } from 'lucide-react';

import { useAccountTranslation } from '@/config/i18n';
import { LANDING_PAGE_PATH } from '@/config/paths';
import {
  GO_TO_HOME_LINK_ID,
  NOT_FOUND_MESSAGE_ID,
  NOT_FOUND_TEXT_ID,
} from '@/config/selectors';

export function NotFoundComponent(): JSX.Element {
  const { t } = useAccountTranslation();
  const { color } = useButtonColor('primary');
  return (
    <Stack gap={2} alignItems="center" justifyContent="center" height="100vh">
      <Stack direction="row" alignItems="center" gap={2}>
        <RadarIcon color={color} size={60} />
        <Typography variant="h1" id={NOT_FOUND_TEXT_ID} color="primary">
          {t('NOT_FOUND_PAGE_TEXT')}
        </Typography>
      </Stack>
      <Typography variant="body1" id={NOT_FOUND_MESSAGE_ID}>
        {t('NOT_FOUND_PAGE_MESSAGE')}
      </Typography>
      <Link to={LANDING_PAGE_PATH} id={GO_TO_LANDING_ID}>
        {t('GO_TO_LANDING_TEXT')}
      </Link>
    </Stack>
  );
}
