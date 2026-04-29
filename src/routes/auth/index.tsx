import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { CircleUserIcon, UserPlusIcon } from 'lucide-react';
import { z } from 'zod';

import { ButtonLink } from '@/components/ui/ButtonLink';
import { TypographyLink } from '@/components/ui/TypographyLink';
import { NS } from '@/config/constants';
import { useButtonColor } from '@/ui/buttons/hooks';

const authErrorSchema = z.object({
  error: z.string().optional(),
});

export const Route = createFileRoute('/auth/')({
  validateSearch: zodValidator(authErrorSchema),
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  const { t } = useTranslation(NS.Auth);
  const { color: primaryColor } = useButtonColor('primary');

  if (search.error) {
    return (
      <Stack gap={2} p={2} alignItems="center" width="100%">
        <AuthError error={search.error} />
        <ButtonLink to="/auth/login" variant="contained" color="primary">
          {t('LOGIN_AGAIN')}
        </ButtonLink>
      </Stack>
    );
  }

  return (
    <Stack
      direction="column"
      gap={6}
      m="auto"
      p={2}
      alignItems="center"
      maxWidth="md"
      width="100%"
    >
      <Stack gap={2} alignItems="center" width="100%">
        <Typography variant="h2">{t('WELCOME')}</Typography>
        <Typography variant="body1">{t('WELCOME_MESSAGE')}</Typography>
      </Stack>
      <Stack
        direction="row"
        gap={4}
        justifyContent="space-between"
        width="100%"
      >
        <Stack flex="1 0 1" alignItems="center" gap={1} width="100%">
          <CircleUserIcon size="34" color={primaryColor} />
          <Typography variant="body1">{t('I_HAVE_AN_ACCOUNT')}</Typography>
          <ButtonLink variant="contained" to="/auth/login">
            {t('LOGIN')}
          </ButtonLink>
        </Stack>
        <Stack flex="1 0 1" alignItems="center" gap={1} width="100%">
          <UserPlusIcon size="34" color={primaryColor} />
          <Typography variant="body1">{t('I_DONT_HAVE_AN_ACCOUNT')}</Typography>
          <ButtonLink variant="contained" to="/auth/register">
            {t('CREATE_ACCOUNT')}
          </ButtonLink>
        </Stack>
      </Stack>
      <TypographyLink to="/" variant="body1" color="text.secondary">
        {t('BACK_TO_HOME')}
      </TypographyLink>
    </Stack>
  );
}

function AuthError({ error }: { error: string }) {
  const { t } = useTranslation(NS.Messages);
  if (error === 'MEMBER_NOT_FOUND') {
    return <div>{t('MEMBER_NOT_FOUND')}</div>;
  }
  if (error === 'Unauthorized member') {
    return <div>{t('MEMBER_UNAUTHORIZED')}</div>;
  }
  if (error === 'TOKEN_EXPIRED') {
    return <div>{t('TOKEN_EXPIRED')}</div>;
  }
  return <div>{t('UNEXPECTED_LOGIN_ERROR')}</div>;
}
