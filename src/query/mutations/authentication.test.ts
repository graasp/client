import { HttpMethod } from '@graasp/sdk';

import { act } from '@testing-library/react';
import { StatusCodes } from 'http-status-codes';
import nock from 'nock';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PASSWORD_RESET_REQUEST_ROUTE } from '../routes.js';
import {
  createPasswordResetRequestRoutine,
  resolvePasswordResetRequestRoutine,
} from '../routines/authentication.js';
import { OK_RESPONSE, UNAUTHORIZED_RESPONSE } from '../test/constants.js';
import { mockMutation, setUpTest, waitForMutation } from '../test/utils.js';

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
