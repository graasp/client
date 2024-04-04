// ThemeTypography.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

import { Typography } from '@mui/material';

const meta: Meta<typeof Typography> = {
  title: 'Common/TypographyVariants',
  component: Typography,
};

export default meta;

type Story = StoryObj<typeof Typography>;

export const Variants: Story = {
  render: () => (
    <>
      <Typography variant='display'>Display</Typography>
      <Typography variant='h1'>H1</Typography>
      <Typography variant='h2'>H2</Typography>
      <Typography variant='h3'>H3</Typography>
      <Typography variant='h4'>H4</Typography>
      <Typography variant='h5'>H5</Typography>
      <Typography variant='h6'>H6</Typography>
      <Typography variant='body1'>body</Typography>
      <Typography variant='label'>label</Typography>
      <Typography variant='note'>note</Typography>
    </>
  ),
};
