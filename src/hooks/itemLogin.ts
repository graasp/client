import { UUID } from '@graasp/sdk';

import { useQuery } from 'react-query';

import * as Api from '../api';
import { UndefinedArgument } from '../config/errors';
import { itemKeys } from '../config/keys';
import { QueryClientConfig } from '../types';

export default (queryConfig: QueryClientConfig) => {
  const { defaultQueryOptions } = queryConfig;

  return {
    useItemLoginSchema: (
      args: {
        itemId: UUID;
      },
      options?: { enabled?: boolean },
    ) => {
      const enabledValue = (options?.enabled ?? true) && Boolean(args.itemId);
      return useQuery({
        queryKey: itemKeys.single(args.itemId).itemLoginSchema.content,
        queryFn: () => Api.getItemLoginSchema(args.itemId, queryConfig),
        ...defaultQueryOptions,
        enabled: enabledValue,
      });
    },

    useItemLoginSchemaType: (
      args: {
        itemId?: UUID;
      },
      options?: { enabled?: boolean },
    ) => {
      const enabledValue = (options?.enabled ?? true) && Boolean(args.itemId);
      return useQuery({
        queryKey: itemKeys.single(args.itemId).itemLoginSchema.type,
        queryFn: () => {
          if (!args.itemId) {
            throw new UndefinedArgument();
          }
          return Api.getItemLoginSchemaType(args.itemId, queryConfig);
        },
        ...defaultQueryOptions,
        enabled: enabledValue,
      });
    },
  };
};
