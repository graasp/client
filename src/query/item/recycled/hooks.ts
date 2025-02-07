import { Pagination } from '@graasp/sdk';

import { useInfiniteQuery } from '@tanstack/react-query';

import { memberKeys } from '../../keys.js';
import { getOwnRecycledItems } from './api.js';

/**
 * Returns paginated own recycled item data
 * @param pagination default and first page is 1
 * @returns paginated recycled item data
 */
export const useInfiniteOwnRecycledItems = (
  pagination?: Partial<Pagination>,
) => {
  return useInfiniteQuery({
    queryKey: memberKeys.current().infiniteRecycledItemData(),
    queryFn: ({ pageParam }) =>
      getOwnRecycledItems({ page: pageParam ?? 1, ...pagination }),
    getNextPageParam: (_lastPage, pages) => pages.length + 1,
    refetchOnWindowFocus: () => false,
    initialPageParam: 1,
  });
};
