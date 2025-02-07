import { type JSX, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';

import {
  ActionTriggers,
  AggregateBy,
  AggregateFunction,
  AggregateMetric,
  CountGroupBy,
} from '@graasp/sdk';

import { endOfDay } from 'date-fns/endOfDay';
import { formatISO } from 'date-fns/formatISO';
import { Cell, Pie, PieChart, PieLabel, Tooltip } from 'recharts';

import { NS } from '@/config/constants';
import { useAggregateActions } from '@/query/hooks/action';

import { DataContext } from '~analytics/context/DataProvider';
import { ViewDataContext } from '~analytics/context/ViewDataProvider';

import ActionChartLabel from '../charts-layout/ActionChartLabel';
import ChartContainer from '../common/ChartContainer';
import ChartTitle from '../common/ChartTitle';
import {
  DEFAULT_REQUEST_SAMPLE_SIZE,
  getColorForActionTriggerType,
} from '../constants';
import { EmptyChart } from './EmptyChart';

const PieLabelComp: PieLabel = (props) => <ActionChartLabel {...props} />;

const TotalActionsByVerbChart = (): JSX.Element | null => {
  const { t } = useTranslation(NS.Analytics);
  const { t: translateActions } = useTranslation(NS.Enums);
  const { selectedActionTypes, dateRange, itemId } = useContext(DataContext);
  const { view } = useContext(ViewDataContext);

  // get aggregate actions
  const {
    data: aggregateData,
    isLoading,
    isError,
  } = useAggregateActions(itemId, {
    view,
    requestedSampleSize: DEFAULT_REQUEST_SAMPLE_SIZE,
    type: selectedActionTypes,
    countGroupBy: [CountGroupBy.User, CountGroupBy.ActionType],
    aggregateFunction: AggregateFunction.Sum,
    aggregateMetric: AggregateMetric.ActionCount,
    aggregateBy: [AggregateBy.ActionType],
    startDate: formatISO(dateRange.startDate),
    endDate: formatISO(endOfDay(dateRange.endDate)),
  });

  const title = t('TOTAL_ACTIONS_DISTRIBUTIONS');

  if (aggregateData) {
    const totalActions = aggregateData.reduce(
      (acc, { aggregateResult }) => acc + aggregateResult,
      0,
    );
    const formattedAggregateData = aggregateData.map((d) => ({
      actionCount: (d.aggregateResult / totalActions) * 100,
      type: d.actionType,
    }));

    const formattedAggregateDataSorted = formattedAggregateData.toSorted(
      (a, b) => (a.type ?? 'Unknown').localeCompare(b.type ?? 'Unknown'),
    );

    return (
      <>
        <ChartTitle title={title} />
        <ChartContainer>
          <PieChart>
            {formattedAggregateDataSorted.length ? (
              <Pie
                data={formattedAggregateDataSorted}
                dataKey="actionCount"
                nameKey="type"
                label={PieLabelComp}
                labelLine={false}
              >
                {formattedAggregateDataSorted.map((entry) => (
                  <Cell
                    key={entry.type}
                    fill={getColorForActionTriggerType(entry.type)}
                  />
                ))}
              </Pie>
            ) : (
              <Typography>Nothing to see here</Typography>
            )}
            <Tooltip
              formatter={(
                value,
                name: (typeof ActionTriggers)[keyof typeof ActionTriggers],
              ) => [`${value}%`, translateActions(name)]}
            />
          </PieChart>
        </ChartContainer>
      </>
    );
  }

  if (isLoading) {
    return null;
  }

  return <EmptyChart chartTitle={title} isError={isError} />;
};

export default TotalActionsByVerbChart;
