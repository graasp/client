import { type JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';

import { DiscriminatedItem, MAX_NUMBER_OF_FILES_UPLOAD } from '@graasp/sdk';

import { useParams } from '@tanstack/react-router';
import { AxiosProgressEvent } from 'axios';

import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import FileDropper from '@/ui/upload/FileDropper/FileDropper';

type Props = {
  onComplete?: () => void;
  onUpdate?: (e: AxiosProgressEvent) => void;
  onError?: (e: Error) => void;
  buttons?: JSX.Element;
  onStart?: () => void;
  /** id of the component */
  id?: string;
  previousItemId?: DiscriminatedItem['id'];
};

export function FileUploader({
  onError,
  onUpdate,
  onComplete,
  onStart,
  buttons,
  id,
  previousItemId,
}: Readonly<Props>): JSX.Element | null {
  const { t } = useTranslation(NS.Builder);
  const { itemId: parentItemId } = useParams({ strict: false });
  const [error, setError] = useState<string>();

  const { mutateAsync: uploadFiles, isPending } = mutations.useUploadFiles();

  const [totalProgress, setTotalProgress] = useState(0);

  // send n request as long as the backend cannot handle multi files
  // complex notification handling to keep one uploading toast
  // trigger n success toast
  const onDrop = async (files: File[]): Promise<void> => {
    // update progress callback function scaled over the number of files sent
    const updateForManyFiles = (idx: number) => (e: AxiosProgressEvent) => {
      // suppose previous files are completely uploaded
      const progress = ((e.progress ?? 0) + idx) / files.length;
      setTotalProgress(progress);
      onUpdate?.({ ...e, progress });
    };

    if (files.length > MAX_NUMBER_OF_FILES_UPLOAD) {
      setError(
        t('CANNOT_UPLOAD_MORE_FILES', {
          count: MAX_NUMBER_OF_FILES_UPLOAD,
        }),
      );
      onError?.({
        message: t('CANNOT_UPLOAD_MORE_FILES', {
          count: MAX_NUMBER_OF_FILES_UPLOAD,
        }),
      } as Error);
      return;
    }
    setError(undefined);

    onStart?.();

    for (let idx = 0; idx < files.length; idx += 1) {
      try {
        await uploadFiles({
          files: [files[idx]],
          id: parentItemId,
          previousItemId,
          onUploadProgress: updateForManyFiles(idx),
        });
      } catch (e) {
        onError?.(e as Error);
      }
    }
    onComplete?.();
  };

  return (
    <Box width="100%" id={id} height="100%">
      <FileDropper
        message={t('DROPZONE_HELPER_TEXT')}
        onChange={(e) => {
          if (e.target.files) {
            // transform from filelist to file array
            onDrop([...e.target.files]);
          }
        }}
        isLoading={isPending}
        uploadProgress={Math.ceil(totalProgress * 100)}
        multiple
        onDrop={onDrop}
        error={error}
        buttonText={t('DROPZONE_HELPER_ACTION')}
        hints={t('DROPZONE_HELPER_LIMIT_REMINDER_TEXT')}
        buttons={buttons}
      />
    </Box>
  );
}
