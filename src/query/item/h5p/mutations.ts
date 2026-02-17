/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosProgressEvent } from 'axios';

import type { GenericItem } from '@/openapi/client';

import { getKeyForParentId } from '../../keys.js';
import { type QueryClientConfig } from '../../types.js';
import { importH5PRoutine } from '../routines.js';
import { importH5P } from './api.js';

export const useImportH5P = (queryConfig: QueryClientConfig) => () => {
  const queryClient = useQueryClient();
  const { notifier } = queryConfig;
  return useMutation({
    mutationFn: async (args: {
      id?: GenericItem['id'];
      file: Blob;
      previousItemId?: GenericItem['id'];
      onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
    }) => importH5P(args),
    onSuccess: () => {
      notifier?.({
        type: importH5PRoutine.SUCCESS,
        payload: { message: 'IMPORT_H5P' },
      });
    },
    onError: (error: Error) => {
      notifier?.({
        type: importH5PRoutine.FAILURE,
        payload: { error },
      });
    },
    onSettled: (_data, _error, { id }) => {
      const parentKey = getKeyForParentId(id);
      queryClient.invalidateQueries({ queryKey: parentKey });
    },
  });
};
