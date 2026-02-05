/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation } from '@tanstack/react-query';
import { AxiosProgressEvent } from 'axios';

import type { Item } from '@/openapi/client';

import { type QueryClientConfig } from '../../types.js';
import { importZipRoutine } from '../routines.js';
import { importZip } from './api.js';

export const useImportZip = (queryConfig: QueryClientConfig) => () => {
  const { notifier } = queryConfig;
  return useMutation({
    mutationFn: async (args: {
      id?: Item['id'];
      file: Blob;
      onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
    }) => importZip(args),
    onSuccess: () => {
      // send request notification, async endpoint
      notifier?.({
        type: importZipRoutine.SUCCESS,
        payload: { message: 'IMPORT_ZIP' },
      });
    },
    onError: (error: Error) => {
      notifier?.({
        type: importZipRoutine.FAILURE,
        payload: { error },
      });
    },
  });
};
