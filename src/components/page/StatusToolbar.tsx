import { Avatar, AvatarGroup, Stack } from '@mui/material';

import { RefreshCwOffIcon } from 'lucide-react';

export function StatusToolbar({
  users,
  isConnected,
}: {
  users: { name: string }[];
  isConnected: boolean;
}) {
  return (
    <Stack justifyContent="space-between" alignContent="center" direction="row">
      <Stack>{!isConnected && <RefreshCwOffIcon />}</Stack>
      <AvatarGroup>
        {users.map((user) => (
          <Avatar>{user.name[0].toUpperCase()}</Avatar>
        ))}
      </AvatarGroup>
    </Stack>
  );
}
