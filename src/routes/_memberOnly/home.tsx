import { Divider, Stack } from '@mui/material';

import { createFileRoute } from '@tanstack/react-router';

import { MenuTabs } from '@/modules/home/MenuTabs';

import { MemberCard } from '~account/home/MemberCard';
import { RecentItems } from '~account/home/recentItems/RecentItems';

export const Route = createFileRoute('/_memberOnly/home')({
  component: HomeRoute,
});

function HomeRoute() {
  return (
    <Stack gap={4} alignItems="center">
      <MemberCard />
      <MenuTabs />
      <Divider flexItem />
      <RecentItems />
    </Stack>
  );
}
