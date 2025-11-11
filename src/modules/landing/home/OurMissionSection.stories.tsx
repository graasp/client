import { Meta, StoryObj } from '@storybook/react';

import { OurMissions } from './OurMissions';

const meta = {
  component: OurMissions,
} satisfies Meta<typeof OurMissions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {},
} satisfies Story;
