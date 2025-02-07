import { ItemLike, PackedItemLike, UUID } from '@graasp/sdk';

import axios from 'axios';

import { API_HOST } from '@/config/env.js';

import {
  buildDeleteItemLikeRoute,
  buildGetItemLikesRoute,
  buildGetLikesForMemberRoute,
  buildPostItemLikeRoute,
} from '../routes.js';
import { verifyAuthentication } from './axios.js';

export const getLikedItems = async (memberId: UUID) =>
  verifyAuthentication(() =>
    axios
      .get<
        PackedItemLike[]
      >(`${API_HOST}/${buildGetLikesForMemberRoute(memberId)}`)
      .then(({ data }) => data),
  );

export const getItemLikes = async (id: UUID) =>
  axios
    .get<ItemLike[]>(`${API_HOST}/${buildGetItemLikesRoute(id)}`)
    .then(({ data }) => data);

export const postItemLike = async (itemId: UUID) =>
  verifyAuthentication(() =>
    axios
      .post<ItemLike>(`${API_HOST}/${buildPostItemLikeRoute(itemId)}`)
      .then(({ data }) => data),
  );

export const deleteItemLike = async (itemId: UUID) =>
  verifyAuthentication(() =>
    axios
      .delete<ItemLike>(`${API_HOST}/${buildDeleteItemLikeRoute(itemId)}`)
      .then(({ data }) => data),
  );
