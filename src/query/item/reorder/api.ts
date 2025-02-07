import { UUID } from '@graasp/sdk';

import axios from 'axios';

import { API_HOST } from '@/config/env.js';

import { buildReorderItemRoute } from '../routes.js';

export const reorderItem = async (args: { id: UUID; previousItemId?: UUID }) =>
  axios
    .patch<string>(`${API_HOST}/${buildReorderItemRoute(args)}`, {
      previousItemId: args.previousItemId,
    })
    .then(({ data }) => data);
