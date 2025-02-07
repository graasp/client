import {
  Action,
  ActionData,
  AggregateBy,
  ExportActionsFormatting,
  UUID,
} from '@graasp/sdk';

import axios from 'axios';

import { API_HOST } from '@/config/env.js';

import { buildGetMemberActionsRoute } from '../member/routes.js';
import {
  buildExportActions,
  buildGetActions,
  buildGetAggregateActions,
  buildPostItemAction,
} from '../routes.js';
import { AggregateActionsArgs, MappedAggregateBy } from '../utils/action.js';

export const getActions = async (args: {
  itemId: UUID;
  requestedSampleSize: number;
  view: string;
  startDate: string;
  endDate: string;
}) =>
  axios
    .get<ActionData>(`${API_HOST}/${buildGetActions(args.itemId, args)}`)
    .then(({ data }) => data);

export const getMemberActions = async (args: {
  startDate: string;
  endDate: string;
}) =>
  axios
    .get<Action[]>(`${API_HOST}/${buildGetMemberActionsRoute(args)}`)
    .then(({ data }) => data);

export const getAggregateActions = async <K extends AggregateBy[]>(
  args: AggregateActionsArgs<K>,
) =>
  axios
    .get<
      ({ aggregateResult: number } & {
        // this adds a key for each element in the aggregation array and sets it to the relevant type
        [Key in K[number]]: MappedAggregateBy[Key];
      })[]
    >(`${API_HOST}/${buildGetAggregateActions(args)}`)
    .then(({ data }) => data);

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
