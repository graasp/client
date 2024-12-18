import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { NS } from '@/config/constants';

function PresentationVideoSection() {
  const { t } = useTranslation(NS.Landing, {
    keyPrefix: 'ABOUT_US.PRESENTATION_VIDEO',
  });

  return (
    <Stack
      maxWidth={{ xs: '600px', md: 'lg' }}
      width="100%"
      alignItems={{ xs: 'center', md: 'flex-start' }}
      gap={4}
    >
      <Typography variant="h2" color="primary">
        {t('TITLE')}
      </Typography>

      <Stack alignSelf="center">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video width="420" height="340" controls>
          <source src="movie.mp4" type="video/mp4" />
          <source src="movie.ogg" type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </Stack>

      <Stack direction="row" alignSelf="center" gap={2}>
        <ButtonLink variant="contained" to="/auth/register">
          {t('JOIN_BUTTON_TEXT')}
        </ButtonLink>
        <ButtonLink variant="contained" color="secondary" to="/library">
          {t('LIBRARY_BUTTON_TEXT')}
        </ButtonLink>
      </Stack>
    </Stack>
  );
}

export default PresentationVideoSection;
