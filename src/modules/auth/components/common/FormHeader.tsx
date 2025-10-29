import type { JSX } from 'react';

import { Stack, Typography, useTheme } from '@mui/material';

import GraaspLogo from '@/ui/GraaspLogo/GraaspLogo';

type FormHeaderProps = {
  readonly id?: string;
  readonly title: string;
};
export function FormHeader({ id, title }: FormHeaderProps): JSX.Element {
  const theme = useTheme();
  return (
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <GraaspLogo height={60} sx={{ fill: theme.palette.primary.main }} />
        <Typography variant="h2" id={id} color="primary">
          Graasp
        </Typography>
      </Stack>
      <Typography variant="h4" component="h2" id={id} textAlign="center">
        {title}
      </Typography>
    </Stack>
  );
}
