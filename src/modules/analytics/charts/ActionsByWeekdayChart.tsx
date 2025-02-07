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
import {
  filterActions,
  formatActionsByWeekday,
  getActionsByWeekday,
} from '../utils';
import { EmptyChart } from './EmptyChart';

const ActionsByWeekdayChart = (): JSX.Element | null => {
  const { t } = useTranslation(NS.Analytics);
  const { actions, selectedUsers, selectedActionTypes, dateRange, itemId } =
    useContext(DataContext);

  const { view } = useContext(ViewDataContext);
  const { direction } = useTheme();

  const {
    data: aggregateData,
    isLoading,
    isError,
  } = useAggregateActions(itemId, {
    view,
    requestedSampleSize: DEFAULT_REQUEST_SAMPLE_SIZE,
    type: selectedActionTypes,
    countGroupBy: [CountGroupBy.User, CountGroupBy.CreatedDayOfWeek],
    aggregateFunction: AggregateFunction.Avg,
    aggregateMetric: AggregateMetric.ActionCount,
    aggregateBy: [AggregateBy.CreatedDayOfWeek],
    startDate: formatISO(dateRange.startDate),
    endDate: formatISO(endOfDay(dateRange.endDate)),
  });

  if (isLoading || isError) {
    return null;
  }

  const title = t('ACTIONS_BY_WEEKDAY');
  if (!aggregateData?.length) {
    return <EmptyChart chartTitle={title} />;
  }

  const formattedAggregateData: {
    aggregateResult: number;
    createdDayOfWeek: number;
  }[] = aggregateData.map((d) => ({
    aggregateResult: d.aggregateResult,
    createdDayOfWeek: parseFloat(d.createdDayOfWeek ?? '0'),
  }));
  const createdDayOfWeekEntry = formattedAggregateData.map(
    (o) => o.createdDayOfWeek,
  );

  // fill with empty data
  for (let day = 0; day < 7; day += 1) {
    if (!createdDayOfWeekEntry.includes(day)) {
      formattedAggregateData.push({
        aggregateResult: 0.0,
        createdDayOfWeek: day,
      });
    }
  }

  // we don't translate here because we need to compare with the raw data
  const weekdayEnum = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };

  formattedAggregateData.sort(
    (a, b) => a.createdDayOfWeek - b.createdDayOfWeek,
  );
  const formattedAggregateDataWithWeekday = formattedAggregateData.map((d) => ({
    averageCount: d.aggregateResult,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    day: weekdayEnum[d.createdDayOfWeek],
  }));

  // ActionsByWeekday is the object passed, after formatting, to the BarChart component below

  let actionsByWeekday = {};
  if (actions?.length) {
    actionsByWeekday = filterActions({
      selectedUsers,
      selectedActionTypes,
      actions,
      chartFunction: getActionsByWeekday,
    });
  }

  const formattedActionsByWeekday = formatActionsByWeekday(actionsByWeekday);

  const mergedData = formattedAggregateDataWithWeekday
    .map((o1) =>
      Object.assign(
        o1,
        formattedActionsByWeekday.find((o2) => o2.day === o1.day) ?? {
          count: 0,
        },
      ),
    )
    // translate weekdays
    .map((d) => ({ ...d, day: t(d.day) }));

  return (
    <>
      <ChartTitle title={title} />
      <ChartContainer>
        <BarChart data={mergedData}>
          <CartesianGrid strokeDasharray="2" />
          <XAxis interval={0} dataKey="day" tick={{ fontSize: 14 }} />
          <YAxis
            tick={{ fontSize: 14 }}
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
export default ActionsByWeekdayChart;
