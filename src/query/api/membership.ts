import { SimpleMembershipRequest, UUID } from '@graasp/sdk';

import { API_HOST } from '@/config/env.js';
import type { ItemMembership } from '@/openapi/client';
import { axiosClient as axios } from '@/query/api/axios.js';

import {
  buildGetItemMembershipsForItemRoute,
  buildGetMembershipRequestsForItemRoute,
} from '../routes.js';

export const getMembershipsForItem = async (id: UUID) =>
  axios
    .get<
      ItemMembership[]
    >(`${API_HOST}/${buildGetItemMembershipsForItemRoute(id)}`)
    .then(({ data }) => data);

export const getMembershipRequestsForItem = async (id: UUID) =>
  axios
    .get<
      SimpleMembershipRequest[]
    >(`${API_HOST}/${buildGetMembershipRequestsForItemRoute(id)}`)
    .then(({ data }) => data);
