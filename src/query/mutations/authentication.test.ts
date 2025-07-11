import { HttpMethod } from '@graasp/sdk';

import { act } from '@testing-library/react';
import { StatusCodes } from 'http-status-codes';
import nock from 'nock';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { axiosClient as axios } from '@/query/api/axios.js';

import { memberKeys } from '../keys.js';
import {
  MOBILE_SIGN_IN_ROUTE,
  MOBILE_SIGN_IN_WITH_PASSWORD_ROUTE,
  MOBILE_SIGN_UP_ROUTE,
  PASSWORD_RESET_REQUEST_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_IN_WITH_PASSWORD_ROUTE,
  SIGN_OUT_ROUTE,
  SIGN_UP_ROUTE,
} from '../routes.js';
import {
  createPasswordResetRequestRoutine,
  resolvePasswordResetRequestRoutine,
  signInRoutine,
  signInWithPasswordRoutine,
  signOutRoutine,
  signUpRoutine,
} from '../routines/authentication.js';
import { OK_RESPONSE, UNAUTHORIZED_RESPONSE } from '../test/constants.js';
import { mockMutation, setUpTest, waitForMutation } from '../test/utils.js';

const captcha = 'captcha';
const email = 'myemail@email.com';
const challenge = '1234';
const defaultSaveActions = true;

describe('Authentication Mutations', () => {
  const mockedNotifier = vi.fn();
  const { wrapper, queryClient, mutations } = setUpTest({
    notifier: mockedNotifier,
  });

  afterEach(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    nock.cleanAll();
    vi.clearAllMocks();
  });

  describe('useSignIn', () => {
    const route = SIGN_IN_ROUTE;
    const mutation = mutations.useSignIn;

    it(`Sign in`, async () => {
      const endpoints = [
        { route, response: OK_RESPONSE, method: HttpMethod.Post },
      ];

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate({ email, captcha });
        await waitForMutation();
      });

      expect(mockedNotifier).toHaveBeenCalledWith({
        type: signInRoutine.SUCCESS,
        payload: { message: 'SIGN_IN' },
      });
    });

    it(`Unauthorized`, async () => {
      const endpoints = [
        {
          route,
          response: UNAUTHORIZED_RESPONSE,
          method: HttpMethod.Post,
          statusCode: StatusCodes.UNAUTHORIZED,
        },
      ];

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate({ email, captcha });
        await waitForMutation();
      });

      expect(mockedNotifier).toHaveBeenCalledWith(
        expect.objectContaining({
          type: signInRoutine.FAILURE,
        }),
      );
    });
  });

  describe('useMobileSignIn', () => {
    const route = MOBILE_SIGN_IN_ROUTE;
    const mutation = mutations.useMobileSignIn;

    it(`Sign in`, async () => {
      const endpoints = [
        { route, response: OK_RESPONSE, method: HttpMethod.Post },
      ];

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate({ email, captcha, challenge });
        await waitForMutation();
      });

      expect(mockedNotifier).toHaveBeenCalledWith({
        type: signInRoutine.SUCCESS,
        payload: { message: 'SIGN_IN' },
      });
    });

    it(`Unauthorized`, async () => {
      const endpoints = [
        {
          route,
          response: UNAUTHORIZED_RESPONSE,
          method: HttpMethod.Post,
          statusCode: StatusCodes.UNAUTHORIZED,
        },
      ];

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate({ email, captcha, challenge });
        await waitForMutation();
      });

      expect(mockedNotifier).toHaveBeenCalledWith(
        expect.objectContaining({
          type: signInRoutine.FAILURE,
        }),
      );
    });
  });

  describe('useSignInWithPassword', () => {
    const route = SIGN_IN_WITH_PASSWORD_ROUTE;
    const mutation = mutations.useSignInWithPassword;
    const password = 'password';
    const link = 'mylink';

    it(`Sign in with password`, async () => {
      const endpoints = [
        {
          route,
          response: { resource: link },
          statusCode: StatusCodes.SEE_OTHER,
          method: HttpMethod.Post,
        },
      ];
      // set random data in cache
      queryClient.setQueryData(memberKeys.current().content, 'somevalue');

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate({ email, password, captcha });
        await waitForMutation();
      });

      // verify cache keys
      expect(
        queryClient.getQueryData(memberKeys.current().content),
      ).toBeFalsy();

      expect(mockedNotifier).toHaveBeenCalledWith({
        type: signInWithPasswordRoutine.SUCCESS,
        payload: { message: 'SIGN_IN_WITH_PASSWORD' },
      });
    });

    it(`Unauthorized`, async () => {
      const endpoints = [
        {
          route,
          response: UNAUTHORIZED_RESPONSE,
          method: HttpMethod.Post,
          statusCode: StatusCodes.UNAUTHORIZED,
        },
      ];

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate({ email, password, captcha });
        await waitForMutation();
      });

      expect(mockedNotifier).toHaveBeenCalledWith(
        expect.objectContaining({
          type: signInWithPasswordRoutine.FAILURE,
        }),
      );
    });
  });

  describe('useMobileSignInWithPassword', () => {
    const route = MOBILE_SIGN_IN_WITH_PASSWORD_ROUTE;
    const mutation = mutations.useMobileSignInWithPassword;
    const password = 'password';
    const link = 'mylink';

    it(`Sign in with password`, async () => {
      const endpoints = [
        {
          route,
          response: { resource: link },
          statusCode: StatusCodes.SEE_OTHER,
          method: HttpMethod.Post,
        },
      ];
      // set random data in cache
      queryClient.setQueryData(memberKeys.current().content, 'somevalue');

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate({ email, password, captcha, challenge });
        await waitForMutation();
      });

      // verify cache keys
      expect(
        queryClient.getQueryData(memberKeys.current().content),
      ).toBeFalsy();

      expect(mockedNotifier).toHaveBeenCalledWith({
        type: signInWithPasswordRoutine.SUCCESS,
        payload: { message: 'SIGN_IN_WITH_PASSWORD' },
      });
    });

    it(`Unauthorized`, async () => {
      const endpoints = [
        {
          route,
          response: UNAUTHORIZED_RESPONSE,
          method: HttpMethod.Post,
          statusCode: StatusCodes.UNAUTHORIZED,
        },
      ];

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate({ email, password, captcha, challenge });
        await waitForMutation();
      });

      expect(mockedNotifier).toHaveBeenCalledWith(
        expect.objectContaining({
          type: signInWithPasswordRoutine.FAILURE,
        }),
      );
    });
  });

  describe('useSignUp', () => {
    const route = SIGN_UP_ROUTE;
    const mutation = mutations.useSignUp;
    const name = 'name';

    it(`Sign up`, async () => {
      const endpoints = [
        { route, response: OK_RESPONSE, method: HttpMethod.Post },
      ];

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate({
          email,
          name,
          captcha,
          enableSaveActions: defaultSaveActions,
        });
        await waitForMutation();
      });

      expect(mockedNotifier).toHaveBeenCalledWith({
        type: signUpRoutine.SUCCESS,
        payload: { message: 'SIGN_UP' },
      });
    });

    const testSignUpWithSaveActions = async (enableSaveActions: boolean) => {
      const endpoints = [
        { route, response: OK_RESPONSE, method: HttpMethod.Post },
      ];

      const postSpy = vi.spyOn(axios, 'post');
      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate({ email, name, captcha, enableSaveActions });
        await waitForMutation();
      });

      expect(mockedNotifier).toHaveBeenCalledWith({
        type: signUpRoutine.SUCCESS,
        payload: { message: 'SIGN_UP' },
      });
      expect(postSpy).toHaveBeenCalledWith(
        expect.stringContaining(route),
        expect.objectContaining({ enableSaveActions }),
      );
    };

    it(`Sign up with save actions enabled`, async () =>
      testSignUpWithSaveActions(true));

    it(`Sign up with save actions disabled`, async () =>
      testSignUpWithSaveActions(false));

    it(`Unauthorized`, async () => {
      const endpoints = [
        {
          route,
          response: UNAUTHORIZED_RESPONSE,
          method: HttpMethod.Post,
          statusCode: StatusCodes.UNAUTHORIZED,
        },
      ];

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate({
          email,
          name,
          captcha,
          enableSaveActions: defaultSaveActions,
        });
        await waitForMutation();
      });

      expect(mockedNotifier).toHaveBeenCalledWith(
        expect.objectContaining({
          type: signUpRoutine.FAILURE,
        }),
      );
    });
  });

  describe('useMobileSignUp', () => {
    const route = MOBILE_SIGN_UP_ROUTE;
    const mutation = mutations.useMobileSignUp;
    const name = 'name';

    it(`Sign up`, async () => {
      const endpoints = [
        { route, response: OK_RESPONSE, method: HttpMethod.Post },
      ];

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate({
          email,
          name,
          captcha,
          challenge,
          enableSaveActions: defaultSaveActions,
        });
        await waitForMutation();
      });

      expect(mockedNotifier).toHaveBeenCalledWith({
        type: signUpRoutine.SUCCESS,
        payload: { message: 'SIGN_UP' },
      });
    });

    const testSignUpMobileWithSaveActions = async (
      enableSaveActions: boolean,
    ) => {
      const endpoints = [
        { route, response: OK_RESPONSE, method: HttpMethod.Post },
      ];

      const postSpy = vi.spyOn(axios, 'post');
      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate({
          email,
          name,
          captcha,
          challenge,
          enableSaveActions,
        });
        await waitForMutation();
      });

      expect(mockedNotifier).toHaveBeenCalledWith({
        type: signUpRoutine.SUCCESS,
        payload: { message: 'SIGN_UP' },
      });
      expect(postSpy).toHaveBeenCalledWith(
        expect.stringContaining(route),
        expect.objectContaining({ enableSaveActions }),
      );
    };

    it(`Sign up mobile with save actions enabled`, async () =>
      testSignUpMobileWithSaveActions(true));

    it(`Sign up mobile with save actions disabled`, async () =>
      testSignUpMobileWithSaveActions(false));

    it(`Unauthorized`, async () => {
      const endpoints = [
        {
          route,
          response: UNAUTHORIZED_RESPONSE,
          method: HttpMethod.Post,
          statusCode: StatusCodes.UNAUTHORIZED,
        },
      ];

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate({
          email,
          name,
          captcha,
          challenge,
          enableSaveActions: defaultSaveActions,
        });
        await waitForMutation();
      });

      expect(mockedNotifier).toHaveBeenCalledWith(
        expect.objectContaining({
          type: signUpRoutine.FAILURE,
        }),
      );
    });
  });

  describe('useSignOut', () => {
    const route = SIGN_OUT_ROUTE;
    const mutation = mutations.useSignOut;

    it(`Sign out`, async () => {
      // set random data in cache
      queryClient.setQueryData(memberKeys.current().content, 'somevalue');

      const endpoints = [
        { route, response: OK_RESPONSE, method: HttpMethod.Get },
      ];

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate();
        await waitForMutation();
      });

      expect(mockedNotifier).toHaveBeenCalledWith({
        type: signOutRoutine.SUCCESS,
        payload: { message: 'SIGN_OUT' },
      });
      expect(
        queryClient.getQueryData(memberKeys.current().content),
      ).toBeFalsy();

      // cookie management
      // we do not test that the cookie has been set as it depends on globals that are not available in the test environnement
    });

    it(`Unauthorized`, async () => {
      const endpoints = [
        {
          route,
          response: UNAUTHORIZED_RESPONSE,
          method: HttpMethod.Get,
          statusCode: StatusCodes.UNAUTHORIZED,
        },
      ];

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate(undefined);
        await waitForMutation();
      });

      expect(mockedNotifier).toHaveBeenCalledWith(
        expect.objectContaining({
          type: signOutRoutine.FAILURE,
        }),
      );
    });
  });

  describe('useCreatePasswordResetRequest', () => {
    const route = PASSWORD_RESET_REQUEST_ROUTE;
    const mutation = mutations.useCreatePasswordResetRequest;

    it(`Sign out`, async () => {
      const endpoints = [
        {
          route,
          response: OK_RESPONSE,
          method: HttpMethod.Post,
          statusCode: StatusCodes.NO_CONTENT,
        },
      ];

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate({ email: 'test@email.com', captcha: 'captcha' });
        await waitForMutation();
      });

      expect(mockedNotifier).toHaveBeenCalledWith({
        type: createPasswordResetRequestRoutine.SUCCESS,
        payload: { message: 'PASSWORD_RESET_REQUEST' },
      });
    });

    it(`Unauthorized`, async () => {
      const endpoints = [
        {
          route,
          response: UNAUTHORIZED_RESPONSE,
          method: HttpMethod.Post,
          statusCode: StatusCodes.UNAUTHORIZED,
        },
      ];

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate({
          email: 'email@test.com',
          captcha: 'wrong-captcha',
        });
        await waitForMutation();
      });

      expect(mockedNotifier).toHaveBeenCalledWith(
        expect.objectContaining({
          type: createPasswordResetRequestRoutine.FAILURE,
        }),
      );
    });
  });

  describe('useResolvePasswordResetRequest', () => {
    const route = PASSWORD_RESET_REQUEST_ROUTE;
    const mutation = mutations.useResolvePasswordResetRequest;

    it(`Sign out`, async () => {
      const endpoints = [
        {
          route,
          response: OK_RESPONSE,
          method: HttpMethod.Patch,
          statusCode: StatusCodes.NO_CONTENT,
        },
      ];

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate({ password: 'newpassword', token: 'token' });
        await waitForMutation();
      });

      expect(mockedNotifier).toHaveBeenCalledWith({
        type: resolvePasswordResetRequestRoutine.SUCCESS,
        payload: { message: 'PASSWORD_RESET' },
      });
    });

    it(`Unauthorized`, async () => {
      const endpoints = [
        {
          route,
          response: UNAUTHORIZED_RESPONSE,
          method: HttpMethod.Post,
          statusCode: StatusCodes.UNAUTHORIZED,
        },
      ];

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await act(async () => {
        mockedMutation.mutate({
          password: 'newpassword',
          token: 'no-token',
        });
        await waitForMutation();
      });

      expect(mockedNotifier).toHaveBeenCalledWith(
        expect.objectContaining({
          type: resolvePasswordResetRequestRoutine.FAILURE,
        }),
      );
    });
  });
});
