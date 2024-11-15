import { useTranslation } from 'react-i18next';

import { UserSwitchWrapper as GraaspUserSwitch } from '@graasp/ui';

import { useAuth } from '@/AuthContext';
import { NS } from '@/config/constants';

import { ACCOUNT_HOME_PATH } from '../../config/paths';
import { hooks, mutations } from '../../config/queryClient';
import MemberAvatar from './MemberAvatar';
import LanguageSwitch from './common/LanguageSwitch';

type Props = {
  ButtonContent?: JSX.Element;
};

const UserSwitchWrapper = ({ ButtonContent }: Props): JSX.Element | null => {
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
          ButtonContent={ButtonContent}
          signOut={logout}
          currentMember={member}
          isCurrentMemberLoading={isLoading}
          avatar={<MemberAvatar id={user.id} />}
          profilePath={ACCOUNT_HOME_PATH}
          redirectPath="/auth/login"
          userMenuItems={[]}
        />
      </>
    );
  }
  return null;
};

export default UserSwitchWrapper;