import type { JSX } from 'react';

import { Grid2, Stack } from '@mui/material';

import ActionsByDayChart from '../charts/ActionsByDayChart';
import ActionsByTimeOfDayChart from '../charts/ActionsByTimeOfDayChart';
import ActionsByWeekdayChart from '../charts/ActionsByWeekdayChart';

const ChartsArea = ({ itemId }: { itemId: string }): JSX.Element => (
  <>
    <Stack
      direction={{ sm: 'column', md: 'row' }}
      alignItems="center"
      width="100%"
    >
      <ActionsByDayChart itemId={itemId} />
    </Stack>
    <Grid2 container>
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <ActionsByTimeOfDayChart itemId={itemId} />
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <ActionsByWeekdayChart itemId={itemId} />
      </Grid2>
    </Grid2>
  </>
);

export default ChartsArea;
