import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import CloseIcon from '@mui/icons-material/Close';
import { Alert, AlertTitle, Collapse, IconButton } from '@mui/material';

import { formatDate } from 'date-fns';

import { NS } from '@/config/constants';
import { getLocalForDateFns } from '@/config/langs';

function MaintenanceAnnouncement({ mb = 0 }: Readonly<{ mb?: number }>) {
  const { i18n, t } = useTranslation(NS.Builder);
  const [open, setOpen] = useState(true);

  return (
    <Collapse in={open}>
      <Alert
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        severity="warning"
        sx={{ fontSize: 16, mb }}
        closeText="hello"
      >
        <AlertTitle sx={{ fontWeight: 'bold' }}>
          {t('MAINTENANCE.TITLE')}
        </AlertTitle>
        <p>
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
        </p>
        <p>
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
        </p>
      </Alert>
    </Collapse>
  );
}

export default MaintenanceAnnouncement;
