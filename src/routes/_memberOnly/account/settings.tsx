import type { JSX } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import { SettingsPage } from '~account/settings/pages/SettingsPage';

export const Route = createFileRoute('/_memberOnly/account/settings')({
  component: SettingsRoute,
});

function SettingsRoute(): JSX.Element {
  return <SettingsPage />;
}
