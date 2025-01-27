import { type JSX, createContext, useMemo, useState } from 'react';

import type { Duration } from 'date-fns';
import { addDays } from 'date-fns/addDays';
import { intervalToDuration } from 'date-fns/intervalToDuration';

import {
  DateRange,
  GroupByInterval,
  GroupByIntervalType,
} from '~analytics/config/type';

const defaultValue: {
  dateRange: DateRange;
  setDateRange: (view: DateRange) => void;
  groupInterval: GroupByIntervalType;
} = {
  dateRange: {
    startDate: addDays(new Date(), -30),
    endDate: new Date(),
    key: 'selection',
  },
  setDateRange: () => {
    // do nothing
  },
  groupInterval: GroupByInterval.Week,
};

export const MyAnalyticsDateRangeDataContext = createContext(defaultValue);

function getGroupInterval(duration: Duration) {
  if (duration.years && duration.years >= 1) {
    return GroupByInterval.Year;
  }
  if (duration.months && duration.months > 2) {
    return GroupByInterval.Month;
  }
  if (duration.days && duration.days < 8) {
    return GroupByInterval.Day;
  } else {
    return GroupByInterval.Week;
  }
}

const MyAnalyticsDateRangeProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const [dateRange, setDateRange] = useState({
    startDate: addDays(new Date(), -30),
    endDate: new Date(),
    key: 'selection',
  });

  const groupInterval = getGroupInterval(
    intervalToDuration({
      start: dateRange.startDate,
      end: dateRange.endDate,
    }),
  );

  const value = useMemo(
    () => ({
      dateRange,
      setDateRange,
      groupInterval,
    }),
    [dateRange, setDateRange, groupInterval],
  );
  return (
    <MyAnalyticsDateRangeDataContext.Provider value={value}>
      {children}
    </MyAnalyticsDateRangeDataContext.Provider>
  );
};

export default MyAnalyticsDateRangeProvider;
