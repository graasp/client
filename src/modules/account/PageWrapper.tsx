import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { styled, useTheme } from '@mui/material';

import { Context } from '@graasp/sdk';
import {
  Main,
  Platform,
  PlatformSwitch,
  PlatformSwitchProps,
  useMobileView,
} from '@graasp/ui';

import { Link } from '@tanstack/react-router';
import { UserRoundIcon } from 'lucide-react';

import { UserSwitchWrapper } from '@/components/ui/UserSwitchWrapper';
import { NS } from '@/config/constants';
import { GRAASP_BUILDER_HOST, GRAASP_LIBRARY_HOST } from '@/config/env';
import { ACCOUNT_HOME_PATH } from '@/config/paths';

import { MainMenu } from './MainMenu';

const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
}));

const LinkComponent = ({ children }: { children: ReactNode }): JSX.Element => (
  <StyledLink to={ACCOUNT_HOME_PATH}>{children}</StyledLink>
);

const AccountIcon: PlatformSwitchProps['CustomMobileIcon'] = (props) => (
  <UserRoundIcon {...props} />
);

export function PageWrapper({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  const { t } = useTranslation(NS.Account);
  const theme = useTheme();
  const { isMobile } = useMobileView();
  const platformProps = {
    [Platform.Builder]: {
      href: '/builder',
    },
    [Platform.Player]: {
      href: '/player',
    },
    [Platform.Library]: {
      href: GRAASP_LIBRARY_HOST,
    },
    [Platform.Analytics]: {
      href: '/analytics',
    },
  };

  return (
    <Main
      open
      context={Context.Account}
      drawerContent={<MainMenu />}
      drawerOpenAriaLabel={t('DRAWER_OPEN_ARIA_LABEL')}
      LinkComponent={LinkComponent}
      PlatformComponent={
        <PlatformSwitch
          CustomMobileIcon={AccountIcon}
          platformsProps={platformProps}
          color={isMobile ? theme.palette.primary.main : 'white'}
          accentColor={isMobile ? 'white' : theme.palette.primary.main}
        />
      }
      headerRightContent={<UserSwitchWrapper />}
    >
      {children}
    </Main>
  );
}
