import type { JSX } from 'react';

import { Grid2, Stack } from '@mui/material';

import { GOOGLE_KEY } from '@/config/env';

import ActionsByDayChart from '../charts/ActionsByDayChart';
import ActionsByTimeOfDayChart from '../charts/ActionsByTimeOfDayChart';
import ActionsByVerbChart from '../charts/ActionsByVerbChart';
import ActionsByWeekdayChart from '../charts/ActionsByWeekdayChart';
import ActionsCard from '../charts/ActionsCard';
import ActionsMap from '../charts/ActionsMap';
import TotalActionsByVerbChart from '../charts/TotalActionsByVerbChart';

const ChartsArea = (): JSX.Element => (
  <>
    <Stack direction={{ sm: 'column', md: 'row' }} alignItems="center">
      <ActionsCard />
      <ActionsByDayChart />
    </Stack>
    <Grid2 container>
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <ActionsByTimeOfDayChart />
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <ActionsByWeekdayChart />
      </Grid2>
      {GOOGLE_KEY ? (
        <Grid2 size={{ xs: 12, lg: 6 }}>
          <ActionsMap />
        </Grid2>
      ) : null}
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <ActionsByVerbChart />
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <TotalActionsByVerbChart />
      </Grid2>
    </Grid2>
  </>
);

export default ChartsArea;
