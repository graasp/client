import { ReactNode } from 'react';

import { Stack, Typography, useTheme } from '@mui/material';

import { GraaspLogo } from '@graasp/ui';

type DialogHeaderProps = {
  title: string;
  description?: string | ReactNode;
};
export function DialogHeader({
  title,
  description,
}: Readonly<DialogHeaderProps>) {
  const theme = useTheme();

  return (
    <Stack direction="column" alignItems="center" spacing={1} width="100%">
      <GraaspLogo height={90} sx={{ fill: theme.palette.primary.main }} />
      <Typography variant="h4" component="h2">
        {title}
      </Typography>
      {description &&
        (typeof description === 'string' ? (
          <Typography pt={2}>{description}</Typography>
        ) : (
          description
        ))}
    </Stack>
  );
}
