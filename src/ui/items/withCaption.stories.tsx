import type { JSX } from 'react';

import {
  Alignment,
  AlignmentType,
  DescriptionPlacement,
  DescriptionPlacementType,
} from '@graasp/sdk';

import type { Meta, StoryObj } from '@storybook/react';

import withCaption from './withCaption.js';

const renderComponent = ({
  description,
  descriptionPlacement = DescriptionPlacement.BELOW,
  alignment,
}: {
  description: string;
  descriptionPlacement: DescriptionPlacementType;
  alignment: AlignmentType;
}): JSX.Element =>
  withCaption({
    item: {
      description,
      settings: { descriptionPlacement, alignment },
    },
  })(<img alt="cover" src="https://picsum.photos/500" height="100%" />);

const meta: Meta<typeof renderComponent> = {
  title: 'Common/withCaption',
  render: renderComponent,
  argTypes: {
    descriptionPlacement: {
      control: 'radio',
      options: Object.values(DescriptionPlacement),
    },
    alignment: {
      control: 'radio',
      options: Object.values(Alignment),
    },
  },
  args: {
    description: 'My description',
    descriptionPlacement: DescriptionPlacement.BELOW,
    alignment: Alignment.Left,
  },
};

export default meta;

type Story = StoryObj<typeof renderComponent>;

export const CaptionOnImage = {} satisfies Story;
export const CenteredCaption = {
  args: { alignment: Alignment.Center },
} satisfies Story;
