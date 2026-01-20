import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { SelectChangeEvent } from '@mui/material';

import { NS, emailFrequency } from '@/config/constants';
import type { NotificationFrequency } from '@/openapi/client';
import Select from '@/ui/Select/Select';

type EmailPreferenceSwitchProps = {
  id?: string;
  value: NotificationFrequency;
  onChange: (newEmailFreq: NotificationFrequency) => void;
};

export function EmailPreferenceSwitch({
  id,
  value,
  onChange,
}: Readonly<EmailPreferenceSwitchProps>): JSX.Element {
  const { t } = useTranslation(NS.Account);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newEmailFreq = event.target.value as NotificationFrequency;
    if (newEmailFreq) {
      onChange(newEmailFreq);
    } else {
      console.error(`The frequency ${event.target.value} is not valid`);
    }
  };

  return (
    <Select
      id={id}
      defaultValue={value}
      onChange={handleChange}
      variant="outlined"
      size="small"
      values={Object.entries(emailFrequency).map(([freq, name]) => ({
        value: freq,
        text: t(name),
      }))}
    />
  );
}
