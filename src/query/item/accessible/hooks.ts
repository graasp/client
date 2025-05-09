/* eslint-disable react-hooks/rules-of-hooks */
import { Pagination } from '@graasp/sdk';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { ITEM_PAGE_SIZE } from '~builder/constants.js';

import useDebounce from '../../hooks/useDebounce.js';
import { itemKeys } from '../../keys.js';
import { QueryClientConfig } from '../../types.js';
import { getAccessibleItemsRoutine } from '../routines.js';
import { ItemSearchParams } from '../types.js';
import { getAccessibleItems } from './api.js';

/**
 * Returns items the highest in the tree you have access to
 * Is paginated by default
 * @param params
 * @param pagination  default and first page is 1
 * @param _options
 * @returns
 */
export const useAccessibleItems =
  (queryConfig: QueryClientConfig) =>
  (params?: ItemSearchParams, pagination?: Partial<Pagination>) => {
    const { defaultQueryOptions } = queryConfig;
    const debouncedKeywords = useDebounce(params?.keywords, 500);
    const finalParams = { ...params, keywords: debouncedKeywords };
    const paginationParams = { ...(pagination ?? {}) };

    return useQuery({
      queryKey: itemKeys.accessiblePage(finalParams, paginationParams),
      queryFn: () => getAccessibleItems(finalParams, paginationParams),
      meta: {
        routine: getAccessibleItemsRoutine,
      },
      ...defaultQueryOptions,
    });
  };

/**
 * Returns query and accummulated data through navigating the pages
 * Is paginated by default
 * @param params
 * @param pagination default and first page is 1
 * @returns
 */
export const useInfiniteAccessibleItems =
  (queryConfig: QueryClientConfig) =>
  (params?: ItemSearchParams, pagination?: Partial<Pagination>) => {
    const debouncedKeywords = useDebounce(params?.keywords, 500);
    const finalParams = { ...params, keywords: debouncedKeywords };

    return useInfiniteQuery({
      queryKey: itemKeys.infiniteAccessible(finalParams),
      queryFn: ({ pageParam }) =>
        getAccessibleItems(finalParams, {
          page: pageParam ?? 1,
          ...pagination,
        }),
      getNextPageParam: (lastPage, pages) => {
        // return next page number if last page is full (migth still have more to show)
        return lastPage.data.length < (pagination?.pageSize ?? ITEM_PAGE_SIZE)
          ? undefined
          : pages.length + 1;
      },
      refetchOnWindowFocus: () => false,
      initialPageParam: 1,
      ...queryConfig.defaultQueryOptions,
    });
  };
