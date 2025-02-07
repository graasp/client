import { DiscriminatedItem } from '@graasp/sdk';

import { API_HOST } from '@/config/env.js';
import { axiosClient as axios } from '@/query/api/axios.js';

import { verifyAuthentication } from '../../api/axios.js';
import { buildEnroll } from './routes.js';

export const enroll = async ({ itemId }: { itemId: DiscriminatedItem['id'] }) =>
  verifyAuthentication(() => {
    return axios.post<void>(`${API_HOST}/${buildEnroll(itemId)}`);
  });
