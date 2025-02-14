import { type JSX, type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  Button,
  Grid2 as Grid,
  Skeleton,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { v4 } from 'uuid';

import { NS } from '@/config/constants';
import { BOOKMARKED_ITEMS_ID } from '@/config/selectors';
import { useBookmarkedItems } from '@/query/hooks/itemBookmark';

import { BookmarkCard } from './BookmarkCard';

const GridWrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <Grid size={{ xs: 12, sm: 4, md: 3, xl: 2 }}>{children}</Grid>
);

// mock data for placeholder skeleton
const placeholderItems = Array(6).map(() => ({ id: v4() }));

const useResponsiveMaxItems = () => {
  const theme = useTheme();
  const largerThanXl = useMediaQuery(theme.breakpoints.up('xl'));
  const largerThanMd = useMediaQuery(theme.breakpoints.up('md'));
  const largerThanSm = useMediaQuery(theme.breakpoints.up('sm'));

  if (largerThanXl) {
    return 24;
  }
  if (largerThanMd) {
    return 12;
  }
  if (largerThanSm) {
    return 6;
  }
  return 4;
};

export function BookmarkedItems() {
  const { t } = useTranslation(NS.Home, { keyPrefix: 'BOOKMARKED_ITEMS' });
  const { data: bookmarkedItems, isPending, isError } = useBookmarkedItems();
  const [showAll, setShowAll] = useState(false);

  const maxItems = useResponsiveMaxItems();

  if (bookmarkedItems) {
    const shownBookmarks = showAll
      ? bookmarkedItems
      : bookmarkedItems.slice(0, maxItems);
    return (
      <>
        <Grid
          id={BOOKMARKED_ITEMS_ID}
          width="100%"
          container
          // needs to be "spacing" because with gap it does not fill the whole line
          spacing={2}
          justifyItems="center"
        >
          {shownBookmarks.map(({ item }) => (
            <GridWrapper key={item.id}>
              <BookmarkCard key={item.id} item={item} />
            </GridWrapper>
          ))}
        </Grid>
        {maxItems < bookmarkedItems.length ? (
          <Button onClick={() => setShowAll((s) => !s)}>
            {showAll ? t('SHOW_LESS') : t('SHOW_MORE')}
          </Button>
        ) : null}
      </>
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
