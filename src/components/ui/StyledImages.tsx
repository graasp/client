import { styled } from '@mui/material';

const baseIllustrationImageStyle = {
  // needed so image does not bleed out
  width: '100%',
  objectFit: 'cover',

  minHeight: '0px',
  minWidth: '0px',
} as const;

export const Image = styled('img')(() => ({
  ...baseIllustrationImageStyle,
}));
