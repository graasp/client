import { Box } from '@mui/material';

import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, within } from 'storybook/test';

import Button from '@/ui/buttons/Button/Button.js';
import { TABLE_CATEGORIES } from '@/ui/utils/storybook.js';

import FileDropper from './FileDropper.js';

const meta = {
  title: 'upload/FileDropper',
  component: FileDropper,
  args: {
    onChange: fn(),
  },
  argTypes: {
    onChange: {
      table: {
        category: TABLE_CATEGORIES.EVENTS,
      },
      action: 'on change',
    },
    onDrop: {
      table: {
        category: TABLE_CATEGORIES.EVENTS,
      },
      action: 'on drop',
    },
  },
} satisfies Meta<typeof FileDropper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('button', { name: 'Browse files' })).toBeVisible();
    expect(canvas.getByText('Drag your files here to upload or')).toBeVisible();
  },
} satisfies Story;

export const Container = {
  args: {
    buttonText: 'my button text',
    message: 'my text',
    buttons: <Button data-testid="button-test">my button</Button>,
  },
  decorators: [
    (story) => {
      return <Box height="400px">{story()}</Box>;
    },
  ],
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    // expect the text label
    expect(canvas.getByText(args.message!)).toBeVisible();
    // first button
    expect(canvas.getByRole('button', { name: args.buttonText })).toBeVisible();
    // other buttons passed as props can be get via their testId
    expect(canvas.getByTestId('button-test')).toHaveTextContent('my button');
  },
} satisfies Story;

const errorText = 'You cannot upload more than 10 files at a time';
export const WithError = {
  args: {
    error: <>{errorText}</>,
    hints: 'Max 15GB',
  },
  decorators: [
    (story) => {
      return <Box height="400px">{story()}</Box>;
    },
  ],
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(errorText).parentNode).toHaveRole('alert');
    expect(canvas.getByRole('dropzone')).toHaveStyle({
      'background-color': '#ffbaba',
    });
  },
} satisfies Story;

export const Loading = {
  args: {
    hints: 'Max 15GB',
    isLoading: true,
    uploadProgress: 40,
  },
  decorators: [
    (story) => {
      return <Box height="400px">{story()}</Box>;
    },
  ],
  play: ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(`${args.uploadProgress!}%`)).toBeVisible();
    expect(canvas.getByRole('progressbar')).toBeVisible();
  },
} satisfies Story;

export const ZeroLoading = {
  args: {
    hints: 'Max 15GB',
    isLoading: true,
    uploadProgress: 0,
  },
  decorators: [
    (story) => {
      return <Box height="400px">{story()}</Box>;
    },
  ],
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('progressbar')).toBeVisible();
  },
} satisfies Story;
