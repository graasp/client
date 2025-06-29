import { FolderItemFactory, ItemLike } from '@graasp/sdk';

import { StatusCodes } from 'http-status-codes';
import nock from 'nock';
import { afterEach, describe, expect, it } from 'vitest';

import { itemKeys, memberKeys } from '../keys.js';
import {
  buildGetItemLikesRoute,
  buildGetLikesForMemberRoute,
} from '../routes.js';
import { ITEM_LIKES, UNAUTHORIZED_RESPONSE } from '../test/constants.js';
import { mockHook, setUpTest } from '../test/utils.js';

const { hooks, wrapper, queryClient } = setUpTest();

describe('Item Like Hooks', () => {
  afterEach(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    nock.cleanAll();
  });

  describe('useLikesForMember', () => {
    const memberId = 'member-id';
    const route = `/${buildGetLikesForMemberRoute(memberId)}`;
    const key = memberKeys.single(memberId).likedItems;

    const hook = () => hooks.useLikesForMember(memberId);

    it(`Receive item likes`, async () => {
      const response = ITEM_LIKES;
      const endpoints = [{ route, response }];
      const { data } = await mockHook({ endpoints, hook, wrapper });

      expect(data).toEqual(response);

      // verify cache keys
      expect(queryClient.getQueryData<ItemLike[]>(key)).toEqual(response);
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

  describe('useLikesForItem', () => {
    const itemId = FolderItemFactory().id;
    const route = `/${buildGetItemLikesRoute(itemId)}`;
    const key = itemKeys.single(itemId).likes;

    const hook = () => hooks.useLikesForItem(itemId);

    it(`Receive item's like entries`, async () => {
      const response = ITEM_LIKES;
      const endpoints = [{ route, response }];
      const { data } = await mockHook({ endpoints, hook, wrapper });

      expect(data).toEqual(response);

      // verify cache keys
      expect(queryClient.getQueryData<ItemLike[]>(key)).toEqual(response);
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
