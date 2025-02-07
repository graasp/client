import { ItemBookmark, PackedItemBookmark, UUID } from '@graasp/sdk';

import { API_HOST } from '@/config/env.js';
import { axiosClient as axios } from '@/query/api/axios.js';

import {
  GET_BOOKMARKED_ITEMS_ROUTE,
  buildBookmarkedItemRoute,
} from '../routes.js';
import { verifyAuthentication } from './axios.js';

export const getBookmarkedItems = async () =>
  verifyAuthentication(() =>
    axios
      .get<PackedItemBookmark[]>(`${API_HOST}/${GET_BOOKMARKED_ITEMS_ROUTE}`)
      .then(({ data }) => data),
  );

export const addBookmarkedItem = async (id: UUID) =>
  verifyAuthentication(() =>
    axios
      .post<ItemBookmark>(`${API_HOST}/${buildBookmarkedItemRoute(id)}`)
      .then(({ data }) => data),
  );

export const removeBookmarkedItem = async (id: UUID) =>
  verifyAuthentication(() =>
    axios
      .delete<UUID>(`${API_HOST}/${buildBookmarkedItemRoute(id)}`)
      .then(({ data }) => data),
  );
