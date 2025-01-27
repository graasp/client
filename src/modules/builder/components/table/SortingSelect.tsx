import { Dispatch, type JSX } from 'react';
import { useTranslation } from 'react-i18next';

import {
  FormControl,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';

import { ArrowDownNarrowWide, ArrowUpWideNarrow } from 'lucide-react';

import { NS } from '@/config/constants';
import { SORTING_SELECT_SELECTOR_TEST_ID } from '@/config/selectors';

import { Ordering, OrderingType } from '~builder/enums';

import { AllSortingOptions, SortingOptions, SortingOptionsType } from './types';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const LABEL_ID = 'sort-by-filter-label';

export type SortingSelectProps<
  T extends AllSortingOptions = SortingOptionsType,
> = {
  sortBy: T;
  setSortBy: Dispatch<T>;
  ordering: OrderingType;
  setOrdering: Dispatch<OrderingType>;
  options: T[];
};

export const SortingSelect = <
  T extends AllSortingOptions = SortingOptionsType,
>({
  sortBy,
  setSortBy,
  ordering,
  setOrdering,
  options,
}: SortingSelectProps<T>): JSX.Element => {
  const { t: translateBuilder } = useTranslation(NS.Builder);

  const handleChange = (event: SelectChangeEvent) => {
    const {
      target: { value: v },
    } = event;
    setSortBy(v as T);
  };

  const label = translateBuilder('SORT_BY_LABEL');

  const sortedOptions = options
    .map((o) => [o, translateBuilder(o)])
    .sort((a, b) => (a[1] > b[1] ? 1 : -1));

  return (
    <FormControl size="small">
      <FormGroup row>
        <InputLabel id={LABEL_ID}>{label}</InputLabel>

        <Select
          data-testid={SORTING_SELECT_SELECTOR_TEST_ID}
          labelId={LABEL_ID}
          label={label}
          value={sortBy ?? SortingOptions.ItemUpdatedAt}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          MenuProps={MenuProps}
          sx={{
            borderRadius: 40,
          }}
        >
          {sortedOptions.map(([option, title]) => (
            <MenuItem key={option} value={option} dense>
              {title}
            </MenuItem>
          ))}
        </Select>
        <IconButton
          onClick={() => {
            setOrdering(
              ordering === Ordering.ASC ? Ordering.DESC : Ordering.ASC,
            );
          }}
        >
          {ordering === Ordering.ASC ? (
            <ArrowDownNarrowWide />
          ) : (
            <ArrowUpWideNarrow />
          )}
        </IconButton>
      </FormGroup>
    </FormControl>
  );
};

export default SortingSelect;
