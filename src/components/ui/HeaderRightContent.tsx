import { useTranslation } from 'react-i18next';

import { Stack } from '@mui/material';

import { useAuth } from '@/AuthContext';
import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import { HEADER_MEMBER_MENU_BUTTON_ID } from '@/config/selectors';
import { UserPopupMenu } from '@/ui/UserPopupMenu';

import { MentionButton } from '../chatbox/Mentions/MentionButton';
import { ButtonLink } from './ButtonLink';
import LanguageSwitch from './LanguageSwitch';
import MemberAvatar from './MemberAvatar';

export function HeaderRightContent() {
  const { i18n, t } = useTranslation(NS.Common, { keyPrefix: 'USER_SWITCH' });
  const { isAuthenticated, user, logout } = useAuth();

  const { mutate } = mutations.useEditCurrentMember();

  const handleLanguageChange = (lang: string) => {
    mutate({ extra: { lang } });
    i18n.changeLanguage(lang);
  };

  if (isAuthenticated) {
    return (
      <Stack direction="row" gap={2} alignItems="center">
        <MentionButton color="white" badgeColor="primary" />

        <LanguageSwitch
          lang={i18n.languages[0]}
          onChange={handleLanguageChange}
        />

        <UserPopupMenu
          avatarButtonId={HEADER_MEMBER_MENU_BUTTON_ID}
          signOut={logout}
          user={user}
          avatar={<MemberAvatar id={user.id} />}
          dataUmamiEvent="user-menu"
          signOutText={t('LOG_OUT')}
        />
      </Stack>
    );
  }

  // in case the user is not authenticated, we show a login button
  return <ButtonLink to="/auth/login">{t('LOG_IN')}</ButtonLink>;
}
