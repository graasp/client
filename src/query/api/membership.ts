import { Account, PermissionLevelOptions, UUID } from '@graasp/sdk';

import { API_HOST } from '@/config/env.js';
import { ItemMembership } from '@/openapi/client/types.gen.js';
import { axiosClient as axios } from '@/query/api/axios.js';

import {
  buildGetItemMembershipsForItemRoute,
  buildPostItemMembershipRoute,
} from '../routes.js';
import { verifyAuthentication } from './axios.js';

export const getMembershipsForItem = async (id: UUID) =>
  axios
    .get<
      ItemMembership[]
    >(`${API_HOST}/${buildGetItemMembershipsForItemRoute(id)}`)
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
