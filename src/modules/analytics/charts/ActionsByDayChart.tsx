import { type JSX, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, useTheme } from '@mui/material';

import { useQuery } from '@tanstack/react-query';
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
import { getItemActionsByDayOptions } from '@/openapi/client/@tanstack/react-query.gen';

import { DataContext } from '~analytics/context/DataProvider';

import ChartContainer from '../common/ChartContainer';
import ChartTitle from '../common/ChartTitle';
import { AVERAGE_COLOR, GENERAL_COLOR } from '../constants';
import { EmptyChart } from './EmptyChart';

const ActionsByDayChart = ({
  itemId,
}: {
  itemId: string;
}): JSX.Element | null => {
  const { t } = useTranslation(NS.Analytics);
  const { dateRange } = useContext(DataContext);
  const { direction } = useTheme();
  const { data, isLoading, isError } = useQuery(
    getItemActionsByDayOptions({
      path: { id: itemId },
      query: {
        startDate: formatISO(dateRange.startDate),
        endDate: formatISO(endOfDay(dateRange.endDate)),
      },
    }),
  );

  if (isLoading || isError) {
    return null;
  }

  const title = t('ACTIONS_BY_DAY_TITLE');
  if (!data) {
    return <EmptyChart chartTitle={title} />;
  }

  return (
    <Box width="100%">
      <ChartTitle title={title} />
      <ChartContainer>
        <LineChart
          data={Object.values(
            data as { [key: string]: { date: string } },
          ).toSorted((a, b) => (a.date > b.date ? 1 : -1))}
        >
          <CartesianGrid strokeDasharray="2" />
          <XAxis dataKey="date" tick={{ fontSize: 14 }} />
          <YAxis
            tick={{ fontSize: 14 }}
            orientation={direction === 'rtl' ? 'right' : 'left'}
          />
          <Tooltip />
          <Legend />
          <Line
            dataKey="count.all"
            name={t('All')}
            stroke={GENERAL_COLOR}
            activeDot={{ r: 6 }}
            strokeWidth={3}
          />
          <Line
            dataKey="personal.all"
            name={t('Me')}
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
