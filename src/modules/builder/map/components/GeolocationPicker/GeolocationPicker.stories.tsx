import { TextField } from '@mui/material';

import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import type { BoundFunctions } from '@testing-library/dom';
import { queries } from '@testing-library/dom';

import { MOCK_USE_SUGGESTIONS } from '../../fixture';
import GeolocationPicker from './GeolocationPicker';

const meta = {
  title: 'GeolocationPicker',
  component: GeolocationPicker,

  argTypes: {
    onChangeOption: {
      action: 'choose option',
      table: {
        category: 'events',
      },
    },
  },
} satisfies Meta<typeof GeolocationPicker>;
export default meta;

type Story = StoryObj<typeof meta>;

const checkSuggestions = async (canvas: BoundFunctions<typeof queries>) => {
  // suggestions are showing
  await userEvent.type(canvas.getByLabelText('Geolocation'), 'my address');
  const suggestions = MOCK_USE_SUGGESTIONS({ address: 'query' }).data;
  suggestions?.forEach((value) => {
    expect(canvas.getByText(value.addressLabel)).toBeVisible();
  });

  // select a suggestion
  const toSelect = suggestions![0].addressLabel;
  await userEvent.click(canvas.getByText(toSelect));
  expect(canvas.getByLabelText('Geolocation')).toHaveTextContent(toSelect);
};

export const Default = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await checkSuggestions(canvas);
  },
} satisfies Story;

export const InitialValue = {
  args: {
    initialValue: 'initial value',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText('Geolocation')).toHaveTextContent(
      args.initialValue!,
    );

    await checkSuggestions(canvas);
  },
} satisfies Story;

export const Background = {
  args: {
    initialValue: 'initial value',
  },
  parameters: {
    backgrounds: {
      default: 'default',
      values: [{ name: 'default', value: '#00aced' }],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByLabelText('Geolocation')).toHaveTextContent(
      'initial value',
    );

    await checkSuggestions(canvas);
  },
} satisfies Story;

export const Invisible = {
  args: {
    invisible: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await checkSuggestions(canvas);
  },
} satisfies Story;

// displays above other text fields
export const Form = {
  args: {},
  decorators: [
    (Story) => (
      <>
        <Story />
        <TextField
          label="complementary information"
          placeholder="red door on the right, ..."
        />
      </>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await checkSuggestions(canvas);
  },
} satisfies Story;
