import { Member, UUID } from '@graasp/sdk';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QueryClientConfig } from '../../types.js';
import { deleteMembershipRequest, requestMembership } from './api.js';
import { membershipRequestsKeys } from './keys.js';
import {
  deleteMembershipRequestRoutine,
  requestMembershipRoutine,
} from './routines.js';

export default (queryConfig: QueryClientConfig) => {
  const { notifier } = queryConfig;

  const useRequestMembership = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload: { id: UUID }) => requestMembership(payload),
      onSuccess: () => {
        notifier?.({
          type: requestMembershipRoutine.SUCCESS,
          payload: { message: 'REQUEST_MEMBERSHIP' },
        });
      },
      onError: (error: Error, _args, _context) => {
        notifier?.({
          type: requestMembershipRoutine.FAILURE,
          payload: { error },
        });
      },
      onSettled: (_data, _error, { id }) => {
        queryClient.invalidateQueries({
          queryKey: membershipRequestsKeys.single(id),
        });
      },
    });
  };
  const useDeleteMembershipRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload: { itemId: UUID; memberId: Member['id'] }) =>
        deleteMembershipRequest(payload),
      onSuccess: () => {
        notifier?.({
          type: deleteMembershipRequestRoutine.SUCCESS,
          payload: { message: 'DELETE_MEMBERSHIP_REQUEST' },
        });
      },
      onError: (error: Error, _args, _context) => {
        notifier?.({
          type: deleteMembershipRequestRoutine.FAILURE,
          payload: { error },
        });
      },
      onSettled: (_data, _error, { itemId }) => {
        queryClient.invalidateQueries({
          queryKey: membershipRequestsKeys.single(itemId),
        });
      },
    });
  };
  return { useRequestMembership, useDeleteMembershipRequest };
};
