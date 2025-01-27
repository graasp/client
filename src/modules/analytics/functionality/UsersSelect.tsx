import { type JSX, SyntheticEvent, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Autocomplete,
  Chip,
  FormControl,
  Stack,
  TextField,
} from '@mui/material';

import { Member } from '@graasp/sdk';

import { NS } from '@/config/constants';

import {
  SELECT_USER_ID,
  buildSelectedUserChipId,
} from '~analytics/config/selectors';
import { DataContext } from '~analytics/context/DataProvider';

const UsersSelect = (): JSX.Element | null => {
  const { t } = useTranslation(NS.Analytics);
  const { selectedUsers, setSelectedUsers, allMembers } =
    useContext(DataContext);

  if (!allMembers?.length) {
    return null;
  }

  const handleChange = (
    _event: SyntheticEvent<Element, Event>,
    member: Member[],
  ) => {
    setSelectedUsers(member);
  };

  return (
    <Stack direction="row" alignItems="center" width="100%">
      <FormControl fullWidth>
        <Autocomplete
          multiple
          value={selectedUsers}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField {...params} label={t('USERS_SELECT')} />
          )}
          getOptionLabel={(option) => option.name}
          options={allMembers}
          limitTags={2}
          id={SELECT_USER_ID}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...props } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  variant="outlined"
                  label={option.name}
                  {...props}
                  id={buildSelectedUserChipId(option.name)}
                />
              );
            })
          }
        />
      </FormControl>
    </Stack>
  );
};

export default UsersSelect;
