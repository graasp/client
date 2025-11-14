import type { JSX } from 'react';

import { Stack } from '@mui/material';

import MessageCreate from './messages/MessageCreate';
import MessageLibrary from './messages/MessageLibrary';
import { MessageShare } from './messages/MessageShare';

export function Messages(): JSX.Element {
  return (
    <Stack component="section" gap={{ xs: 10, lg: 23 }} maxWidth="md">
      <MessageCreate />
      <MessageShare />
      <MessageLibrary />
    </Stack>
  );
}
