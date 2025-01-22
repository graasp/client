import {
  MenuItem,
  Select as MuiSelect,
  SelectChangeEvent,
} from '@mui/material';

import { LANGS } from '@/config/langs';

type Props = {
  id?: string;
  lang: string;
  onChange: (newLang: string) => void;
};

const LanguageSwitch = ({ id, lang, onChange }: Props): JSX.Element => {
  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const newLang = event.target.value as string;
    if (newLang) {
      onChange(newLang);
    } else {
      console.error('The lang is not valid');
    }
  };

  const values = Object.entries(LANGS).map(([value, text]) => ({
    value,
    text,
  }));

  return (
    <MuiSelect
      id={id}
      onChange={handleChange}
      renderValue={(v) => v.toUpperCase()}
      variant="outlined"
      value={lang}
      size="small"
      sx={{ backgroundColor: 'rgb(255,255,255,45%)' }}
    >
      {values.map(({ value, text }) => (
        <MenuItem key={value} id={value} value={value}>
          {text}
        </MenuItem>
      ))}
    </MuiSelect>
  );
};

export default LanguageSwitch;
