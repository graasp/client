import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Link } from '@mui/material';

import { useLocation } from '@tanstack/react-router';

import { useAuth } from '@/AuthContext';
import { NS } from '@/config/constants';
import { API_HOST } from '@/config/env';
import { ACCOUNT_HOME_PATH } from '@/config/paths';
import { hooks, mutations } from '@/config/queryClient';
import { HEADER_MEMBER_MENU_BUTTON_ID } from '@/config/selectors';
import { UserSwitchWrapper as GraaspUserSwitch } from '@/ui/UserSwitch/UserSwitchWrapper';

import LanguageSwitch from './LanguageSwitch';
import MemberAvatar from './MemberAvatar';

type Props = {
  ButtonContent?: JSX.Element;
};

export function UserButtonMenu({
  ButtonContent,
}: Readonly<Props>): JSX.Element | null {
  const { i18n } = useTranslation(NS.Account);
  const { isAuthenticated, user, logout } = useAuth();

  const { data: member, isLoading } = hooks.useCurrentMember();
  const { mutate } = mutations.useEditCurrentMember();

  const handleLanguageChange = (lang: string) => {
    mutate({ extra: { lang } });
    i18n.changeLanguage(lang);
  };

  if (isAuthenticated) {
    return (
      <>
        <LanguageSwitch
          lang={i18n.languages[0]}
          onChange={handleLanguageChange}
        />

        <GraaspUserSwitch
          buttonId={HEADER_MEMBER_MENU_BUTTON_ID}
          ButtonContent={ButtonContent}
          signOut={logout}
          currentMember={member}
          isCurrentMemberLoading={isLoading}
          avatar={<MemberAvatar id={user.id} />}
          profilePath={ACCOUNT_HOME_PATH}
          redirectPath="/auth/login"
          userMenuItems={[]}
        />
        <LogoutButton />
      </>
    );
  }
  return null;
}

function LogoutButton() {
  const location = useLocation();
  const redirectionURL = new URL('/logout', API_HOST);
  redirectionURL.searchParams.set(
    'url',
    new URL(location.href, window.location.origin).toString(),
  );
  const logoutUrl = redirectionURL.toString();
  return <Link href={logoutUrl}>Logout</Link>;
}
