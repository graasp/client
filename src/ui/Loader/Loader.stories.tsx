import { StoryObj } from '@storybook/react-vite';

import Loader from './Loader.js';

export default {
  title: 'Common/Loader',
  component: Loader,
};

type Story = StoryObj<typeof Loader>;

export const Default: Story = {
  args: {},
};
