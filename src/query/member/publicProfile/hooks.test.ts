/* eslint-disable react-hooks/rules-of-hooks */
import { StatusCodes } from 'http-status-codes';
import nock from 'nock';
import { afterEach, describe, expect, it } from 'vitest';

import { memberKeys } from '../../keys.js';
import {
  MEMBER_PUBLIC_PROFILE,
  UNAUTHORIZED_RESPONSE,
} from '../../test/constants.js';
import { mockHook, setUpTest } from '../../test/utils.js';
import {
  buildGetOwnPublicProfileRoute,
  buildGetPublicProfileRoute,
} from '../routes.js';
import { useOwnProfile, usePublicProfile } from './hooks.js';

const { wrapper, queryClient } = setUpTest();

describe('Public Profile Hooks', () => {
  afterEach(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    nock.cleanAll();
  });

  describe('useOwnProfile', () => {
    const route = `/${buildGetOwnPublicProfileRoute()}`;

    const response = MEMBER_PUBLIC_PROFILE;

    const hook = () => useOwnProfile();
    it(`Receive actions for item id`, async () => {
      const endpoints = [{ route, response }];
      const { data } = await mockHook({ endpoints, hook, wrapper });
      expect(data).toEqual(response);
      expect(queryClient.getQueryData(memberKeys.current().profile)).toEqual(
        response,
      );
    });

    it(`Unauthorized`, async () => {
      const endpoints = [
        {
          route,
          response: UNAUTHORIZED_RESPONSE,
          statusCode: StatusCodes.UNAUTHORIZED,
        },
      ];
      const { isError } = await mockHook({
        endpoints,
        hook,
        wrapper,
      });

      expect(isError).toBeTruthy();
      expect(
        queryClient.getQueryData(memberKeys.current().profile),
      ).toBeFalsy();
    });
  });

  describe('usePublicProfile', () => {
    const id = 'member-id';
    const response = MEMBER_PUBLIC_PROFILE;

    it(`Receive member public profile for member-id = ${id}`, async () => {
      const endpoints = [
        {
          route: `/${buildGetPublicProfileRoute(id)}`,
          response,
        },
      ];
      const hook = () => usePublicProfile(id);
      const { data } = await mockHook({
        hook,
        wrapper,
        endpoints,
      });
      expect(queryClient.getQueryData(memberKeys.single(id).profile)).toEqual(
        response,
      );
      expect(data).toMatchObject(response);
    });
  });
});
