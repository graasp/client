import { useTranslation } from 'react-i18next';

import { Container, Stack, Typography } from '@mui/material';

import { AccountType } from '@graasp/sdk';

import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { NS } from '@/config/constants';
import { LOG_IN_PAGE_PATH } from '@/config/paths';

import { PageWrapper } from '~account/PageWrapper';

export const Route = createFileRoute('/_account')({
  beforeLoad: ({ context }) => {
    const { auth } = context;
    // check if the user is authenticated.
    // if not, redirect to `/auth/login` so the user can log in their account
    if (!auth.isAuthenticated) {
      throw redirect({
        to: LOG_IN_PAGE_PATH,
        search: {
          url: window.location.href,
        },
      });
    }
    if (auth.user.type !== AccountType.Individual) {
      return <GuestNotAuthorized />;
    }
  },
  component: () => (
    <PageWrapper>
      <Container maxWidth="xl" sx={{ p: 2, height: '100%' }}>
        <Outlet />
      </Container>
    </PageWrapper>
  ),
});

function GuestNotAuthorized() {
  const { t } = useTranslation(NS.Account, { keyPrefix: 'GUEST_AUTH' });
  return (
    <Stack height="100vh">
      <Typography variant="h1">{t('TITLE')}</Typography>
      <Typography>{t('DESCRIPTION')}</Typography>
    </Stack>
  );
}
