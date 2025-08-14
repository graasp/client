import { CurrentAccount, MAX_THUMBNAIL_SIZE } from '@graasp/sdk';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosProgressEvent } from 'axios';

import { memberKeys } from '../keys.js';
import { QueryClientConfig } from '../types.js';
import * as Api from './api.js';
import {
  deleteCurrentMemberRoutine,
  updateEmailRoutine,
  uploadAvatarRoutine,
} from './routines.js';

export default (queryConfig: QueryClientConfig) => {
  const { notifier } = queryConfig;

  const useDeleteCurrentMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: () => Api.deleteCurrentMember(),
      onSuccess: () => {
        notifier?.({
          type: deleteCurrentMemberRoutine.SUCCESS,
          payload: { message: 'DELETE_MEMBER' },
        });

        queryClient.resetQueries();

        // Update when the server confirmed the logout, instead optimistically updating the member
        // This prevents logout loop (redirect to logout -> still cookie -> logs back in)
        queryClient.setQueryData(memberKeys.current().content, undefined);
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (error: Error, _args, _context) => {
        notifier?.({
          type: deleteCurrentMemberRoutine.FAILURE,
          payload: { error },
        });
      },
    });
  };

  /**
   * Uploads the member profile picture
   */
  const useUploadAvatar = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (args: {
        file: Blob;
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
      }) => {
        if (args.file.size > MAX_THUMBNAIL_SIZE) {
          throw new Error('UPLOAD_BIG_FILES');
        }

        return Api.uploadAvatar(args);
      },
      onSuccess: () => {
        // get memberId from query data
        const memberId = queryClient.getQueryData<CurrentAccount>(
          memberKeys.current().content,
        )?.id;
        if (memberId) {
          // if we know the memberId we invalidate the avatars to refresh the queries
          queryClient.invalidateQueries({
            queryKey: memberKeys.single(memberId).allAvatars,
          });
        }
        notifier?.({
          type: uploadAvatarRoutine.SUCCESS,
          payload: { message: 'UPLOAD_AVATAR' },
        });
      },
      onError: (error) => {
        notifier?.({ type: uploadAvatarRoutine.FAILURE, payload: { error } });
      },
    });
  };

  const useUpdateMemberEmail = () =>
    useMutation({
      mutationFn: (newEmail: string) => Api.updateEmail(newEmail),
      onSuccess: () => {
        notifier?.({
          type: updateEmailRoutine.SUCCESS,
          payload: { message: 'UPDATE_EMAIL' },
        });
      },
      onError: (error: Error) => {
        notifier?.({
          type: updateEmailRoutine.FAILURE,
          payload: { error },
        });
      },
    });

  const useValidateEmailUpdate = () =>
    useMutation({
      mutationFn: (token: string) => Api.validateEmailUpdate(token),
      onError: (error: Error) => {
        notifier?.({
          type: updateEmailRoutine.FAILURE,
          payload: { error },
        });
      },
    });

  return {
    useDeleteCurrentMember,
    useUploadAvatar,
    useUpdateMemberEmail,
    useValidateEmailUpdate,
  };
};
