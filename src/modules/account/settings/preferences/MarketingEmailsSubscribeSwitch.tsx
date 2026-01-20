import type { ChangeEvent, JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Switch } from '@mui/material';

import { NS } from '@/config/constants';

type Props = {
  value: boolean;
  onChange: (newValue: boolean) => void;
};

export function MarketingEmailsSubscribeSwitch({
  value,
  onChange,
}: Readonly<Props>): JSX.Element {
  const { t } = useTranslation(NS.Account);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    onChange(newValue);
  };

  return (
    <Switch
      name={t('PROFILE_ENABLE_EMAIL_SUBSCRIPTION.TITLE')}
      onChange={handleChange}
      checked={value}
    />
  );
}
