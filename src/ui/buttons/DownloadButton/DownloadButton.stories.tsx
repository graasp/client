import type { StoryObj } from '@storybook/react';
import { expect, fn, within } from 'storybook/test';

import { ActionButton, ColorVariants } from '../../types.js';
import { TABLE_CATEGORIES } from '../../utils/storybook.js';
import DownloadButton from './DownloadButton.js';

export default {
  title: 'Buttons/DownloadButton',
  component: DownloadButton,

  args: {
    handleDownload: fn(),
  },
  argTypes: {
    color: {
      options: Object.values(ColorVariants),
      control: { type: 'radio' },
    },
    loaderSize: {
      table: {
        category: TABLE_CATEGORIES.MUI,
      },
    },
    title: {
      table: {
        category: TABLE_CATEGORIES.MUI,
      },
    },
    placement: {
      table: {
        category: TABLE_CATEGORIES.MUI,
      },
    },
  },
};

type Story = StoryObj<typeof DownloadButton>;

export const Default: Story = {
  args: { link: 'https://graasp.org/' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByLabelText('download');
    await expect(button).toHaveProperty('download');
    await expect(button).toHaveProperty('href', args.link);
  },
};

export const MenuItem: Story = {
  args: {
    type: ActionButton.MENU_ITEM,
    link: 'https://graasp.org/',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByText('Download').parentElement;
    await expect(button).toHaveProperty('download');
    await expect(button).toHaveProperty('href', args.link);
  },
};
