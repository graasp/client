import {
  AppItemFactory,
  Context,
  ItemType,
  MemberFactory,
  PermissionLevel,
} from '@graasp/sdk';

import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';

import AppItem, { CURRENT_TIMESTAMP_QUERY_PARAM } from './AppItem.js';

const meta = {
  title: 'Items/AppItem',
  component: AppItem,
} satisfies Meta<typeof AppItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example = {
  args: {
    item: AppItemFactory({
      name: 'my app',
      id: 'item-id',
      description: 'item-description',
      extra: {
        [ItemType.APP]: {
          url: 'https://graasp.org',
        },
      },
      type: 'app',
      path: 'item-path',
      settings: {},
      creator: MemberFactory(),
    }),
    frameId: 'app-iframe-test-id',
    requestApiAccessToken: async () => ({ token: 'token' }),
    contextPayload: {
      apiHost: 'apiHost',
      itemId: 'itemId',
      settings: {},
      permission: PermissionLevel.Read,
      lang: 'en',
      context: Context.Library,
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    if (args.item.description) {
      await expect(canvas.getByText(args.item.description)).toBeInTheDocument();
    }
    await expect(canvas.getByTitle(args.item.name)).toBeInTheDocument();
    // check that the timestamp is set on the iframe src
    await expect(canvas.getByTestId(args.frameId!)).toHaveAttribute(
      'src',
      expect.stringContaining(CURRENT_TIMESTAMP_QUERY_PARAM),
    );
  },
} satisfies Story;
