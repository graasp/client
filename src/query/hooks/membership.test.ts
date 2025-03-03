import { FolderItemFactory, ItemMembership } from '@graasp/sdk';

import { StatusCodes } from 'http-status-codes';
import nock from 'nock';
import { afterEach, describe, expect, it } from 'vitest';

import { itemKeys } from '../keys.js';
import { buildGetItemMembershipsForItemsRoute } from '../routes.js';
import {
  ITEM_MEMBERSHIPS_RESPONSE,
  UNAUTHORIZED_RESPONSE,
  buildResultOfData,
} from '../test/constants.js';
import { mockHook, setUpTest } from '../test/utils.js';

const { hooks, wrapper, queryClient } = setUpTest();

describe('Membership Hooks', () => {
  afterEach(() => {
    nock.cleanAll();
    queryClient.clear();
  });

  describe('useItemMemberships', () => {
    const { id } = FolderItemFactory();
    // this hook uses the many endpoint
    const response = buildResultOfData([ITEM_MEMBERSHIPS_RESPONSE]);
    const route = `/${buildGetItemMembershipsForItemsRoute([id])}`;
    const key = itemKeys.single(id).memberships;

    it(`Receive one item's memberships`, async () => {
      const hook = () => hooks.useItemMemberships(id);
      const endpoints = [{ route, response }];
      const { data } = await mockHook({ endpoints, hook, wrapper });

      expect(data).toEqual(response.data[id]);
      // verify cache keys
      expect(queryClient.getQueryData<ItemMembership>(key)).toEqual(
        response.data[id],
      );
    });

    it(`Undefined ids does not fetch`, async () => {
      const hook = () => hooks.useItemMemberships(undefined);
      const endpoints = [{ route, response }];
      const { data, isFetched } = await mockHook({
        endpoints,
        hook,
        wrapper,
        enabled: false,
      });

      expect(isFetched).toBeFalsy();
      expect(data).toBeFalsy();
      // verify cache keys
      expect(queryClient.getQueryData(key)).toBeFalsy();
    });

    it(`Unauthorized`, async () => {
      const hook = () => hooks.useItemMemberships(id);
      const endpoints = [
        {
          route,
          response: UNAUTHORIZED_RESPONSE,
          statusCode: StatusCodes.UNAUTHORIZED,
        },
      ];
      const { data, isError } = await mockHook({
        hook,
        endpoints,
        wrapper,
      });

      expect(isError).toBeTruthy();
      expect(data).toBeFalsy();
      // verify cache keys
      expect(queryClient.getQueryData(key)).toBeFalsy();
    });
  });
});
