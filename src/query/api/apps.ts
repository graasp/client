import { App, UUID } from '@graasp/sdk';

import { API_HOST } from '@/config/env.js';
import { axiosClient as axios } from '@/query/api/axios.js';

import {
  buildAppListRoute,
  buildGetApiAccessTokenRoute,
  buildMostUsedAppListRoute,
} from '../routes.js';
import { verifyAuthentication } from './axios.js';

export const getApps = async () =>
  verifyAuthentication(() =>
    axios
      .get<App[]>(`${API_HOST}/${buildAppListRoute}`)
      .then(({ data }) => data),
  );

export const getMostUsedApps = async () =>
  verifyAuthentication(() =>
    axios
      .get<
        { url: string; name: string; count: number }[]
      >(`${API_HOST}/${buildMostUsedAppListRoute}`)
      .then(({ data }) => data),
  );

export const requestApiAccessToken = async (args: {
  id: UUID;
  key: string;
  origin: string;
}) => {
  const { id, key, origin } = args;
  return axios
    .post<{ token: string }>(`${API_HOST}/${buildGetApiAccessTokenRoute(id)}`, {
      origin,
      key,
    })
    .then(({ data }) => data);
};
