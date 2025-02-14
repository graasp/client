import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { Outlet, createFileRoute, useMatches } from '@tanstack/react-router';

import { NS } from '@/config/constants';
import { MenuTabs } from '@/modules/home/MenuTabs';

export const Route = createFileRoute('/_memberOnly/_homeLayout')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation(NS.Common, { keyPrefix: 'PAGE_TITLES' });
  const matches = useMatches();
  const titleKey = matches.find((m) => m.staticData.pageTitle)?.staticData
    .pageTitle;
  return (
    <Stack gap={4} alignItems="center">
      <Stack direction="row" width="100%" justifyItems="flex-end">
        {titleKey && <Typography variant="h1">{t(titleKey)}</Typography>}
        <MenuTabs />
      </Stack>
      <Stack width="100%" direction="column" gap={2}>
        <Outlet />
      </Stack>
    </Stack>
  );
}
