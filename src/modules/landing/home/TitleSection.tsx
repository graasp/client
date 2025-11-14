import type { JSX } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';

import { NS } from '@/config/constants';
import GraaspLogo from '@/ui/GraaspLogo/GraaspLogo';

import { ButtonLink } from '../../../components/ui/ButtonLink';
import { StyledBackgroundContainer } from './StyledBackgroundContainer';
import { SwitzerlandFlagIcon } from './icons/SwitzerlandFlagIcon';

export function TitleSection(): JSX.Element {
  const { t } = useTranslation(NS.Landing);
  const theme = useTheme();

  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <Stack>
      <StyledBackgroundContainer
        direction="column"
        width="100%"
        px={{ xs: 3, sm: 8 }}
        py={10}
      >
        <Stack
          component="section"
          direction="column"
          my={5}
          maxWidth="lg"
          gap={5}
          mx="auto"
        >
          <Stack
            direction="row"
            justifyItems="flex-start"
            alignItems="center"
            width="100%"
            gap={10}
          >
            <Stack direction="column" flex={{ lg: 2 }} gap={4}>
              <Stack
                direction="row"
                justifyContent={{ xs: 'center', lg: 'flex-start' }}
                alignItems="center"
                gap={1}
              >
                {isLg ? null : (
                  <GraaspLogo height={60} sx={{ fill: 'white' }} />
                )}
                <Typography
                  variant={isLg ? 'h2' : 'h1'}
                  fontSize={{ xs: 70, lg: theme.typography.h1.fontSize }}
                  component="h1"
                  color="white"
                  alignSelf={{ xs: 'center', lg: 'flex-start' }}
                >
                  {t('HOME.TITLE')}
                </Typography>
              </Stack>
              <Typography
                variant={isLg ? 'h1' : 'h2'}
                component="h2"
                color="white"
                textAlign={{ xs: 'center', lg: 'unset' }}
                alignSelf={{ xs: 'center', lg: 'flex-start' }}
                fontWeight="800"
              >
                {t('HOME.SUBTITLE')}
              </Typography>
              <Typography
                color="white"
                variant="h4"
                component="p"
                textAlign={{ xs: 'center', lg: 'unset' }}
                alignSelf={{ xs: 'center', lg: 'flex-start' }}
              >
                <Trans
                  t={t}
                  i18nKey="HOME.DESCRIPTION"
                  components={{ b: <strong /> }}
                />
              </Typography>
              <Stack
                gap={1}
                direction="row"
                alignItems="center"
                justifyContent={{ xs: 'center', lg: 'left' }}
              >
                <Typography variant="subtitle1" color="white" noWrap>
                  {t('HOME.CAPTION')}
                </Typography>
                <SwitzerlandFlagIcon />
              </Stack>
              <Stack
                id="buttonsContainer"
                direction={{ xs: 'column', sm: 'row' }}
                justifyItems="center"
                alignItems="center"
                justifyContent={{ xs: 'center', lg: 'flex-start' }}
                gap={4}
              >
                <ButtonLink
                  variant="contained"
                  to="/auth/register"
                  sx={{
                    background: 'white',
                    color: theme.palette.primary.main,
                  }}
                  dataUmamiEvent="header-register-button"
                >
                  {t('HOME.REGISTER_CALL_TO_ACTION')}
                </ButtonLink>
              </Stack>
            </Stack>
            {isLg ? (
              <Stack
                flex={{ lg: 1 }}
                maxHeight={{ xs: 400, lg: 'unset' }}
                overflow="hidden"
              >
                <GraaspLogo height={400} sx={{ fill: 'white' }} />
              </Stack>
            ) : null}
          </Stack>
        </Stack>
      </StyledBackgroundContainer>
    </Stack>
  );
}
