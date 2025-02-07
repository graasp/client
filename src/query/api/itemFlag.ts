import { ItemFlag, UUID } from '@graasp/sdk';

import axios from 'axios';

import { API_HOST } from '@/config/env.js';

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
