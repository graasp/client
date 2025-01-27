import { type JSX, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import TouchAppIcon from '@mui/icons-material/TouchApp';
import { Grid2 } from '@mui/material';

import {
  AggregateBy,
  AggregateFunction,
  AggregateMetric,
  CountGroupBy,
} from '@graasp/sdk';

import { endOfDay } from 'date-fns/endOfDay';
import { formatISO } from 'date-fns/formatISO';

import { NS } from '@/config/constants';
import { hooks } from '@/config/queryClient';

import { DataContext } from '~analytics/context/DataProvider';
import { ViewDataContext } from '~analytics/context/ViewDataProvider';

import { DEFAULT_REQUEST_SAMPLE_SIZE } from '../constants';
import StatsCard from './StatsCard';

const StatsIcon = <TouchAppIcon fontSize="large" />;

const ActiveUsersCard = (): JSX.Element | null => {
  const { t } = useTranslation(NS.Analytics);
  const { view } = useContext(ViewDataContext);
  const { dateRange, itemId } = useContext(DataContext);

  const {
    data: aggregateData,
    isLoading: aggregateDataIsLoading,
    isError: aggregateDataIsError,
  } = hooks.useAggregateActions(itemId, {
    view,
    requestedSampleSize: DEFAULT_REQUEST_SAMPLE_SIZE,
    countGroupBy: [CountGroupBy.User, CountGroupBy.CreatedDay],
    aggregateFunction: AggregateFunction.Sum,
    aggregateMetric: AggregateMetric.ActionCount,
    aggregateBy: [AggregateBy.CreatedDay],
    startDate: formatISO(dateRange.startDate),
    endDate: formatISO(endOfDay(dateRange.endDate)),
  });

  if (aggregateDataIsLoading || aggregateDataIsError) {
    return null;
  }

  const today = new Date();
  today.setDate(today.getDate() - 1);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

  let totalActions = 0;
  let totalActionsThisMonth = 0;
  let totalActionsThisWeek = 0;
  let totalActionsToday = 0;

  aggregateData?.forEach(({ aggregateResult, createdDay }) => {
    if (!createdDay) {
      return -1;
    }
    const actionTime = new Date(createdDay).getTime();
    totalActions += aggregateResult;
    if (actionTime > today.getTime()) {
      totalActionsToday += aggregateResult;
    }
    if (actionTime > oneWeekAgo.getTime()) {
      totalActionsThisWeek += aggregateResult;
    }
    if (actionTime > oneMonthAgo.getTime()) {
      totalActionsThisMonth += aggregateResult;
    }
  });
  return (
    <Grid2 container spacing={2} p={2} flexGrow={1} flexShrink={2}>
      <StatsCard
        icon={StatsIcon}
        title={t('TOTAL_ACTIONS')}
        stat={totalActions}
      />
      <StatsCard
        icon={StatsIcon}
        title={t('ACTIONS_THIS_MONTH')}
        stat={totalActionsThisMonth}
      />
      <StatsCard
        icon={StatsIcon}
        title={t('ACTIONS_THIS_WEEK')}
        stat={totalActionsThisWeek}
      />
      <StatsCard
        icon={StatsIcon}
        title={t('ACTIONS_TODAY')}
        stat={totalActionsToday}
      />
    </Grid2>
  );
};

export default ActiveUsersCard;
