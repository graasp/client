import { type JSX, SyntheticEvent, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Autocomplete,
  Chip,
  FormControl,
  Stack,
  TextField,
} from '@mui/material';

import { ActionTriggers } from '@graasp/sdk';

import { NS } from '@/config/constants';

import {
  SELECT_ACTION_ID,
  buildSelectedActionChipId,
} from '~analytics/config/selectors';
import { DataContext } from '~analytics/context/DataProvider';

const ActionsSelect = (): JSX.Element | null => {
  const { t } = useTranslation(NS.Analytics);
  const { t: translateAction } = useTranslation(NS.Enums);
  const { actions, selectedActionTypes, setSelectedActionTypes } =
    useContext(DataContext);

  if (!actions?.length) {
    return null;
  }

  const allActions = [
    ...new Set(actions.map((a) => a.type as `${ActionTriggers}`)),
  ].map((ele) => ({
    title: translateAction(ele),
    value: ele,
  }));

  const handleChange = (
    _event: SyntheticEvent<Element, Event>,
    newActions: { title: string; value: string }[],
  ) => {
    setSelectedActionTypes(newActions.map((ele) => ele.value));
  };

  const currentValue = allActions.filter(
    ({ value }) => selectedActionTypes.indexOf(value) > -1,
  );

  return (
    <Stack direction="row" alignItems="center" width="100%">
      <FormControl fullWidth>
        <Autocomplete
          onChange={handleChange}
          options={allActions}
          getOptionLabel={(option) => option.title}
          renderInput={(params) => (
            <TextField {...params} label={t('ACTION_TYPES')} />
          )}
          multiple
          value={currentValue}
          limitTags={2}
          id={SELECT_ACTION_ID}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option.title}
                {...getTagProps({ index })}
                id={buildSelectedActionChipId(option.value)}
              />
            ))
          }
        />
      </FormControl>
    </Stack>
  );
};

export default ActionsSelect;
