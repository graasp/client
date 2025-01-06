import { Trans, useTranslation } from 'react-i18next';

import { Stack, Typography, styled } from '@mui/material';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { Image } from '@/components/ui/StyledImages';
import { NS } from '@/config/constants';

export function TitleSection() {
  const { t } = useTranslation(NS.Landing, { keyPrefix: 'FEATURES' });
  return (
    <HeaderContainer maxWidth="lg" gap={8} mt={8}>
      <Stack
        flex={{ md: 1 }}
        maxHeight={{ xs: '15rem', md: 'fit-content' }}
        maxWidth={{ xs: '32rem' }}
        borderRadius={4}
        overflow="hidden"
      >
        <Image
          src="/illustration/features.webp"
          sx={{
            // override the "show top of image" behavior of the Image component
            objectPosition: 'unset',
          }}
        />
      </Stack>
      <Stack
        gap={4}
        alignItems={{ xs: 'center', md: 'flex-start' }}
        flex={{ md: 2 }}
      >
        <Typography variant="h1" color="primary">
          {t('TITLE')}
        </Typography>
        <Typography>
          <Trans
            i18nKey="DESCRIPTION"
            t={t}
            components={{ bold: <strong /> }}
          />
        </Typography>
        <Typography>{t('CALL_TO_ACTION_TEXT')}</Typography>
        <ButtonLink
          variant="contained"
          color="primary"
          sx={{ width: 'fit-content' }}
          to="/auth/register"
        >
          {t('CALL_TO_ACTION_BUTTON_TEXT')}
        </ButtonLink>
      </Stack>
    </HeaderContainer>
  );
}

const HeaderContainer = styled(Stack)(({ theme }) => ({
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  maxWidth: '60ch',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row-reverse',
    textAlign: 'unset',
    maxWidth: theme.breakpoints.values.lg,
  },
}));
