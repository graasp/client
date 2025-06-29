import { AccountFactory, FolderItemFactory } from '@graasp/sdk';

import { StatusCodes } from 'http-status-codes';
import nock from 'nock';
import { afterEach, describe, expect, it } from 'vitest';

import { type ChatMessageRaw } from '@/openapi/client/types.gen.js';

import { buildItemChatKey } from '../keys.js';
import { buildGetItemChatRoute } from '../routes.js';
import { UNAUTHORIZED_RESPONSE } from '../test/constants.js';
import { mockHook, setUpTest } from '../test/utils.js';

const { hooks, wrapper, queryClient } = setUpTest();

describe('Chat Hooks', () => {
  afterEach(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    nock.cleanAll();
  });

  describe('useItemChat', () => {
    const itemId = FolderItemFactory().id;
    const mockMessage: ChatMessageRaw = {
      id: 'some-messageId',
      itemId: FolderItemFactory().id,
      body: 'some content',
      creatorId: AccountFactory().id,
      createdAt: '2023-09-06T11:50:32.894Z',
      updatedAt: '2023-09-06T11:50:32.894Z',
    };
    const route = `/${buildGetItemChatRoute(itemId)}`;
    const key = buildItemChatKey(itemId);

    const hook = () => hooks.useItemChat(itemId);

    it(`Receive chat messages`, async () => {
      const response = [mockMessage];
      const endpoints = [
        {
          route,
          response,
        },
      ];
      const { data } = await mockHook({
        endpoints,
        hook,
        wrapper,
      });

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

  describe('useItemChat with arguments', () => {
    const itemId = FolderItemFactory().id;
    const mockMessage: ChatMessageRaw = {
      id: 'some-messageId',
      itemId: FolderItemFactory().id,
      body: 'some content',
      creatorId: AccountFactory().id,
      createdAt: '2023-09-06T11:50:32.894Z',
      updatedAt: '2023-09-06T11:50:32.894Z',
    };
    const route = `/${buildGetItemChatRoute(itemId)}`;
    const key = buildItemChatKey(itemId);

    it(`getUpdates = true`, async () => {
      const hook = () => hooks.useItemChat(itemId, { getUpdates: true });

      const response = [mockMessage];
      const endpoints = [
        {
          route,
          response,
        },
      ];
      const { data } = await mockHook({
        endpoints,
        hook,
        wrapper,
      });

      expect(data).toMatchObject(response);

      // verify cache keys
      expect(queryClient.getQueryData(key)).toMatchObject(response);
    });

    it(`getUpdates = false`, async () => {
      const hook = () => hooks.useItemChat(itemId, { getUpdates: false });
      const response = [mockMessage];
      const endpoints = [
        {
          route,
          response,
        },
      ];
      const { data } = await mockHook({
        endpoints,
        hook,
        wrapper,
      });

      expect(data).toMatchObject(response);

      // verify cache keys
      expect(queryClient.getQueryData(key)).toMatchObject(response);
    });
  });
});
