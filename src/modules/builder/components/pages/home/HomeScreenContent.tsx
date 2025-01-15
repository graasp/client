import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Box, LinearProgress, Stack } from '@mui/material';

import { Button } from '@graasp/ui';

import { useAuth } from '@/AuthContext';
import { NS } from '@/config/constants';
import { hooks } from '@/config/queryClient';
import { ACCESSIBLE_ITEMS_TABLE_ID } from '@/config/selectors';

import SelectTypes from '~builder/components/common/SelectTypes';
import { useFilterItemsContext } from '~builder/components/context/FilterItemsContext';
import { useLayoutContext } from '~builder/components/context/LayoutContext';
import { FileUploader } from '~builder/components/file/FileUploader';
import ModeButton from '~builder/components/item/header/ModeButton';
import LoadingScreen from '~builder/components/layout/LoadingScreen';
import NewItemButton from '~builder/components/main/NewItemButton';
import ItemsTable from '~builder/components/main/list/ItemsTable';
import { useSelectionContext } from '~builder/components/main/list/SelectionContext';
import {
  DragContainerStack,
  useDragSelection,
} from '~builder/components/main/list/useDragSelection';
import { DesktopMap } from '~builder/components/map/DesktopMap';
import ShowOnlyMeButton from '~builder/components/table/ShowOnlyMeButton';
import SortingSelect from '~builder/components/table/SortingSelect';
import {
  SortingOptions,
  SortingOptionsType,
} from '~builder/components/table/types';
import { useSorting } from '~builder/components/table/useSorting';
import { ITEM_PAGE_SIZE } from '~builder/config/constants';
import { ItemLayoutMode, Ordering } from '~builder/enums';

import NoItemFilters from '../NoItemFilters';
import HomeSelectionToolbar from './HomeSelectionToolbar';

const CONTAINER_ID = 'home-items-container';

type ShowOnlyMeChangeType = (checked: boolean) => void;

export function HomeScreenContent({
  searchText,
}: Readonly<{ searchText: string }>) {
  const { user } = useAuth();
  const { t: translateBuilder } = useTranslation(NS.Builder);
  const { t: translateEnums } = useTranslation(NS.Enums);
  const { itemTypes } = useFilterItemsContext();
  const [showOnlyMe, setShowOnlyMe] = useState(false);

  const { selectedIds, toggleSelection, clearSelection } =
    useSelectionContext();
  const { mode } = useLayoutContext();
  const { sortBy, setSortBy, ordering, setOrdering } =
    useSorting<SortingOptionsType>({
      sortBy: SortingOptions.ItemUpdatedAt,
      ordering: Ordering.DESC,
    });
  const { data, fetchNextPage, isLoading, isFetching } =
    hooks.useInfiniteAccessibleItems(
      {
        // todo: in the future this can be any member from creators
        creatorId: showOnlyMe ? user?.id : undefined,
        sortBy,
        ordering,
        types: itemTypes,
        keywords: searchText,
      },
      // todo: adapt page size given the user window height
      { pageSize: ITEM_PAGE_SIZE },
    );

  const DragSelection = useDragSelection({ containerId: CONTAINER_ID });

  const onShowOnlyMeChange: ShowOnlyMeChangeType = (checked) => {
    setShowOnlyMe(checked);
  };

  if (mode === ItemLayoutMode.Map) {
    return (
      <>
        <Stack direction="row" justifyContent="flex-end">
          <ModeButton />
        </Stack>
        <DesktopMap />
      </>
    );
  }

  if (data?.pages?.length) {
    // default show upload zone
    let content = (
      <Box mt={2}>
        <FileUploader buttons={<NewItemButton />} />
      </Box>
    );

    if (data.pages[0].data.length) {
      const totalFetchedItems = data
        ? data.pages.map(({ data: d }) => d.length).reduce((a, b) => a + b, 0)
        : 0;
      content = (
        <DragContainerStack id={CONTAINER_ID}>
          <ItemsTable
            canMove={!searchText}
            id={ACCESSIBLE_ITEMS_TABLE_ID}
            items={data.pages.flatMap(({ data: i }) => i)}
            enableMoveInBetween={false}
            onCardClick={toggleSelection}
            selectedIds={selectedIds}
            onMove={clearSelection}
          />
          {!isFetching && data.pages[0].totalCount > totalFetchedItems && (
            <Stack textAlign="center" alignItems="center">
              <Button variant="outlined" onClick={fetchNextPage} role="feed">
                {translateBuilder('HOME_SCREEN_LOAD_MORE_BUTTON')}
              </Button>
            </Stack>
          )}
          {!isFetching && data.pages[0].totalCount === totalFetchedItems && (
            // avoids button fullwidth
            <Stack alignItems="center" mb={2}>
              <NewItemButton type="icon" />
            </Stack>
          )}
        </DragContainerStack>
      );
    } else if (itemTypes.length || searchText) {
      content = <NoItemFilters searchText={searchText} />;
    }

    const sortingOptions = Object.values(SortingOptions).sort((t1, t2) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      translateEnums(t1).localeCompare(translateEnums(t2)),
    );

    return (
      <>
        {DragSelection}
        <Stack
          alignItems="space-between"
          direction="column"
          mt={2}
          gap={1}
          width="100%"
        >
          <Stack spacing={1}>
            <ShowOnlyMeButton
              onClick={onShowOnlyMeChange}
              enabled={showOnlyMe}
            />
          </Stack>

          {selectedIds.length ? (
            <HomeSelectionToolbar
              items={data.pages.flatMap(({ data: i }) => i)}
            />
          ) : (
            <Stack
              spacing={1}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <SelectTypes />
              <Stack direction="row" gap={1}>
                {sortBy && setSortBy && (
                  <SortingSelect<SortingOptionsType>
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    ordering={ordering}
                    setOrdering={setOrdering}
                    options={sortingOptions}
                  />
                )}
                <ModeButton />
              </Stack>
            </Stack>
          )}
        </Stack>
        <Stack height="100%">
          {content}
          {data && isFetching && (
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
          )}
        </Stack>
      </>
    );
  }

  if (isLoading) {
    return <LoadingScreen chipsPlaceholder />;
  }

  return <Alert severity="error">{translateBuilder('ERROR_MESSAGE')}</Alert>;
}
