import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Grid2 } from '@mui/material';

import { createFileRoute } from '@tanstack/react-router';

import { NS } from '@/config/constants';

import ChartsAlerts from '~analytics/charts-layout/ChartsAlerts';
import ChartsHeader from '~analytics/charts-layout/ChartsHeader';
import ActionsByUserChart from '~analytics/charts/ActionsByUserChart';
import UsersByActionByChart from '~analytics/charts/UsersByActionChart';
import SectionTitle from '~analytics/common/SectionTitle';

export const Route = createFileRoute('/analytics/items/$itemId/users')({
  component: UsersAnalyticPage,
});

function UsersAnalyticPage(): JSX.Element {
  const { t } = useTranslation(NS.Analytics);
  return (
    <>
      <ChartsHeader />
      <ChartsAlerts />
      <SectionTitle title={t('USERS_ANALYTICS_TITLE')} />
      <UsersAnalytics />
    </>
  );
}

function UsersAnalytics(): JSX.Element {
  return (
    <Grid2 container width="100%">
      <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
        <ActionsByUserChart />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
        <UsersByActionByChart />
      </Grid2>
    </Grid2>
  );
}
