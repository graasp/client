import { Stack } from '@mui/material';

import { createFileRoute } from '@tanstack/react-router';

import { HomeMessage } from '~analytics/HomeMessage';

export const Route = createFileRoute('/analytics/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Stack
      width="100%"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <HomeMessage />
    </Stack>
  );
}
