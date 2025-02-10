import { Divider, Stack, Typography } from '@mui/material';

import { createFileRoute } from '@tanstack/react-router';
import { UserRoundPlusIcon } from 'lucide-react';

import { ButtonLink } from '@/components/ui/ButtonLink';

import { CenteredContent } from '~auth/components/layout/CenteredContent';
import { DialogHeader } from '~auth/components/layout/DialogHeader';

export const Route = createFileRoute('/auth/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <CenteredContent
      header={
        <DialogHeader
          title="Authentication"
          description="You will need to connect to your account to access personal content"
        />
      }
    >
      <Stack
        direction="row"
        gap={4}
        divider={
          <Divider orientation="vertical" flexItem>
            or
          </Divider>
        }
      >
        <Stack direction="column" gap={2}>
          <Typography>New to the platform ?</Typography>
          <ButtonLink to="/auth/register" startIcon={<UserRoundPlusIcon />}>
            Create an account
          </ButtonLink>
        </Stack>
        <Stack direction="column" gap={2}>
          <Typography>Already registered users</Typography>
          <ButtonLink to="/auth/login">I already have an account</ButtonLink>
        </Stack>
      </Stack>
    </CenteredContent>
  );
}
