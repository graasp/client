import { useTranslation } from 'react-i18next';

import { Alert, Stack } from '@mui/material';

import { NS } from '@/config/constants';
import { hooks } from '@/config/queryClient';
import {
  PUBLISHED_ITEMS_ERROR_ALERT_ID,
  PUBLISHED_ITEMS_ID,
} from '@/config/selectors';

import { Ordering } from '~builder/enums';

import { BUILDER } from '../../langs';
import ErrorAlert from '../common/ErrorAlert';
import SelectTypes from '../common/SelectTypes';
import { useFilterItemsContext } from '../context/FilterItemsContext';
import { useItemSearch } from '../item/ItemSearch';
import ModeButton from '../item/header/ModeButton';
import LoadingScreen from '../layout/LoadingScreen';
import ItemsTable from '../main/list/ItemsTable';
import SortingSelect from '../table/SortingSelect';
import { SortingOptions, SortingOptionsType } from '../table/types';
import { useSorting, useTranslatedSortingOptions } from '../table/useSorting';
import { BuilderPageLayout } from './BuilderPageLayout';

const PublishedItemsScreenContent = ({
  searchText,
}: {
  searchText: string;
}) => {
  const { t: translateBuilder } = useTranslation(NS.Builder);
  const { data: member } = hooks.useCurrentMember();
  const {
    data: publishedItems,
    isLoading,
    isError,
  } = hooks.usePublishedItemsForMember(member?.id);
  const options = useTranslatedSortingOptions();
  const { shouldDisplayItem } = useFilterItemsContext();
  const { sortBy, setSortBy, ordering, setOrdering, sortFn } =
    useSorting<SortingOptionsType>({
      sortBy: SortingOptions.ItemUpdatedAt,
      ordering: Ordering.DESC,
    });
  const filteredData = publishedItems?.filter(
    (d) =>
      shouldDisplayItem(d.type) &&
      d.name.toLowerCase().includes(searchText.toLowerCase()),
  );
  filteredData?.sort(sortFn);

  if (publishedItems?.length) {
    return (
      <Stack alignItems="space-between" direction="column" gap={1} width="100%">
        <Stack
          spacing={1}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <SelectTypes />
          <Stack direction="row" gap={1}>
            {sortBy && setSortBy && (
              <SortingSelect
                sortBy={sortBy}
                setSortBy={setSortBy}
                ordering={ordering}
                setOrdering={setOrdering}
                options={options}
              />
            )}
            <ModeButton />
          </Stack>
        </Stack>
        {filteredData?.length ? (
          <ItemsTable
            id={PUBLISHED_ITEMS_ID}
            items={filteredData ?? []}
            canMove={false}
            enableMoveInBetween={false}
          />
        ) : (
          <Alert severity="info">
            {translateBuilder(BUILDER.PUBLISHED_ITEMS_NOT_FOUND_SEARCH, {
              search: searchText,
            })}
          </Alert>
        )}
      </Stack>
    );
  }

  if (isError) {
    return <ErrorAlert id={PUBLISHED_ITEMS_ERROR_ALERT_ID} />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!publishedItems?.length) {
    return (
      <Alert severity="info">
        {translateBuilder(BUILDER.PUBLISHED_ITEMS_EMPTY)}
      </Alert>
    );
  }

  return <ErrorAlert id={PUBLISHED_ITEMS_ERROR_ALERT_ID} />;
};

const PublishedItemsScreen = (): JSX.Element | null => {
  const { t: translateBuilder } = useTranslation(NS.Builder);
  const { input, text } = useItemSearch();

  return (
    <BuilderPageLayout
      id={PUBLISHED_ITEMS_ID}
      title={translateBuilder(BUILDER.PUBLISHED_ITEMS_TITLE)}
      options={
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={1}
        >
          {input}
        </Stack>
      }
    >
      <PublishedItemsScreenContent searchText={text} />
    </BuilderPageLayout>
  );
};

export default PublishedItemsScreen;
