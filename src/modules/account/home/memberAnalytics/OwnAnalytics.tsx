import { type JSX, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Stack, Typography } from '@mui/material';

import { format } from 'date-fns/format';
import { formatISO } from 'date-fns/formatISO';
import groupBy from 'lodash/groupBy';

import { NS } from '@/config/constants';
import { hooks } from '@/config/queryClient';
import { Loader } from '@/ui/Loader/Loader';

import ActionsLegend from '~analytics/charts-layout/ActionsLegend';
import DateRange from '~analytics/common/DateRangeInput';
import SectionTitle from '~analytics/common/SectionTitle';
import MyAnalyticsDateRangeProvider, {
  MyAnalyticsDateRangeDataContext,
} from '~analytics/context/MyAnalyticsDateRangeContext';

import { MemberActionsChart } from './MemberActionsChart';
import { MemberGeneralStatisticsCards } from './MemberGeneralStatisticsCards';

const OwnAnalytics = (): JSX.Element => {
  const { t } = useTranslation(NS.Analytics);

  const { dateRange, setDateRange } = useContext(
    MyAnalyticsDateRangeDataContext,
  );

  const { data, isLoading } = hooks.useMemberActions({
    startDate: formatISO(dateRange.startDate),
    endDate: formatISO(dateRange.endDate),
  });

  const formattedStartDate = format(dateRange.startDate, 'MMMM d, yyyy');
  const formattedEndDate = format(dateRange.endDate, 'MMMM d, yyyy');

  const inputValue = `${formattedStartDate} - ${formattedEndDate}`;

  if (data) {
    const actionsGroupedByTypes = groupBy(data, 'type');

    return (
      <>
        <Stack spacing={1} width="100%">
          <Stack
            direction={{ sm: 'column', md: 'row' }}
            justifyContent={{ sm: 'center', md: 'space-between' }}
            spacing={1}
          >
            <SectionTitle title={t('MY_ANALYTICS')} />
            <DateRange dateRange={dateRange} setDateRange={setDateRange} />
          </Stack>
          {data.length ? (
            <>
              <MemberGeneralStatisticsCards
                actionsGroupedByTypes={actionsGroupedByTypes}
              />
              <MemberActionsChart actions={data} />
            </>
          ) : (
            <Typography>
              {t('NO_RESULTS_FOUND', { period: inputValue })}
            </Typography>
          )}
        </Stack>
        <ActionsLegend actionsTypes={Object.keys(actionsGroupedByTypes)} />
      </>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  return <Alert severity="error">{t('ERROR_FETCHING_DATA')}</Alert>;
};

export function OwnAnalyticsWrapper(): JSX.Element {
  return (
    <MyAnalyticsDateRangeProvider>
      <OwnAnalytics />
    </MyAnalyticsDateRangeProvider>
  );
}
