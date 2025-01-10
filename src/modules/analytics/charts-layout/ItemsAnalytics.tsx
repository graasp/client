import type { JSX } from 'react';

import { Grid2 } from '@mui/material';

import ItemsByActionChart from '../charts/ItemsByActionChart';
import ItemsByUserChart from '../charts/ItemsByUserChart';

const ItemsAnalytics = (): JSX.Element => (
  <Grid2 container>
    <Grid2 size={{ xs: 12, xl: 6 }}>
      <ItemsByUserChart />
    </Grid2>
    <Grid2 size={{ xs: 12, xl: 6 }}>
      <ItemsByActionChart />
    </Grid2>
  </Grid2>
);

export default ItemsAnalytics;
