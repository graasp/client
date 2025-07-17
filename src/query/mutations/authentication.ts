import { useMutation } from '@tanstack/react-query';

import * as Api from '../api/authentication.js';
import {
  createPasswordResetRequestRoutine,
  resolvePasswordResetRequestRoutine,
} from '../routines/authentication.js';
import { QueryClientConfig } from '../types.js';

export default (queryConfig: QueryClientConfig) => {
  const { notifier } = queryConfig;

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
    useCreatePasswordResetRequest,
    useResolvePasswordResetRequest,
  };
};
