import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

import { MAX_ZIP_FILE_SIZE, formatFileSize } from '@graasp/sdk';

import { useParams } from '@tanstack/react-router';

import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import { ZIP_DASHBOARD_UPLOADER_ID } from '@/config/selectors';
import UploadFileButton from '@/ui/upload/UploadFileButton/UploadFileButton';

import { BUILDER } from '../../langs';
import { useUploadWithProgress } from '../hooks/uploadWithProgress';

const ImportZip = (): JSX.Element => {
  const { itemId } = useParams({ strict: false });
  const { mutateAsync: importZip } = mutations.useImportZip();
  const { update, close: closeNotification } = useUploadWithProgress();

  const { t: translateBuilder } = useTranslation(NS.Builder);

  return (
    <Box overflow="auto">
      <Typography variant="body1">
        {translateBuilder(BUILDER.IMPORT_ZIP_INFORMATION)}
      </Typography>
      <Typography variant="body1">
        {translateBuilder(BUILDER.IMPORT_ZIP_WARNING)}
      </Typography>
      <Typography variant="body1">
        {translateBuilder(BUILDER.IMPORT_ZIP_LIMITATIONS_TEXT, {
          maxSize: formatFileSize(MAX_ZIP_FILE_SIZE),
        })}
      </Typography>
      <UploadFileButton
        isLoading={false}
        onChange={(e) => {
          if (e.target.files?.length) {
            importZip({
              onUploadProgress: update,
              id: itemId,
              file: e.target.files[0],
            })
              .then(() => {
                closeNotification();
              })
              .catch((error) => {
                closeNotification(error);
              });
          }
        }}
        accept=".zip"
        id={ZIP_DASHBOARD_UPLOADER_ID}
        text={translateBuilder(BUILDER.IMPORT_ZIP_BUTTON)}
      />
    </Box>
  );
};

export default ImportZip;
