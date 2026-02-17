import { AxiosProgressEvent } from 'axios';

import { API_HOST } from '@/config/env.js';
import type { GenericItem } from '@/openapi/client';

import { axiosClient as axios, verifyAuthentication } from '../../api/axios.js';
import { buildImportH5PRoute } from '../../routes.js';

export const importH5P = async (args: {
  id?: GenericItem['id'];
  file: Blob;
  previousItemId?: GenericItem['id'];
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}): Promise<GenericItem> =>
  verifyAuthentication(() => {
    const { id, previousItemId, file } = args;
    const itemPayload = new FormData();

    /* WARNING: this file field needs to be the last one,
     * otherwise the normal fields can not be read
     * https://github.com/fastify/fastify-multipart?tab=readme-ov-file#usage
     */
    itemPayload.append('files', file);
    return axios
      .post<GenericItem>(
        `${API_HOST}/${buildImportH5PRoute(id, previousItemId)}`,
        itemPayload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },

          onUploadProgress: (progressEvent) => {
            args.onUploadProgress?.(progressEvent);
          },
        },
      )
      .then(({ data }) => data);
  });
