import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';

import { useAuth } from '@/AuthContext';
import { hooks } from '@/config/queryClient';

import { FilterItemsContextProvider } from '~builder/components/context/FilterItemsContext';
import ModalProviders from '~builder/components/context/ModalProviders';
import { DEFAULT_ITEM_LAYOUT_MODE, ItemLayoutMode } from '~builder/enums';

const schema = z.object({
  mode: z
    .nativeEnum(ItemLayoutMode)
    .optional()
    .default(DEFAULT_ITEM_LAYOUT_MODE),
});

export const Route = createFileRoute('/builder')({
  beforeLoad({ context }) {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        search: { url: window.location.href },
      });
    }
  },
  validateSearch: zodValidator(schema),
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  // registers the item updates through websockets
  hooks.useItemFeedbackUpdates?.(user?.id);

  return (
    <ModalProviders>
      <FilterItemsContextProvider>
        <Outlet />
      </FilterItemsContextProvider>
    </ModalProviders>
  );
}
