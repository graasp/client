import { TagCategoryType } from '@graasp/sdk';

import { useQuery } from '@tanstack/react-query';

import { QueryClientConfig } from '../types.js';
import { getTagCounts } from './api.js';
import { tagKeys } from './keys.js';

export default (queryConfig: QueryClientConfig) => {
  const { defaultQueryOptions } = queryConfig;

  return {
    useTags: ({
      search,
      category,
    }: {
      search?: string;
      category?: TagCategoryType;
    }) => {
      return useQuery({
        queryKey: tagKeys.search({
          search,
          category,
        }),
        queryFn: () =>
          getTagCounts({
            search,
            category,
          }),
        enabled: Boolean(search),
        ...defaultQueryOptions,
      });
    },
  };
};
