import { UUID } from '@graasp/sdk';

import { useQuery } from '@tanstack/react-query';

import * as Api from '../api/action.js';
import { UndefinedArgument } from '../config/errors.js';
import {
  buildActionsKey,
  buildAggregateActionsKey,
  memberKeys,
} from '../keys.js';
import { AggregateActionsArgs, MappedAggregateBy } from '../utils/action.js';

export const useActions = (
  args: {
    itemId?: UUID;
    view: string;
    requestedSampleSize: number;
    startDate: string;
    endDate: string;
  },
  options?: { enabled?: boolean },
) => {
  const enabledValue =
    (options?.enabled ?? true) &&
    Boolean(args.itemId) &&
    Boolean(args.requestedSampleSize);
  return useQuery({
    queryKey: buildActionsKey(args),
    queryFn: () => {
      const { itemId } = args;
      if (!itemId) {
        throw new UndefinedArgument();
      }
      return Api.getActions({
        itemId,
        view: args.view,
        requestedSampleSize: args.requestedSampleSize,
        startDate: args.startDate,
        endDate: args.endDate,
      });
    },
    enabled: enabledValue,
  });
};

export const useAggregateActions = <T extends (keyof MappedAggregateBy)[]>(
  itemId: string | undefined,
  args: Omit<AggregateActionsArgs<T>, 'itemId'>,
  options?: { enabled?: boolean },
) => {
  const enabledValue =
    (options?.enabled ?? true) &&
    Boolean(itemId) &&
    Boolean(args.requestedSampleSize);
  return useQuery({
    queryKey: buildAggregateActionsKey(itemId, args),
    queryFn: () => {
      if (!itemId) {
        throw new UndefinedArgument();
      }
      return Api.getAggregateActions<T>({ itemId, ...args });
    },
    enabled: enabledValue,
  });
};

export const useMemberActions = (args: {
  startDate: string;
  endDate: string;
}) =>
  useQuery({
    queryKey: memberKeys.current().actions(args),
    queryFn: () => Api.getMemberActions(args),
  });
