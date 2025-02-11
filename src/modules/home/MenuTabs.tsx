import { useTranslation } from 'react-i18next';

import { Stack } from '@mui/material';

import { useRouterState } from '@tanstack/react-router';
import { HomeIcon, LibraryBigIcon, TrashIcon } from 'lucide-react';

import { NS } from '@/config/constants';
import { MenuTab } from '@/ui/MenuTab/MenuTab';

export function MenuTabs() {
  const {
    location: { pathname },
  } = useRouterState();
  const { t } = useTranslation(NS.Home, { keyPrefix: 'MENU' });

  return (
    <Stack
      direction="row"
      gap={{ xs: 1, sm: 2 }}
      flexWrap="wrap"
      justifyContent="flex-end"
      width="100%"
    >
      <MenuTab
        icon={<HomeIcon fontSize="" />}
        title={t('HOME')}
        to="/home"
        active={pathname === '/home'}
      />
      <MenuTab
        icon={<LibraryBigIcon />}
        title={t('PUBLISHED_ITEMS')}
        to="/builder/published"
        active={pathname === '/builder/published'}
      />
      <MenuTab
        icon={<TrashIcon />}
        title={t('RECYCLED_ITEMS')}
        to="/builder/recycled"
        active={pathname === '/builder/recycled'}
      />
    </Stack>
  );
}
