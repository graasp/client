/* eslint-disable react-hooks/rules-of-hooks */
import { TagFactory } from '@graasp/sdk';

import { StatusCodes } from 'http-status-codes';
import nock from 'nock';
import { afterEach, describe, expect, it } from 'vitest';

import { itemKeys } from '../../keys.js';
import { UNAUTHORIZED_RESPONSE } from '../../test/constants.js';
import { mockHook, setUpTest } from '../../test/utils.js';
import { useTagsByItem } from './hooks.js';
import { buildGetTagsByItemRoute } from './routes.js';

const { wrapper, queryClient } = setUpTest();

describe('Tags Hooks', () => {
  afterEach(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    nock.cleanAll();
  });

  describe('useTagsByItem', () => {
    const itemId = 'item-id';
    const route = `/${buildGetTagsByItemRoute({ itemId })}`;
    const key = itemKeys.single(itemId).tags;

    const hook = () => useTagsByItem({ itemId });

    it(`Receive item categories`, async () => {
      const response = [TagFactory()];
      const endpoints = [{ route, response }];
      const { data } = await mockHook({ endpoints, hook, wrapper });

      expect(data).toMatchObject(response);

      // verify cache keys
      expect(queryClient.getQueryData(key)).toMatchObject(response);
    });

    it(`Unauthorized`, async () => {
      const endpoints = [
        {
          route,
          response: UNAUTHORIZED_RESPONSE,
          statusCode: StatusCodes.UNAUTHORIZED,
        },
      ];
      const { data, isError } = await mockHook({
        hook,
        wrapper,
        endpoints,
      });

      expect(data).toBeFalsy();
      expect(isError).toBeTruthy();
      // verify cache keys
      expect(queryClient.getQueryData(key)).toBeFalsy();
    });
  });
});
