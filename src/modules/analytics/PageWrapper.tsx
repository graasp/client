import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { styled, useTheme } from '@mui/material';

import { Context } from '@graasp/sdk';
import {
  AnalyticsIcon,
  Main,
  Platform,
  PlatformSwitch,
  useMobileView,
} from '@graasp/ui';

import { Link, getRouteApi } from '@tanstack/react-router';

import { UserSwitchWrapper } from '@/components/ui/UserSwitchWrapper';
import { NS } from '@/config/constants';
import { GRAASP_BUILDER_HOST, GRAASP_LIBRARY_HOST } from '@/config/env';

import { AnalyticsSidebar } from './AnalyticsSidebar';

const itemRoute = getRouteApi('/analytics/items/$itemId');

const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
}));

const LinkComponent = ({ children }: { children: ReactNode }): JSX.Element => (
  <StyledLink to="/account">{children}</StyledLink>
);
export function PageWrapper({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  const { t } = useTranslation(NS.Analytics);
  const { itemId } = itemRoute.useParams();
  const { isMobile } = useMobileView();
  const theme = useTheme();
  const platformProps = {
    [Platform.Builder]: {
      href: `${GRAASP_BUILDER_HOST}/items/${itemId}`,
    },
    [Platform.Player]: {
      href: `/player/${itemId}/${itemId}`,
    },
    [Platform.Library]: {
      href: GRAASP_LIBRARY_HOST,
    },
    [Platform.Analytics]: {
      disabled: true,
    },
  };

  return (
    <Main
      context={Context.Analytics}
      drawerContent={<AnalyticsSidebar itemId={itemId} />}
      drawerOpenAriaLabel={t('DRAWER_OPEN_ARIA')}
      headerRightContent={<UserSwitchWrapper />}
      PlatformComponent={
        <PlatformSwitch
          CustomMobileIcon={AnalyticsIcon}
          platformsProps={platformProps}
          color={isMobile ? theme.palette.primary.main : 'white'}
          accentColor={isMobile ? 'white' : theme.palette.primary.main}
        />
      }
      LinkComponent={LinkComponent}
    >
      {children}
    </Main>
  );
}
