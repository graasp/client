import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as Api from '../api/authentication.js';
import { memberKeys } from '../keys.js';
import {
  createPasswordResetRequestRoutine,
  resolvePasswordResetRequestRoutine,
  signOutRoutine,
} from '../routines/authentication.js';
import { QueryClientConfig } from '../types.js';

export default (queryConfig: QueryClientConfig) => {
  const { notifier } = queryConfig;

  const useSignOut = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: () => Api.signOut(),
      onSuccess: (_res) => {
        notifier?.({
          type: signOutRoutine.SUCCESS,
          payload: { message: 'SIGN_OUT' },
        });
        queryClient.resetQueries();

        // cookie operations only if window is defined (operation happens in the frontend)
        // if (!isServer() && queryConfig.DOMAIN) {
        //   // save current page for further redirection
        //   saveUrlForRedirection(window.location.href, queryConfig.DOMAIN);
        //   // remove cookie and stored session from browser when the logout is confirmed
        //   // todo: find a way to do something equivalent but with httpOnly cookies
        //   // setCurrentSession(null, queryConfig.DOMAIN);
        //   // removeSession(currentMemberId, queryConfig.DOMAIN);
        // }
        // Update when the server confirmed the logout, instead optimistically updating the member
        // This prevents logout loop (redirect to logout -> still cookie -> logs back in)
        queryClient.setQueryData(memberKeys.current().content, undefined);
      },
      onError: (error: Error) => {
        notifier?.({
          type: signOutRoutine.FAILURE,
          payload: { error },
        });
      },
    });
  };

  const useCreatePasswordResetRequest = () =>
    useMutation({
      mutationFn: (args: { email: string; captcha: string }) =>
        Api.createPasswordResetRequest(args),
      onSuccess: () => {
        notifier?.({
          type: createPasswordResetRequestRoutine.SUCCESS,
          payload: { message: 'PASSWORD_RESET_REQUEST' },
        });
      },
      onError: (error: Error) => {
        notifier?.({
          type: createPasswordResetRequestRoutine.FAILURE,
          payload: { error },
        });
      },
    });

  const useResolvePasswordResetRequest = () =>
    useMutation({
      mutationFn: (args: { password: string; token: string }) =>
        Api.resolvePasswordResetRequest(args),
      onSuccess: () => {
        notifier?.({
          type: resolvePasswordResetRequestRoutine.SUCCESS,
          payload: { message: 'PASSWORD_RESET' },
        });
      },
      onError: (error: Error) => {
        notifier?.({
          type: resolvePasswordResetRequestRoutine.FAILURE,
          payload: { error },
        });
      },
    });

  return {
    useSignOut,
    useCreatePasswordResetRequest,
    useResolvePasswordResetRequest,
  };
};
