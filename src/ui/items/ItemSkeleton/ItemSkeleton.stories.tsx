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
    itemType: 'folder',
  },
};

export const File: Story = {
  args: {
    itemType: 'file',
  },
};

export const App: Story = {
  args: {
    itemType: 'app',
  },
};

export const Document: Story = {
  args: {
    itemType: 'document',
  },
};

export const Link: Story = {
  args: {
    itemType: 'embeddedLink',
  },
};

export const Collpasible: Story = {
  args: {
    isCollapsible: true,
    itemType: 'embeddedLink',
  },
};
