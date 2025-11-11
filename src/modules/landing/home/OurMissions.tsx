import type { JSX, ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import {
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { NS } from '@/config/constants';

function Mission({
  title,
  buttonText,
  children,
  imgSrc,
  buttonLink,
}: {
  title: string;
  buttonText: string;
  children: ReactNode;
  imgSrc: string;
  buttonLink: string;
}): JSX.Element {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.only('md'));

  return (
    <Grid size={{ xs: 12, md: 12, lg: 4 }} my={2}>
      <Stack
        px={{ xs: 3, lg: 3 }}
        py={{ xs: 3, lg: 5 }}
        mx={{ xs: 0, lg: 2 }}
        // make the "card"
        bgcolor="white"
        borderRadius={8}
        gap={{ xs: 0, sm: 3, lg: 2 }}
        justifyContent="space-between"
        height="100%"
        direction={{ xs: 'column', md: 'row', lg: 'column' }}
      >
        <Stack alignItems="center" justifyContent="center">
          <img
            src={imgSrc}
            alt={title}
            style={{
              minWidth: '150px',
              width: '100%',
              maxWidth: '300px',
              margin: '0 24px',
            }}
          />
        </Stack>
        <Stack gap={3} height="100%" justifyContent="space-between">
          <Stack gap={3}>
            <Typography
              variant="h3"
              color="primary"
              textAlign={{ xs: 'center', md: 'left', lg: 'center' }}
            >
              {title}
            </Typography>
            {children}
          </Stack>
          <Stack>
            <ButtonLink
              sx={isMd ? { width: 'fit-content' } : {}}
              to={buttonLink}
              variant="contained"
              size="large"
              color="secondary"
            >
              {buttonText}
            </ButtonLink>
          </Stack>
        </Stack>
      </Stack>
    </Grid>
  );
}

export function OurMissions(): JSX.Element {
  const { t } = useTranslation(NS.Landing, { keyPrefix: 'HOME' });

  return (
    <Stack gap={{ xs: 1, md: 2 }} maxWidth="lg" component="section">
      <Typography variant="h2" textAlign="center" color="primary">
        {t('MISSIONS.TITLE')}
      </Typography>
      <Grid container justifyItems={{ lg: 'center' }}>
        <Mission
          title={t('MISSIONS.RESEARCH.TITLE')}
          buttonText={t('MISSIONS.RESEARCH.BUTTON_TEXT')}
          imgSrc="/illustration/landing-mission-research.svg"
          buttonLink="/contact-us"
        >
          <Typography>
            <Trans
              i18nKey="MISSIONS.RESEARCH.DESCRIPTION_1"
              t={t}
              components={{ a: <a href="http://localhost:3000">link</a> }}
            />
          </Typography>
          <Typography>{t('MISSIONS.RESEARCH.DESCRIPTION_2')}</Typography>
        </Mission>
        <Mission
          title={t('MISSIONS.PRIVACY.TITLE')}
          buttonText={t('MISSIONS.PRIVACY.BUTTON_TEXT')}
          imgSrc="/illustration/landing-mission-privacy.svg"
          buttonLink="/about-us"
        >
          {t('MISSIONS.PRIVACY.DESCRIPTION')}
        </Mission>
        <Mission
          title={t('MISSIONS.OPEN.TITLE')}
          buttonText={t('MISSIONS.OPEN.BUTTON_TEXT')}
          imgSrc="/illustration/landing-mission-open.svg"
          buttonLink="/policy"
        >
          <Typography>{t('MISSIONS.OPEN.DESCRIPTION_1')}</Typography>
          <Typography>{t('MISSIONS.OPEN.DESCRIPTION_2')}</Typography>
        </Mission>
      </Grid>
    </Stack>
  );
}
