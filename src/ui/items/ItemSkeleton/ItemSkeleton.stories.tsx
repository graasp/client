import { ItemType } from '@graasp/sdk';

import type { Meta, StoryObj } from '@storybook/react';

import ItemSkeleton from './ItemSkeleton.js';

const meta: Meta<typeof ItemSkeleton> = {
  title: 'Items/ItemSkeleton',
  component: ItemSkeleton,
};

export default meta;

type Story = StoryObj<typeof ItemSkeleton>;

export const Folder: Story = {
  args: {
    itemType: ItemType.FOLDER,
  },
};

export const File: Story = {
  args: {
    itemType: ItemType.FILE,
  },
};

export const App: Story = {
  args: {
    itemType: ItemType.APP,
  },
};

export const Document: Story = {
  args: {
    itemType: ItemType.DOCUMENT,
  },
};

export const Link: Story = {
  args: {
    itemType: ItemType.LINK,
  },
};

export const Collpasible: Story = {
  args: {
    isCollapsible: true,
    itemType: ItemType.LINK,
  },
};
