import { type JSX, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@mui/material';

import {
  AggregateBy,
  AggregateFunction,
  AggregateMetric,
  CountGroupBy,
} from '@graasp/sdk';

import { endOfDay } from 'date-fns/endOfDay';
import { formatISO } from 'date-fns/formatISO';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { NS } from '@/config/constants';
import { hooks } from '@/config/queryClient';

import { DataContext } from '~analytics/context/DataProvider';
import { ViewDataContext } from '~analytics/context/ViewDataProvider';

import ChartContainer from '../common/ChartContainer';
import ChartTitle from '../common/ChartTitle';
import {
  AVERAGE_COLOR,
  DEFAULT_REQUEST_SAMPLE_SIZE,
  GENERAL_COLOR,
} from '../constants';
import {
  filterActions,
  formatActionsByTimeOfDay,
  getActionsByTimeOfDay,
} from '../utils';
import { EmptyChart } from './EmptyChart';

const ActionsByTimeOfDayChart = (): JSX.Element | null => {
  const { t } = useTranslation(NS.Analytics);
  const { actions, selectedUsers, selectedActionTypes, dateRange, itemId } =
    useContext(DataContext);
  const { view } = useContext(ViewDataContext);
  const { direction } = useTheme();

  const {
    data: aggregateData,
    isLoading,
    isError,
  } = hooks.useAggregateActions(itemId, {
    view,
    requestedSampleSize: DEFAULT_REQUEST_SAMPLE_SIZE,
    type: selectedActionTypes,
    countGroupBy: [CountGroupBy.User, CountGroupBy.CreatedTimeOfDay],
    aggregateFunction: AggregateFunction.Avg,
    aggregateMetric: AggregateMetric.ActionCount,
    aggregateBy: [AggregateBy.CreatedTimeOfDay],
    startDate: formatISO(dateRange.startDate),
    endDate: formatISO(endOfDay(dateRange.endDate)),
  });

  if (isLoading || isError) {
    return null;
  }

  const title = t('ACTIONS_BY_TIME_OF_DAY');
  if (!aggregateData?.length) {
    return <EmptyChart chartTitle={title} />;
  }

  const formattedAggregateData = aggregateData.map((d) => ({
    averageCount: d.aggregateResult,
    timeOfDay: parseFloat(d.createdTimeOfDay ?? '0'),
  }));

  const timeOfDayEntry = formattedAggregateData.map((o) => o.timeOfDay);

  // fill with empty data for missing hour
  for (let hour = 0; hour < 24; hour += 1) {
    if (!timeOfDayEntry.includes(hour)) {
      formattedAggregateData.push({
        averageCount: 0.0,
        timeOfDay: hour,
      });
    }
  }

  let actionsByTimeOfDay = {};
  if (actions?.length) {
    actionsByTimeOfDay = filterActions({
      selectedUsers,
      selectedActionTypes,
      actions,
      chartFunction: getActionsByTimeOfDay,
    });
  }
  const formattedActionsByTimeOfDay =
    formatActionsByTimeOfDay(actionsByTimeOfDay);

  const mergedData = formattedAggregateData.map((o1) =>
    Object.assign(
      o1,
      formattedActionsByTimeOfDay.find(
        (o2) => o2.timeOfDay === o1.timeOfDay,
      ) ?? {
        count: 0,
      },
    ),
  );

  mergedData.sort((a, b) => a.timeOfDay - b.timeOfDay);

  const maxCountEntry = mergedData.reduce((a, b) =>
    Math.max(a.averageCount, a.count) > Math.max(b.averageCount, b.count)
      ? a
      : b,
  );
  const maxCount = Math.max(maxCountEntry.averageCount, maxCountEntry.count);
  let yAxisMax;
  if (maxCount <= 100) {
    yAxisMax = Math.ceil(maxCount / 10) * 10;
  } else {
    yAxisMax = Math.ceil(maxCount / 100) * 100;
  }

  return (
    <>
      <ChartTitle title={title} />
      <ChartContainer>
        <BarChart data={mergedData}>
          <CartesianGrid strokeDasharray="2" />
          <XAxis interval={0} dataKey="timeOfDay" tick={{ fontSize: 14 }} />
          <YAxis
            tick={{ fontSize: 14 }}
            domain={[0, yAxisMax]}
            orientation={direction === 'rtl' ? 'right' : 'left'}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" name={t('COUNT')} fill={GENERAL_COLOR} />
          <Bar
            dataKey="averageCount"
            name={t('AVERAGE_COUNT')}
            fill={AVERAGE_COLOR}
          />
        </BarChart>
      </ChartContainer>
    </>
  );
};
export default ActionsByTimeOfDayChart;
