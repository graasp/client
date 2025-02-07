import { DiscriminatedItem } from '@graasp/sdk';

import axios from 'axios';

import { API_HOST } from '@/config/env.js';

import { verifyAuthentication } from '../../api/axios.js';
import { buildEnroll } from './routes.js';

export const enroll = async ({ itemId }: { itemId: DiscriminatedItem['id'] }) =>
  verifyAuthentication(() => {
    return axios.post<void>(`${API_HOST}/${buildEnroll(itemId)}`);
  });
