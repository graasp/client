import { type JSX, ReactNode } from 'react';

import { Divider, Stack, Typography } from '@mui/material';

type ScreenLayoutProps = {
  readonly id?: string;
  readonly title: string;
  readonly children: ReactNode;
};
export function ScreenLayout({
  id,
  title,
  children,
}: ScreenLayoutProps): JSX.Element {
  return (
    <Stack spacing={2} id={id}>
      <Typography variant="h2" component="h1">
        {title}
      </Typography>
      <Divider />
      {children}
    </Stack>
  );
}
