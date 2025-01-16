import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, styled, useTheme } from '@mui/material';

import { AccountType, Context } from '@graasp/sdk';

import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useParams,
} from '@tanstack/react-router';

import { UserSwitchWrapper } from '@/components/ui/UserSwitchWrapper';
import { NS } from '@/config/constants';
import { GRAASP_LIBRARY_HOST } from '@/config/env';
import { hooks } from '@/config/queryClient';
import {
  APP_NAVIGATION_PLATFORM_SWITCH_ID,
  HEADER_APP_BAR_ID,
} from '@/config/selectors';
import GraaspMain from '@/ui/Main/Main';
import PlatformSwitch from '@/ui/PlatformSwitch/PlatformSwitch';
import { Platform } from '@/ui/PlatformSwitch/hooks';
import { useMobileView } from '@/ui/hooks/useMobileView';

import { MemberValidationBanner } from '~builder/components/alerts/MemberValidationBanner';
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

const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
}));
const LinkComponent = ({ children }: { children: ReactNode }) => (
  <StyledLink
    data-umami-event="header-home-link"
    data-umami-event-context={Context.Builder}
    to="/account"
  >
    {children}
  </StyledLink>
);

function RouteComponent() {
  const { t } = useTranslation(NS.Builder);
  const theme = useTheme();
  const { isMobile } = useMobileView();
  const { data: currentMember } = hooks.useCurrentMember();

  const { itemId } = useParams({ strict: false });

  const platformProps = {
    [Platform.Builder]: {
      href: '/',
    },
    [Platform.Player]: {
      href: `/player/${itemId}/${itemId}`,
    },
    [Platform.Library]: {
      href: GRAASP_LIBRARY_HOST,
    },
    [Platform.Analytics]: {
      href: `/analytics/items/${itemId}`,
    },
  };

  const rightContent = (
    <Stack direction="row" alignItems="center">
      {/* <NotificationButton /> */}
      <UserSwitchWrapper />
    </Stack>
  );
  return (
    <GraaspMain
      open={
        /**
         * only override the open prop when user is not logged in
         * we want to keep the default behavior when the user is logged in
         * we close the drawer if the user is a guest
         */
        currentMember?.type === AccountType.Individual ? undefined : false
      }
      context={Context.Builder}
      headerId={HEADER_APP_BAR_ID}
      drawerOpenAriaLabel={t('ARIA_OPEN_DRAWER')}
      headerRightContent={rightContent}
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
      <Outlet />
    </GraaspMain>
  );
}
