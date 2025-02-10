import { type JSX, type ReactNode } from 'react';

import { Alert, Grid2 as Grid, Skeleton } from '@mui/material';

import { BOOKMARKED_ITEMS_ID } from '@/config/selectors';
import { useBookmarkedItems } from '@/query/hooks/itemBookmark';

import { ItemCard } from './ItemCard';

const GridWrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <Grid size={{ xs: 12, sm: 4, md: 3, xl: 2 }}>{children}</Grid>
);
const placeholderItems = [
  { id: '6a704d93-3f00-4ff6-a142-77bf4192aef6' },
  { id: '8507cea8-a95f-4650-8cdd-d4065488f1dc' },
  { id: 'dbb1a033-c056-4753-8fd4-a4691581f3ad' },
  { id: '8d8ad96d-a7b5-40d9-9a51-1472a126e35e' },
  { id: '9858060a-0a22-457e-9f64-0d0f61360a0a' },
  { id: '652fa7f0-1653-4baf-8a00-e533dafc6655' },
];

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
        There was an issue retrieving your favorite items.
      </Alert>
    );
  }

  // else we have nothing to show
}
