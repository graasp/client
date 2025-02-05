import type { JSX } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import ClearIcon from '@mui/icons-material/Clear';
import { IconButton, TextField } from '@mui/material';

import { ItemConstants, MAX_ITEM_NAME_LENGTH } from '@graasp/sdk';

import { NS } from '@/config/constants';
import { ITEM_FORM_NAME_INPUT_ID } from '@/config/selectors';

import { BUILDER } from '../../../langs';

export type ItemNameFieldProps = {
  required?: boolean;
  autoFocus?: boolean;
  showClearButton?: boolean;
};

export const ItemNameField = ({
  required,
  autoFocus = true,
  showClearButton,
}: ItemNameFieldProps): JSX.Element => {
  const {
    register,
    reset,
    formState: { errors },
  } = useFormContext<{ name: string }>();
  const { t: translateBuilder } = useTranslation(NS.Builder);
  const { t: translateMessages } = useTranslation(NS.Messages);

  const handleClearClick = () => {
    reset({ name: '' });
  };

  return (
    <TextField
      variant="standard"
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={autoFocus}
      id={ITEM_FORM_NAME_INPUT_ID}
      label={translateBuilder(BUILDER.CREATE_NEW_ITEM_NAME_LABEL)}
      // always shrink because setting name from defined app does not shrink automatically
      slotProps={{
        inputLabel: { shrink: true },
        input: {
          // add a clear icon button
          endAdornment: (
            <IconButton
              onClick={handleClearClick}
              sx={{ visibility: showClearButton ? 'visible' : 'hidden' }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        },
      }}
      // only take full width when on small screen size
      fullWidth
      sx={{ my: 1 }}
      error={Boolean(errors.name)}
      helperText={errors.name?.message}
      {...register('name', {
        required: required
          ? translateBuilder(BUILDER.ITEM_NAME_CANNOT_BE_EMPTY)
          : false,
        pattern: {
          message: translateMessages('INVALID_ITEM_NAME_PATTERN_ERROR'),
          value: ItemConstants.ITEM_NAME_REGEX,
        },
        maxLength: {
          message: translateMessages('INVALID_ITEM_NAME_MAX_LENGTH_ERROR'),
          value: MAX_ITEM_NAME_LENGTH,
        },
      })}
    />
  );
};
