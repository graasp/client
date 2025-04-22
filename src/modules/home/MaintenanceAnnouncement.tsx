import { Trans, useTranslation } from 'react-i18next';

import { Alert } from '@mui/material';

import { formatDate } from 'date-fns';

import { NS } from '@/config/constants';
import { getLocalForDateFns } from '@/config/langs';

function MaintenanceAnnouncement() {
  const { t, i18n } = useTranslation(NS.Builder, { keyPrefix: 'MAINTENANCE' });
  return (
    <Alert severity="info">
      <Trans
        i18n={i18n}
        ns={NS.Builder}
        i18nKey="MAINTENANCE.INTRODUCTION"
        values={{
          fromDate: formatDate('23 April 2025', 'PPP', {
            locale: getLocalForDateFns(i18n.language),
          }),
          toDate: formatDate('25 April 2025', 'PPP', {
            locale: getLocalForDateFns(i18n.language),
          }),
        }}
        components={{ b: <strong /> }}
      />
      <br />
      <Trans
        i18n={i18n}
        ns={NS.Builder}
        i18nKey="MAINTENANCE.DETAILS"
        values={{
          fromDate: formatDate('23-Apr-25 15:00:00 UTC', 'PPPppp', {
            locale: getLocalForDateFns(i18n.language),
          }),
          toDate: formatDate('25-Apr-25 16:00:00 UTC', 'PPPppp', {
            locale: getLocalForDateFns(i18n.language),
          }),
        }}
        components={{ b: <strong /> }}
      />
    </Alert>
  );
}

export default MaintenanceAnnouncement;
