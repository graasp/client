import { type JSX, type ReactNode } from 'react';

import { Box } from '@mui/material';

import { MaxWidth } from '@graasp/sdk';

const getWidthFromSizing = (size?: MaxWidth): string => {
  switch (size) {
    case MaxWidth.ExtraSmall:
      return '100px';
    case MaxWidth.Small:
      return '200px';
    case MaxWidth.Medium:
      return '400px';
    case MaxWidth.Large:
      return '800px';
    // default is for the element to take all available horizontal space
    case MaxWidth.ExtraLarge:
    default:
      return '100%';
  }
};

export const SizingWrapper = ({
  size = MaxWidth.ExtraLarge,
  children,
}: {
  size?: MaxWidth;
  children: ReactNode;
}): JSX.Element => {
  const width = getWidthFromSizing(size);
  return (
    <Box maxWidth="100%" width={width}>
      {children}
    </Box>
  );
};
