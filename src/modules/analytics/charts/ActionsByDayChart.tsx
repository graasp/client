import { type JSX, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, useTheme } from '@mui/material';

import {
  AggregateBy,
  AggregateFunction,
  AggregateMetric,
  CountGroupBy,
} from '@graasp/sdk';

import { endOfDay } from 'date-fns/endOfDay';
import { formatISO } from 'date-fns/formatISO';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { NS } from '@/config/constants';
import { useAggregateActions } from '@/query/hooks/action';

import { DataContext } from '~analytics/context/DataProvider';
import { ViewDataContext } from '~analytics/context/ViewDataProvider';

import ChartContainer from '../common/ChartContainer';
import ChartTitle from '../common/ChartTitle';
import {
  AVERAGE_COLOR,
  DEFAULT_REQUEST_SAMPLE_SIZE,
  GENERAL_COLOR,
} from '../constants';
import { filterActions, formatActionsByDay, getActionsByDay } from '../utils';
import { EmptyChart } from './EmptyChart';

const ActionsByDayChart = (): JSX.Element | null => {
  const { t } = useTranslation(NS.Analytics);
  const { actions, selectedUsers, selectedActionTypes, dateRange, itemId } =
    useContext(DataContext);
  const { view } = useContext(ViewDataContext);
  const { direction } = useTheme();
  // get aggregate actions
  const {
    data: aggregateData,
    isLoading,
    isError,
  } = useAggregateActions(itemId, {
    view,
    requestedSampleSize: DEFAULT_REQUEST_SAMPLE_SIZE,
    type: selectedActionTypes,
    countGroupBy: [CountGroupBy.User, CountGroupBy.CreatedDay],
    aggregateFunction: AggregateFunction.Avg,
    aggregateMetric: AggregateMetric.ActionCount,
    aggregateBy: [AggregateBy.CreatedDay],
    startDate: formatISO(dateRange.startDate),
    endDate: formatISO(endOfDay(dateRange.endDate)),
  });

  if (isLoading || isError) {
    return null;
  }

  const title = t('ACTIONS_BY_DAY_TITLE');
  if (!aggregateData?.length) {
    return <EmptyChart chartTitle={title} />;
  }

  // sort by creation date
  const aggregateDataSorted = [...aggregateData];
  aggregateDataSorted.sort((a, b) => {
    if (!a.createdDay || !b.createdDay) {
      return -1;
    }
    return new Date(a.createdDay).getTime() - new Date(b.createdDay).getTime();
  });

  const formatDate = (datestring?: string) => {
    if (!datestring) {
      return 'Unknown';
    }
    return `${new Date(datestring).getDate()}-${
      new Date(datestring).getMonth() + 1
    }-${new Date(datestring).getFullYear()}`;
  };

  const formattedAggregateData = aggregateDataSorted.map((d) => ({
    averageCount: d.aggregateResult,
    date: formatDate(d.createdDay),
  }));

  let actionsByDay: { [key: string]: number } = {};
  if (actions?.length) {
    actionsByDay = filterActions({
      selectedUsers,
      selectedActionTypes,
      actions,
      chartFunction: getActionsByDay,
    });
  }

  const formattedActionsByDay = formatActionsByDay(actionsByDay);
  const mergedData: {
    date: string;
    count: number;
    averageCount: number;
  }[] = formattedAggregateData.map((o1) =>
    Object.assign(
      o1,
      formattedActionsByDay.find((o2) => o2.date === o1.date) ?? { count: 0 },
    ),
  );

  const maxCountEntry = mergedData.reduce(
    (a, b) =>
      Math.max(a.averageCount, a.count) > Math.max(b.averageCount, b.count)
        ? a
        : b,
    { averageCount: 0, count: 0 },
  );
  const maxCount = Math.max(maxCountEntry.averageCount, maxCountEntry.count);
  let yAxisMax;
  if (maxCount <= 100) {
    yAxisMax = Math.ceil(maxCount / 10) * 10;
  } else {
    yAxisMax = Math.ceil(maxCount / 100) * 100;
  }

  return (
    <Box width="100%">
      <ChartTitle title={title} />
      <ChartContainer>
        <LineChart
          data={mergedData.map((entry) => ({
            ...entry,
            averageCount: entry.averageCount.toFixed(2),
          }))}
        >
          <CartesianGrid strokeDasharray="2" />
          <XAxis dataKey="date" tick={{ fontSize: 14 }} />
          <YAxis
            tick={{ fontSize: 14 }}
            domain={[0, yAxisMax]}
            orientation={direction === 'rtl' ? 'right' : 'left'}
          />
          <Tooltip />
          <Legend />
          <Line
            dataKey="count"
            name={t('COUNT')}
            stroke={GENERAL_COLOR}
            activeDot={{ r: 6 }}
            strokeWidth={3}
          />
          <Line
            dataKey="averageCount"
            name={t('AVERAGE_COUNT')}
            stroke={AVERAGE_COLOR}
            activeDot={{ r: 6 }}
            strokeWidth={3}
          />
        </LineChart>
      </ChartContainer>
    </Box>
  );
};

export default ActionsByDayChart;
