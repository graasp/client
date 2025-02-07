import {
  CompleteMembershipRequest,
  Member,
  MembershipRequestStatus,
  UUID,
} from '@graasp/sdk';

import { API_HOST } from '@/config/env.js';
import { axiosClient as axios } from '@/query/api/axios.js';

import {
  buildDeleteMembershipRequestRoute,
  buildGetOwnMembershipRequestRoute,
  buildRequestMembershipRoute,
} from './routes.js';

export const requestMembership = async ({ id }: { id: UUID }) =>
  axios
    .post(`${API_HOST}/${buildRequestMembershipRoute(id)}`)
    .then(({ data }) => data);

export const getOwnMembershipRequest = async ({ id }: { id: UUID }) =>
  axios
    .get<{
      status: MembershipRequestStatus;
    }>(`${API_HOST}/${buildGetOwnMembershipRequestRoute(id)}`)
    .then(({ data }) => data);

export const getMembershipRequests = async ({ id }: { id: UUID }) =>
  axios
    .get<
      CompleteMembershipRequest[]
    >(`${API_HOST}/${buildRequestMembershipRoute(id)}`)
    .then(({ data }) => data);

export const deleteMembershipRequest = async ({
  itemId,
  memberId,
}: {
  itemId: UUID;
  memberId: Member['id'];
}) =>
  axios
    .delete(
      `${API_HOST}/${buildDeleteMembershipRequestRoute({ itemId, memberId })}`,
    )
    .then(({ data }) => data);
