import type { JSX } from 'react';

import { Stack } from '@mui/material';

import MessageCreate from './messages/MessageCreate';
import MessageLibrary from './messages/MessageLibrary';

export function Messages(): JSX.Element {
  return (
    <Stack component="section" gap={25} maxWidth="md">
      <MessageCreate />
      <MessageLibrary />
    </Stack>
  );
}
