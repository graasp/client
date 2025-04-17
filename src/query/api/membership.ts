import {
  Account,
  ItemMembership,
  PermissionLevelOptions,
  UUID,
} from '@graasp/sdk';

import { API_HOST } from '@/config/env.js';
import { axiosClient as axios } from '@/query/api/axios.js';

import {
  buildDeleteItemMembershipRoute,
  buildEditItemMembershipRoute,
  buildGetItemMembershipsForItemsRoute,
  buildPostItemMembershipRoute,
} from '../routes.js';
import { verifyAuthentication } from './axios.js';

export const getMembershipsForItems = async (ids: UUID[]) =>
  axios
    .get<
      ItemMembership[]
    >(`${API_HOST}/${buildGetItemMembershipsForItemsRoute(ids)}`)
    .then(({ data }) => data);

export const postItemMembership = async ({
  id,
  accountId,
  permission,
}: {
  id: UUID;
  accountId: Account['id'];
  permission: PermissionLevelOptions;
}) => {
  return verifyAuthentication(() =>
    axios
      .post<ItemMembership>(`${API_HOST}/${buildPostItemMembershipRoute(id)}`, {
        // assume will receive only one member
        accountId,
        permission,
      })
      .then(({ data }) => data),
  );
};

export const editItemMembership = async ({
  id,
  permission,
}: {
  id: UUID;
  permission: PermissionLevelOptions;
}) =>
  verifyAuthentication(() =>
    axios
      .patch<ItemMembership>(
        `${API_HOST}/${buildEditItemMembershipRoute(id)}`,
        {
          permission,
        },
      )
      .then(({ data }) => data),
  );

export const deleteItemMembership = async ({ id }: { id: UUID }) =>
  verifyAuthentication(() =>
    axios
      .delete<ItemMembership>(
        `${API_HOST}/${buildDeleteItemMembershipRoute(id)}`,
      )
      .then(({ data }) => data),
  );
