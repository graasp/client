import { ChangeEvent, type JSX } from 'react';

import { InputAdornment, TextField, type TextFieldProps } from '@mui/material';

import { SearchIcon } from 'lucide-react';

export type Props = {
  ariaLabel?: string;
  inputBaseId?: string;
  onChange?: (event: ChangeEvent<{ value: string }>) => void;
  placeholder?: string;
  value?: string;
  width?: string | number;
  margin?: TextFieldProps['margin'];
  size?: TextFieldProps['size'];
  /**
   * Name of the event to send to Umami for tracking user actions
   */
  dataUmamiEvent?: string;
};

// todo: create minified version for small screens
export const SearchInput = ({
  ariaLabel = 'search',
  inputBaseId,
  onChange,
  placeholder = 'Search…',
  value = '',
  width,
  margin,
  size,
  dataUmamiEvent,
}: Props): JSX.Element => {
  return (
    <TextField
      margin={margin}
      id={inputBaseId}
      onChange={onChange}
      value={value}
      sx={{
        flex: 1,
        width: width ?? '100%',
        backgroundColor: 'white',
        maxWidth: 200,
      }}
      placeholder={placeholder}
      size={size}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon aria-label="search" />
            </InputAdornment>
          ),
        },
        htmlInput: {
          'aria-label': ariaLabel,
          // Umami data props
          'data-umami-event': dataUmamiEvent,
        },
      }}
    />
  );
};

export default SearchInput;
