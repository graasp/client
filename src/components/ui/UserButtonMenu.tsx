import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack } from '@mui/material';

import { useAuth } from '@/AuthContext';
import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import { HEADER_MEMBER_MENU_BUTTON_ID } from '@/config/selectors';
import UserSwitch from '@/ui/UserSwitch';

import { ButtonLink } from './ButtonLink';
import LanguageSwitch from './LanguageSwitch';
import MemberAvatar from './MemberAvatar';

export function UserButtonMenu(): JSX.Element | null {
  const { i18n, t } = useTranslation(NS.Common, { keyPrefix: 'USER_SWITCH' });
  const { isAuthenticated, user, logout } = useAuth();

  const { mutate } = mutations.useEditCurrentMember();

  const handleLanguageChange = (lang: string) => {
    mutate({ extra: { lang } });
    i18n.changeLanguage(lang);
  };

  if (isAuthenticated) {
    return (
      <Stack direction="row" gap={2}>
        <LanguageSwitch
          lang={i18n.languages[0]}
          onChange={handleLanguageChange}
        />

        <UserSwitch
          buttonId={HEADER_MEMBER_MENU_BUTTON_ID}
          signOut={logout}
          currentMember={user}
          avatar={<MemberAvatar id={user.id} />}
          dataUmamiEvent="user-menu"
          signOutText={t('LOG_OUT')}
        />
      </Stack>
    );
  }
  return <ButtonLink to="/auth/login">{t('LOG_IN')}</ButtonLink>;
}
