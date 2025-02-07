import { ItemFlag, UUID } from '@graasp/sdk';

import { API_HOST } from '@/config/env.js';
import { axiosClient as axios } from '@/query/api/axios.js';

import { buildPostItemFlagRoute } from '../routes.js';

// payload: flagId, itemId
export const postItemFlag = async ({
  type,
  itemId,
}: {
  type: UUID;
  itemId: string;
}) =>
  axios
    .post<ItemFlag>(`${API_HOST}/${buildPostItemFlagRoute(itemId)}`, {
      type,
    })
    .then(({ data }) => data);
