import React, { JSX } from 'react';

import { Stack } from '@mui/material';

function BodyWrapper({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <Stack
      id="bodyWrapper"
      direction="column"
      width="100%"
      alignItems="center"
      p={4}
      gap={15}
    >
      {children}
    </Stack>
  );
}

export default BodyWrapper;
