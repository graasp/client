import { FolderItemFactory, HttpMethod } from '@graasp/sdk';

import { act } from '@testing-library/react';
import { StatusCodes } from 'http-status-codes';
import nock from 'nock';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { itemKeys } from '../../keys.js';
import { OK_RESPONSE, UNAUTHORIZED_RESPONSE } from '../../test/constants.js';
import { mockMutation, setUpTest, waitForMutation } from '../../test/utils.js';
import { buildEnroll } from './routes.js';
import { enrollRoutine } from './routines.js';

const mockedNotifier = vi.fn();
const { wrapper, queryClient, mutations } = setUpTest({
  notifier: mockedNotifier,
});

const item = FolderItemFactory();
const itemId = item.id;
const key = itemKeys.single(itemId).content;
const membershipKey = itemKeys.single(itemId).memberships;

describe('useEnroll', () => {
  const mutation = mutations.useEnroll;
  const route = `/${buildEnroll(itemId)}`;

  afterEach(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    nock.cleanAll();
  });

  it('Enroll', async () => {
    // set data in cache
    queryClient.setQueryData(key, item);
    queryClient.setQueryData(membershipKey, [{}]);

    const endpoints = [
      {
        response: OK_RESPONSE,
        method: HttpMethod.Post,
        route,
      },
    ];

    const mockedMutation = await mockMutation({
      endpoints,
      mutation,
      wrapper,
    });

    await act(async () => {
      mockedMutation.mutate({ itemId });
      await waitForMutation();
    });

    expect(mockedNotifier).toHaveBeenCalledWith({
      type: enrollRoutine.SUCCESS,
      payload: { message: 'ENROLL' },
    });

    expect(queryClient.getQueryState(key)?.isInvalidated).toBeTruthy();
    expect(
      queryClient.getQueryState(membershipKey)?.isInvalidated,
    ).toBeTruthy();
  });

  it('Unauthorized to enroll', async () => {
    // set data in cache
    queryClient.setQueryData(key, item);
    queryClient.setQueryData(membershipKey, [{}]);

    const endpoints = [
      {
        response: UNAUTHORIZED_RESPONSE,
        statusCode: StatusCodes.UNAUTHORIZED,
        method: HttpMethod.Patch,
        route,
      },
    ];

    const mockedMutation = await mockMutation({
      endpoints,
      mutation,
      wrapper,
    });

    await act(async () => {
      mockedMutation.mutate({ itemId });
      await waitForMutation();
    });

    const state = queryClient.getQueryState(key);
    expect(state?.isInvalidated).toBeTruthy();

    expect(mockedNotifier).toHaveBeenCalledWith({
      type: enrollRoutine.FAILURE,
      payload: expect.anything(),
    });
  });
});
