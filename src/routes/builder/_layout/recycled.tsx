import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Stack, Typography } from '@mui/material';

import { createFileRoute } from '@tanstack/react-router';

import { NS } from '@/config/constants';
import { hooks } from '@/config/queryClient';
import {
  RECYCLED_ITEMS_ERROR_ALERT_ID,
  RECYCLED_ITEMS_ROOT_CONTAINER,
} from '@/config/selectors';
import Button from '@/ui/buttons/Button/Button';

import { ITEM_PAGE_SIZE } from '~builder/constants';

import DeleteButton from '../../../modules/builder/components/common/DeleteButton';
import ErrorAlert from '../../../modules/builder/components/common/ErrorAlert';
import RestoreButton from '../../../modules/builder/components/common/RestoreButton';
import LoadingScreen from '../../../modules/builder/components/layout/LoadingScreen';
import {
  SelectionContextProvider,
  useSelectionContext,
} from '../../../modules/builder/components/main/list/SelectionContext';
import {
  DragContainerStack,
  useDragSelection,
} from '../../../modules/builder/components/main/list/useDragSelection';
import { BuilderPageLayout } from '../../../modules/builder/components/pages/BuilderPageLayout';
import RecycleBinToolbar from '../../../modules/builder/components/pages/recycleBin/RecycleBinSelectionToolbar';
import ItemCard from '../../../modules/builder/components/table/ItemCard';
import { BUILDER } from '../../../modules/builder/langs';

const CONTAINER_ID = 'recycle-items-container';

export const Route = createFileRoute('/builder/_layout/recycled')({
  component: RecycledItemsScreen,
});

const RecycledItemsScreenContent = (): JSX.Element => {
  const { t: translateBuilder } = useTranslation(NS.Builder);

  const { data, fetchNextPage, isLoading, isFetching } =
    hooks.useInfiniteOwnRecycledItems(
      // improvement: adapt page size given the user window height
      { pageSize: ITEM_PAGE_SIZE },
    );

  const { selectedIds, toggleSelection } = useSelectionContext();

  const DragSelection = useDragSelection({ containerId: CONTAINER_ID });

  // render this when there is data from the query
  if (data?.pages?.length) {
    if (data.pages[0].data.length) {
      const fetchedItems = data.pages.flatMap((p) => p.data);

      const totalFetchedItems = fetchedItems.length;

      const hasSelection = Boolean(selectedIds.length && fetchedItems.length);
      return (
        <>
          <Stack gap={1} height="100%">
            <Stack
              alignItems="space-between"
              direction="column"
              gap={1}
              width="100%"
            >
              {hasSelection ? (
                <RecycleBinToolbar items={fetchedItems} />
              ) : (
                <Typography variant="body1">
                  {translateBuilder(BUILDER.TRASH_COUNT, {
                    count: data.pages[0].totalCount,
                  })}
                </Typography>
              )}
            </Stack>
            <DragContainerStack id={CONTAINER_ID}>
              {fetchedItems.map((item) => (
                <Stack key={item.id} mb={1}>
                  <ItemCard
                    item={item}
                    onThumbnailClick={() => toggleSelection(item.id)}
                    isSelected={selectedIds.includes(item.id)}
                    allowNavigation={false}
                    footer={
                      <Stack justifyContent="right" direction="row">
                        <RestoreButton itemIds={[item.id]} />
                        <DeleteButton items={[item]} />
                      </Stack>
                    }
                  />
                </Stack>
              ))}
              {!isFetching && data.pages[0].totalCount > totalFetchedItems && (
                <Stack textAlign="center" alignItems="center">
                  <Button
                    variant="outlined"
                    onClick={fetchNextPage}
                    role="feed"
                  >
                    {translateBuilder(BUILDER.HOME_SCREEN_LOAD_MORE_BUTTON)}
                  </Button>
                </Stack>
              )}
            </DragContainerStack>
          </Stack>
          {DragSelection}
        </>
      );
    }
    return (
      <Alert severity="info">{translateBuilder(BUILDER.TRASH_NO_ITEM)}</Alert>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <ErrorAlert id={RECYCLED_ITEMS_ERROR_ALERT_ID} />;
};

function RecycledItemsScreen(): JSX.Element | null {
  const { t: translateBuilder } = useTranslation(NS.Builder);

  return (
    <BuilderPageLayout
      title={translateBuilder(BUILDER.RECYCLE_BIN_TITLE)}
      id={RECYCLED_ITEMS_ROOT_CONTAINER}
    >
      <SelectionContextProvider>
        <RecycledItemsScreenContent />
      </SelectionContextProvider>
    </BuilderPageLayout>
  );
}
