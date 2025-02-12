import { type ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import {
  Alert,
  Box,
  Container,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

import { AccountType, Context } from '@graasp/sdk';

import {
  Outlet,
  createFileRoute,
  redirect,
  useParams,
} from '@tanstack/react-router';
import { ClipboardPenIcon } from 'lucide-react';

import { useAuth } from '@/AuthContext';
import { HeaderRightContent } from '@/components/ui/HeaderRightContent';
import { NS } from '@/config/constants';
import { GRAASP_LIBRARY_HOST } from '@/config/env';
import {
  APP_NAVIGATION_PLATFORM_SWITCH_ID,
  HEADER_APP_BAR_ID,
  PREVENT_GUEST_MESSAGE_ID,
} from '@/config/selectors';
import { HomeHeaderLink } from '@/ui/Main/HomeHeaderLink';
import GraaspMain from '@/ui/Main/Main';
import PlatformSwitch from '@/ui/PlatformSwitch/PlatformSwitch';
import { Platform } from '@/ui/PlatformSwitch/hooks';
import Button from '@/ui/buttons/Button/Button';
import { useMobileView } from '@/ui/hooks/useMobileView';

import { MemberValidationBanner } from '~builder/components/alerts/MemberValidationBanner';
import { FilterItemsContextProvider } from '~builder/components/context/FilterItemsContext';
import { MainMenu } from '~builder/components/main/MainMenu';

export const Route = createFileRoute('/builder/_layout')({
  beforeLoad({ context }) {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        search: { url: window.location.href },
      });
    }
  },
  component: RouteComponent,
});

const LinkComponent = ({ children }: { children: ReactNode }) => (
  <HomeHeaderLink
    // data-umami-event="header-home-link"
    // data-umami-event-context={Context.Builder}
    to="/home"
  >
    {children}
  </HomeHeaderLink>
);

function RouteComponent() {
  const { user } = useAuth();
  const { t } = useTranslation(NS.Builder);
  const theme = useTheme();
  const { isMobile } = useMobileView();

  const { itemId } = useParams({ strict: false });

  if (user?.type === AccountType.Guest) {
    return <GuestsNotAllowed />;
  }

  const platformProps = {
    [Platform.Builder]: {
      href: '/builder',
    },
    [Platform.Player]: itemId
      ? {
          href: `/player/${itemId}/${itemId}`,
        }
      : { disabled: true },
    [Platform.Library]: {
      href: GRAASP_LIBRARY_HOST,
    },
    [Platform.Analytics]: itemId
      ? {
          href: `/analytics/items/${itemId}`,
        }
      : { disabled: true },
  };

  return (
    <GraaspMain
      open={
        /**
         * only override the open prop when user is not logged in
         * we want to keep the default behavior when the user is logged in
         * we close the drawer if the user is a guest
         */
        user?.type === AccountType.Individual ? undefined : false
      }
      context={Context.Builder}
      headerId={HEADER_APP_BAR_ID}
      drawerOpenAriaLabel={t('ARIA_OPEN_DRAWER')}
      headerRightContent={<HeaderRightContent />}
      drawerContent={<MainMenu />}
      LinkComponent={LinkComponent}
      PlatformComponent={
        <PlatformSwitch
          id={APP_NAVIGATION_PLATFORM_SWITCH_ID}
          selected={Platform.Builder}
          platformsProps={platformProps}
          color={isMobile ? theme.palette.primary.main : 'white'}
          accentColor={isMobile ? 'white' : theme.palette.primary.main}
        />
      }
    >
      <MemberValidationBanner />
      <FilterItemsContextProvider>
        <Stack
          id="toto"
          width="100%"
          height="100%"
          maxWidth="xl"
          p={2}
          m="auto"
        >
          <Outlet />
        </Stack>
      </FilterItemsContextProvider>
    </GraaspMain>
  );
}

function GuestsNotAllowed() {
  const { user, logout } = useAuth();
  const { t } = useTranslation(NS.Builder);
  if (user) {
    return (
      <Stack height="100%" justifyContent="center" alignItems="center">
        <Container maxWidth="md">
          <Alert severity="info" id={PREVENT_GUEST_MESSAGE_ID}>
            <Typography>
              <Trans
                t={t}
                i18nKey={'GUEST_LIMITATION_TEXT'}
                values={{
                  name: user?.name,
                }}
                components={{ 1: <strong /> }}
              />
            </Typography>
            <Box mt={2} textAlign="center">
              <Button
                startIcon={<ClipboardPenIcon />}
                variant="contained"
                onClick={() => logout()}
              >
                {t('GUEST_SIGN_OUT_BUTTON')}
              </Button>
            </Box>
          </Alert>
        </Container>
      </Stack>
    );
  }
}
