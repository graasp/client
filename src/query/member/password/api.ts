import axios from 'axios';

import { API_HOST } from '@/config/env.js';

import { buildGetPasswordStatusRoute } from './routes.js';

export const getPasswordStatus = async () =>
  axios
    .get<{
      hasPassword: boolean;
    }>(`${API_HOST}/${buildGetPasswordStatusRoute()}`)
    .then(({ data }) => data);
