import { useQuery } from '@tanstack/react-query';

import type { EtherpadItem } from '@/openapi/client';

import * as Api from '../api/etherpad.js';
import { UndefinedArgument } from '../config/errors.js';
import { itemKeys } from '../keys.js';
import { QueryClientConfig } from '../types.js';

export default (queryConfig: QueryClientConfig) => {
  const { defaultQueryOptions } = queryConfig;

  return {
    useEtherpad: (item: EtherpadItem | undefined, mode: 'read' | 'write') =>
      useQuery({
        queryKey: itemKeys.single(item?.id).etherpad,
        queryFn: () => {
          if (item?.type !== 'etherpad') {
            throw new Error('Item is not an etherpad item');
          }

          if (!item.id) {
            throw new UndefinedArgument();
          }
          return Api.getEtherpad({ itemId: item.id, mode }, queryConfig);
        },
        enabled: Boolean(item?.id),
        ...defaultQueryOptions,
      }),
  };
};
