import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, styled, useTheme } from '@mui/material';

import { AccountType, Context } from '@graasp/sdk';
import {
  Main as GraaspMain,
  Platform,
  PlatformSwitch,
  defaultHostsMapper,
  useMobileView,
  usePlatformNavigation,
} from '@graasp/ui';

import { Link, getRouteApi } from '@tanstack/react-router';

import { NS } from '@/config/constants';
import { hooks } from '@/config/queryClient';
import {
  APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS,
  APP_NAVIGATION_PLATFORM_SWITCH_ID,
  HEADER_APP_BAR_ID,
} from '@/config/selectors';

import { HOST_MAP } from '~builder/config/externalPaths';

import { HOME_PATH } from '../../config/paths';
import { MemberValidationBanner } from '../alerts/MemberValidationBanner';
import CookiesBanner from '../common/CookiesBanner';
import UserSwitchWrapper from '../common/UserSwitchWrapper';
import MainMenu from './MainMenu';
import NotificationButton from './NotificationButton';

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
    to={HOME_PATH}
  >
    {children}
  </StyledLink>
);

// small converter for HOST_MAP into a usePlatformNavigation mapper
export const platformsHostsMap = defaultHostsMapper({
  [Platform.Player]: HOST_MAP.player,
  [Platform.Library]: HOST_MAP.library,
  [Platform.Analytics]: HOST_MAP.analytics,
});

const itemRoute = getRouteApi('/builder/_layout/items/$itemId');

type Props = { children: ReactNode };

export function PageWrapper({ children }: Readonly<Props>): JSX.Element {
  const { t } = useTranslation(NS.Builder);
  const theme = useTheme();
  const { isMobile } = useMobileView();
  const { data: currentMember } = hooks.useCurrentMember();

  const { itemId } = itemRoute.useParams();

  const getNavigationEvents = usePlatformNavigation(platformsHostsMap, itemId);
  const platformProps = {
    [Platform.Builder]: {
      id: APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS[Platform.Builder],
      href: '/',
    },
    [Platform.Player]: {
      id: APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS[Platform.Player],
      ...getNavigationEvents(Platform.Player),
    },
    [Platform.Library]: {
      id: APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS[Platform.Library],
      ...getNavigationEvents(Platform.Library),
    },
    [Platform.Analytics]: {
      id: APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS[Platform.Analytics],
      ...getNavigationEvents(Platform.Analytics),
    },
  };

  const rightContent = (
    <Stack direction="row" alignItems="center">
      <NotificationButton />
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
      <CookiesBanner />
      {children}
    </GraaspMain>
  );
}
