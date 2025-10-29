import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';

import { CustomLink } from '@/components/ui/CustomLink';
import { NS } from '@/config/constants';
import { LOG_IN_HEADER_ID } from '@/config/selectors';

import { LeftContentContainer } from '~auth/components/LeftContentContainer';
import { FormHeader } from '~auth/components/common/FormHeader';
import { MagicLinkLoginForm } from '~auth/components/signIn/MagicLinkLoginForm';
import { PasswordLoginForm } from '~auth/components/signIn/PasswordLoginForm';
import { useLoginMode } from '~auth/components/signIn/useLoginMode';

const loginSearchSchema = z.object({
  url: z.string().url().optional(),
});

export const Route = createFileRoute('/auth/login')({
  validateSearch: zodValidator(loginSearchSchema),
  component: LoginRoute,
});

function LoginRoute() {
  const search = Route.useSearch();
  const { t } = useTranslation(NS.Auth);

  const { mode } = useLoginMode();

  return (
    <LeftContentContainer>
      <Stack direction="column" alignItems="center" gap={3}>
        <FormHeader id={LOG_IN_HEADER_ID} title={t('LOGIN_TITLE')} />
        {mode === 'magic-link' ? (
          <MagicLinkLoginForm search={search} />
        ) : (
          <PasswordLoginForm search={search} />
        )}
        <Typography variant="body2">
          {t('SIGN_UP_LINK_CATCH_TEXT')}{' '}
          <CustomLink
            to="/auth/register"
            search={search}
            sx={{ fontWeight: 'bold', textDecoration: 'none' }}
          >
            {t('SIGN_UP_LINK_TEXT')}
          </CustomLink>
        </Typography>
      </Stack>
    </LeftContentContainer>
  );
}
