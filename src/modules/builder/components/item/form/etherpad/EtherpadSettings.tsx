import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormControlLabel, FormGroup, Switch } from '@mui/material';

import { NS } from '@/config/constants';

function EtherpadSettings() {
  const { t } = useTranslation(NS.Builder);
  const { control } = useFormContext<{ allowReaderToWrite: boolean }>();

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Controller
            name="allowReaderToWrite"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onChange={(_, checked) => {
                  field.onChange(checked);
                }}
              />
            )}
          />
        }
        label={t('ETHERPAG_ALLOW_READER_TO_WRITE_SETTING')}
      />
    </FormGroup>
  );
}

export default EtherpadSettings;
