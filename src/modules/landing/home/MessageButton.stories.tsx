import { Meta, StoryObj } from '@storybook/react';

import { MessageButton } from './MessageButton';

const meta = {
  component: MessageButton,
} satisfies Meta<typeof MessageButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    id: 'test',
    text: 'Do you want to see this?',
  },
} satisfies Story;
