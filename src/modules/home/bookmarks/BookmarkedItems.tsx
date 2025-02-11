import { type JSX, type ReactNode } from 'react';

import { Alert, Grid2 as Grid, Skeleton } from '@mui/material';

import { v4 } from 'uuid';

import { BOOKMARKED_ITEMS_ID } from '@/config/selectors';
import { useBookmarkedItems } from '@/query/hooks/itemBookmark';

import { ItemCard } from './ItemCard';

const GridWrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <Grid size={{ xs: 12, sm: 4, md: 3, xl: 2 }}>{children}</Grid>
);

// mock data for placeholder skeleton
const placeholderItems = Array(6).map(() => ({ id: v4() }));

export function BookmarkedItems() {
  const { data: bookmarkedItems, isPending, isError } = useBookmarkedItems();

  if (bookmarkedItems) {
    return (
      <Grid
        id={BOOKMARKED_ITEMS_ID}
        width="100%"
        container
        // needs to be "spacing" because with gap it does not fill the whole line
        spacing={2}
        justifyItems="center"
      >
        {bookmarkedItems.map(({ item }) => (
          <GridWrapper key={item.id}>
            <ItemCard key={item.id} item={item} />
          </GridWrapper>
        ))}
      </Grid>
    );
  }

  if (isPending) {
    return (
      <Grid width="100%" container spacing={2} justifyItems="center">
        {placeholderItems.map(({ id }) => (
          <GridWrapper key={id}>
            <Skeleton
              variant="rounded"
              animation="wave"
              width="100%"
              height="75px"
            />
          </GridWrapper>
        ))}
      </Grid>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        There was an issue retrieving your bookmarked items.
      </Alert>
    );
  }

  // else we have nothing to show
  return null;
}
