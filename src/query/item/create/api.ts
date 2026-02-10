import { AxiosProgressEvent } from 'axios';

import { API_HOST } from '@/config/env.js';
import type { GenericItem } from '@/openapi/client';

import { axiosClient as axios, verifyAuthentication } from '../../api/axios.js';
import {
  PostItemPayloadType,
  PostItemWithThumbnailPayloadType,
} from '../api.js';
import {
  buildPostItemRoute,
  buildPostItemWithThumbnailRoute,
  buildUploadFilesRoute,
} from '../routes.js';

export const postItem = async ({
  name,
  type,
  description,
  extra,
  parentId,
  geolocation,
  settings,
  previousItemId,
}: PostItemPayloadType): Promise<GenericItem> =>
  verifyAuthentication(() =>
    axios
      .post<GenericItem>(
        `${API_HOST}/${buildPostItemRoute(parentId, previousItemId)}`,
        {
          name: name.trim(),
          type,
          description,
          extra,
          geolocation,
          settings,
        },
      )
      .then(({ data }) => data),
  );

export const postItemWithThumbnail = async ({
  name,
  type,
  description,
  extra,
  parentId,
  geolocation,
  settings,
  thumbnail,
  previousItemId,
}: PostItemWithThumbnailPayloadType): Promise<GenericItem> =>
  verifyAuthentication(() => {
    const itemPayload = new FormData();
    // name and type are required
    itemPayload.append('name', name);
    itemPayload.append('type', type);
    if (description) {
      itemPayload.append('description', description);
    }
    if (geolocation) {
      itemPayload.append('geolocation', JSON.stringify(geolocation));
    }
    if (settings) {
      itemPayload.append('settings', JSON.stringify(settings));
    }
    if (extra) {
      itemPayload.append('extra', JSON.stringify(extra));
    }
    /* WARNING: this file field needs to be the last one,
     * otherwise the normal fields can not be read
     * https://github.com/fastify/fastify-multipart?tab=readme-ov-file#usage
     */
    itemPayload.append('file', thumbnail);
    return axios
      .post<GenericItem>(
        `${API_HOST}/${buildPostItemWithThumbnailRoute(parentId, previousItemId)}`,
        itemPayload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )
      .then(({ data }) => data);
  });

export const uploadFiles = async (args: {
  id?: GenericItem['id'];
  files: File[];
  previousItemId?: GenericItem['id'];
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}): Promise<GenericItem> =>
  verifyAuthentication(() => {
    const { id, previousItemId, files } = args;
    const itemPayload = new FormData();

    for (const f of files) {
      itemPayload.append('files', f);
    }
    return axios
      .post<GenericItem>(
        `${API_HOST}/${buildUploadFilesRoute(id, previousItemId)}`,
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
