import { Action, ExportActionsFormatting, UUID } from '@graasp/sdk';

import { API_HOST } from '@/config/env.js';
import { axiosClient as axios } from '@/query/api/axios.js';

import { buildExportActions, buildPostItemAction } from '../routes.js';

export const exportActions = async (args: {
  itemId: UUID;
  format: ExportActionsFormatting;
}) =>
  axios.post<void>(
    `${API_HOST}/${buildExportActions(args.itemId, args.format)}`,
  );

export const postItemAction = async (
  itemId: UUID,
  payload: { type: string; extra?: { [key: string]: unknown } },
) => axios.post<Action>(`${API_HOST}/${buildPostItemAction(itemId)}`, payload);
