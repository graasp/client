import { Paginated, Pagination } from '@graasp/sdk';

import { API_HOST } from '@/config/env.js';
import type { PackedItem } from '@/openapi/client';
import { axiosClient as axios } from '@/query/api/axios.js';

import { verifyAuthentication } from '../../api/axios.js';
import { buildGetOwnRecycledItemRoute } from './routes.js';

export const getOwnRecycledItems = async (pagination: Partial<Pagination>) =>
  verifyAuthentication(() =>
    axios
      .get<
        Paginated<PackedItem>
      >(`${API_HOST}/${buildGetOwnRecycledItemRoute(pagination)}`)
      .then(({ data }) => data),
  );
