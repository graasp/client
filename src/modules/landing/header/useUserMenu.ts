import { useTranslation } from 'react-i18next';

import { AccountType } from '@graasp/sdk';

import { linkOptions } from '@tanstack/react-router';

import { useAuth } from '@/AuthContext';
import { NS } from '@/config/constants';

export const useUserMenu = () => {
  const { t } = useTranslation(NS.Common);
  const { t: translateLanding } = useTranslation(NS.Landing);
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return [
      linkOptions({
        to: '/auth/login',
        event: 'login-button',
        label: t('LOG_IN.BUTTON_TEXT'),
        params: {},
        highlight: false,
      }),
      linkOptions({
        to: '/auth/register',
        event: 'register-button',
        label: t('REGISTER.BUTTON_TEXT'),
        params: {},
        highlight: true,
      }),
    ];
  }
  if (isAuthenticated) {
    if (user.type === AccountType.Individual) {
      return [
        linkOptions({
          to: '/home',
          event: 'go-to-graasp-button',
          label: translateLanding('NAV.GO_TO_GRAASP'),
          params: {},
          highlight: true,
        }),
      ];
    } else {
      return [
        linkOptions({
          to: '/player/$rootId/$itemId',
          params: {
            rootId: user.item.id,
            itemId: user.item.id,
          },
          event: 'go-to-item-button',
          label: translateLanding('NAV.GO_TO_ITEM', { name: user.item.name }),
          highlight: true,
        }),
      ];
    }
  }
  return [];
};

export default useUserMenu;
