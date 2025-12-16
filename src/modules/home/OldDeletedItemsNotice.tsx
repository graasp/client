import { Trans, useTranslation } from 'react-i18next';

import { Alert } from '@mui/material';

import { NS } from '@/config/constants';

import { useLocalStorage } from './useLocalStorage';

export function OldDeletedItemsNotice({
  forceOpen = false,
}: Readonly<{
  forceOpen?: boolean;
}>) {
  const { t } = useTranslation(NS.Home);

  const { value: isClosed, changeValue: setIsClosed } = useLocalStorage(
    `old-deleted-items-notice-closed`,
    false,
  );

  if (!forceOpen && isClosed) {
    return null;
  }

  return (
    <Alert
      severity="info"
      onClose={
        forceOpen
          ? undefined
          : () => {
              setIsClosed(true);
            }
      }
    >
      <Trans
        t={t}
        i18nKey={'OLD_DELETED_ITEMS_NOTICE'}
        components={{ b: <b /> }}
      />
    </Alert>
  );
}
