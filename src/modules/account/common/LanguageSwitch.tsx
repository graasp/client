import { SelectChangeEvent } from '@mui/material';

import { langs } from '@graasp/translations';
import { Select } from '@graasp/ui';

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

  return (
    <Select
      variant="outlined"
      id={id}
      size="small"
      onChange={handleChange}
      value={lang}
      buildOptionId={(value) => value}
      values={Object.entries(langs).map(([value, text]) => ({ value, text }))}
    />
  );
};

export default LanguageSwitch;
