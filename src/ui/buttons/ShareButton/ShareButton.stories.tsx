import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { ActionButton } from '@/ui/types.js';
import { TABLE_CATEGORIES } from '@/ui/utils/storybook.js';

import ShareButton from './ShareButton.js';

const meta: Meta<typeof ShareButton> = {
  title: 'Buttons/ShareButton',
  component: ShareButton,

  argTypes: {
    size: {
      table: {
        category: TABLE_CATEGORIES.MUI,
      },
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof ShareButton>;

export const Default: Story = {};

export const MenuItem: Story = {
  args: {
    type: ActionButton.MENU_ITEM,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByText('Share'));

    expect(args.onClick).toHaveBeenCalled();
  },
};
