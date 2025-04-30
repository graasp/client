import { Trans, useTranslation } from 'react-i18next';

import CloseIcon from '@mui/icons-material/Close';
import { Alert, AlertTitle, Collapse, IconButton } from '@mui/material';

import { useQuery } from '@tanstack/react-query';
import { formatDate } from 'date-fns';

import { NS } from '@/config/constants';
import { getLocalForDateFns } from '@/config/langs';
import { getNextMaintenanceOptions } from '@/openapi/client/@tanstack/react-query.gen';

import { useLocalStorage } from './useLocalStorage';

function MaintenanceAnnouncement({
  mb = 0,
  suffix,
  showCloseButton = true,
}: Readonly<{ mb?: number; suffix: string; showCloseButton?: boolean }>) {
  const { i18n, t } = useTranslation(NS.Builder);
  const { data: maintenance } = useQuery(getNextMaintenanceOptions());
  const { value: isClosed, changeValue: setIsClosed } = useLocalStorage(
    `maintenance-${maintenance?.slug}-closed-${suffix}`,
    // show by default if a maintenance exists
    !maintenance,
  );

  if (maintenance) {
    return (
      <Collapse in={!isClosed}>
        <Alert
          action={
            showCloseButton && (
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setIsClosed(true);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            )
          }
          severity="warning"
          sx={{ fontSize: 16, mb }}
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
                fromDate: formatDate(maintenance.startAt, 'PPP', {
                  locale: getLocalForDateFns(i18n.language),
                }),
                toDate: formatDate(maintenance.endAt, 'PPP', {
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
                fromDate: formatDate(maintenance.startAt, 'PPPppp', {
                  locale: getLocalForDateFns(i18n.language),
                }),
                toDate: formatDate(maintenance.endAt, 'PPPppp', {
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

  return null;
}

export default MaintenanceAnnouncement;
