import { API_HOST } from '@/config/env.js';
import { axiosClient as axios } from '@/query/api/axios.js';

import { PASSWORD_RESET_REQUEST_ROUTE } from '../routes.js';

export const createPasswordResetRequest = async (payload: {
  email: string;
  captcha: string;
}) => {
  const url = new URL(PASSWORD_RESET_REQUEST_ROUTE, API_HOST);
  return axios.post<void>(url.toString(), payload).then(({ data }) => data);
};

export const resolvePasswordResetRequest = async (payload: {
  password: string;
  token: string;
}) => {
  const url = new URL(PASSWORD_RESET_REQUEST_ROUTE, API_HOST);
  return axios
    .patch<void>(
      url.toString(),
      { password: payload.password },
      { headers: { Authorization: `Bearer ${payload.token}` } },
    )
    .then(({ data }) => data);
};
