import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { BorderedSection } from '@/components/layout/BorderedSection';
import { Button } from '@/components/ui/Button';
import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import { EXPORT_DATA_BUTTON_ID } from '@/config/selectors';

export function ExportMemberData(): JSX.Element {
  const { t } = useTranslation(NS.Account);

  const [isExported, setIsExported] = useState(false);
  const { mutate: exportData } = mutations.useExportMemberData();
  const onClick = () => {
    exportData();
    setIsExported(true);
  };

  return (
    <BorderedSection title={t('EXPORT_INFORMATIONS_TITLE')}>
      <Stack direction="column" spacing={2}>
        <Typography variant="body2">
          {t('EXPORT_INFORMATIONS_DESCRIPTION')}
        </Typography>
        <Button
          onClick={onClick}
          disabled={isExported}
          id={EXPORT_DATA_BUTTON_ID}
          variant="contained"
        >
          {t('EXPORT_INFORMATIONS_BUTTON_TEXT')}
        </Button>
      </Stack>
    </BorderedSection>
  );
}
