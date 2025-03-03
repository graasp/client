import { useMutation, useQueryClient } from '@tanstack/react-query';

import { memberKeys } from '../../keys.js';
import type { QueryClientConfig } from '../../types.js';
import type { PostPublicProfilePayloadType } from './api.js';
import * as Api from './api.js';
import {
  patchPublicProfileRoutine,
  postPublicProfileRoutine,
} from './routines.js';

export default (queryConfig: QueryClientConfig) => {
  const { notifier } = queryConfig;

  const usePostPublicProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (profileData: PostPublicProfilePayloadType) =>
        Api.postPublicProfile(profileData),
      onSuccess: () => {
        notifier?.({
          type: postPublicProfileRoutine.SUCCESS,
          payload: { message: 'POST_PROFILE' },
        });
        // refetch profile information
        queryClient.invalidateQueries({
          queryKey: memberKeys.current().profile,
        });
      },
      onError: (error: Error) => {
        notifier?.({
          type: postPublicProfileRoutine.FAILURE,
          payload: { error },
        });
      },
    });
  };
  const usePatchPublicProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (payload: Partial<PostPublicProfilePayloadType>) =>
        Api.patchPublicProfile(payload),
      onSuccess: () => {
        notifier?.({
          type: patchPublicProfileRoutine.SUCCESS,
          payload: { message: 'PATCH_PROFILE' },
        });
        // refetch profile information
        queryClient.invalidateQueries({
          queryKey: memberKeys.current().profile,
        });
      },
      onError: (error: Error) => {
        notifier?.({
          type: patchPublicProfileRoutine.FAILURE,
          payload: { error },
        });
      },
    });
  };

  return {
    usePostPublicProfile,
    usePatchPublicProfile,
  };
};
