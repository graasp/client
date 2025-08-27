import { HttpMethod } from '@graasp/sdk';

import nock from 'nock';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildExportItemRoute } from '../routes.js';
import { exportItemRoutine } from '../routines/itemExport.js';
import { mockMutation, setUpTest } from '../test/utils.js';

const mockedNotifier = vi.fn();
const { wrapper, queryClient, mutations } = setUpTest({
  notifier: mockedNotifier,
});

describe('Export Item', () => {
  afterEach(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    nock.cleanAll();
  });

  describe('useExportItem', () => {
    const itemId = 'item-id';
    const route = `/${buildExportItemRoute(itemId)}`;
    const mutation = mutations.useExportItem;

    it('Export zip', async () => {
      const endpoints = [
        {
          response: { id: 'id', content: 'content' },
          method: HttpMethod.Get,
          route,
          headers: { 'content-disposition': 'attachment; filename=binary.zip' },
        },
      ];

      const mockedMutation = await mockMutation({
        endpoints,
        mutation,
        wrapper,
      });

      await mockedMutation.mutateAsync({ id: itemId });

      expect(mockedNotifier).toHaveBeenCalledWith({
        type: exportItemRoutine.SUCCESS,
      });
    });
  });
});
