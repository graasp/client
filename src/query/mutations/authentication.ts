import { Password } from '@graasp/sdk';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as Api from '../api/authentication.js';
import { memberKeys } from '../keys.js';
import {
  createPasswordResetRequestRoutine,
  resolvePasswordResetRequestRoutine,
  signInRoutine,
  signInWithPasswordRoutine,
  signOutRoutine,
  signUpRoutine,
} from '../routines/authentication.js';
import { QueryClientConfig } from '../types.js';

export default (queryConfig: QueryClientConfig) => {
  const { notifier } = queryConfig;

  const useSignIn = () => {
    return useMutation({
      mutationFn: (payload: { email: string; captcha: string; url?: string }) =>
        Api.signIn(payload),
      onSuccess: () => {
        notifier?.({
          type: signInRoutine.SUCCESS,
          payload: { message: 'SIGN_IN' },
        });
      },
      onError: (error: Error) => {
        notifier?.({
          type: signInRoutine.FAILURE,
          payload: { error },
        });
      },
    });
  };

  const useMobileSignIn = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload: {
        email: string;
        captcha: string;
        challenge: string;
      }) => Api.mobileSignIn(payload),
      onSuccess: () => {
        notifier?.({
          type: signInRoutine.SUCCESS,
          payload: { message: 'SIGN_IN' },
        });
        queryClient.resetQueries();
      },
      onError: (error: Error) => {
        notifier?.({
          type: signInRoutine.FAILURE,
          payload: { error },
        });
      },
    });
  };

  const useSignInWithPassword = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload: {
        email: string;
        password: Password;
        captcha: string;
        url?: string;
      }) => Api.signInWithPassword(payload),
      onSuccess: () => {
        notifier?.({
          type: signInWithPasswordRoutine.SUCCESS,
          payload: { message: 'SIGN_IN_WITH_PASSWORD' },
        });
        queryClient.resetQueries();
      },
      onError: (error: Error) => {
        notifier?.({
          type: signInWithPasswordRoutine.FAILURE,
          payload: { error },
        });
      },
    });
  };

  const useMobileSignInWithPassword = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload: {
        email: string;
        password: string;
        captcha: string;
        challenge: string;
      }) => Api.mobileSignInWithPassword(payload),
      onSuccess: () => {
        notifier?.({
          type: signInWithPasswordRoutine.SUCCESS,
          payload: { message: 'SIGN_IN_WITH_PASSWORD' },
        });
        queryClient.resetQueries();
      },
      onError: (error: Error) => {
        notifier?.({
          type: signInWithPasswordRoutine.FAILURE,
          payload: { error },
        });
      },
    });
  };

  const useSignUp = () =>
    useMutation({
      mutationFn: (payload: {
        name: string;
        email: string;
        captcha: string;
        url?: string;
        lang?: string;
        enableSaveActions: boolean;
      }) => Api.signUp(payload, { lang: payload.lang }),
      onSuccess: () => {
        notifier?.({
          type: signUpRoutine.SUCCESS,
          payload: { message: 'SIGN_UP' },
        });
      },
      onError: (error: Error) => {
        notifier?.({
          type: signUpRoutine.FAILURE,
          payload: { error },
        });
      },
    });

  const useMobileSignUp = () =>
    useMutation({
      mutationFn: (payload: {
        name: string;
        email: string;
        challenge: string;
        captcha: string;
        lang?: string;
        enableSaveActions: boolean;
      }) => Api.mobileSignUp(payload, { lang: payload.lang }),
      onSuccess: () => {
        notifier?.({
          type: signUpRoutine.SUCCESS,
          payload: { message: 'SIGN_UP' },
        });
      },
      onError: (error: Error) => {
        notifier?.({
          type: signUpRoutine.FAILURE,
          payload: { error },
        });
      },
    });

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
    useSignIn,
    useSignInWithPassword,
    useSignOut,
    useSignUp,
    useMobileSignUp,
    useMobileSignIn,
    useMobileSignInWithPassword,
    useCreatePasswordResetRequest,
    useResolvePasswordResetRequest,
  };
};
