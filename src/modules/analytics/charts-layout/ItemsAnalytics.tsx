import { Grid } from '@mui/material';

import ItemsByActionChart from '../charts/ItemsByActionChart';
import ItemsByUserChart from '../charts/ItemsByUserChart';

const ItemsAnalytics = (): JSX.Element => (
  <Grid container>
    <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
      <ItemsByUserChart />
    </Grid>
    <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
      <ItemsByActionChart />
    </Grid>
  </Grid>
);

export default ItemsAnalytics;
