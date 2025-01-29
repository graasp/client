import { Outlet, createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';

import { useAuth } from '@/AuthContext';
import { hooks } from '@/config/queryClient';

import ModalProviders from '~builder/components/context/ModalProviders';
import { DEFAULT_ITEM_LAYOUT_MODE, ItemLayoutMode } from '~builder/enums';

const schema = z.object({
  mode: z
    .nativeEnum(ItemLayoutMode)
    .optional()
    .default(DEFAULT_ITEM_LAYOUT_MODE),
});

export const Route = createFileRoute('/builder')({
  validateSearch: zodValidator(schema),
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  // registers the item updates through websockets
  hooks.useItemFeedbackUpdates?.(user?.id);

  return (
    <ModalProviders>
      <Outlet />
    </ModalProviders>
  );
}
