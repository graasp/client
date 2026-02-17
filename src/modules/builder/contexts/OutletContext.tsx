import { createContext, useContext } from 'react';

import type { PackedItem, PermissionLevel } from '@/openapi/client';

type OutletContextType = {
  item: PackedItem;
  canWrite: boolean;
  canAdmin: boolean;
  permission?: PermissionLevel | null;
};
export const OutletContext = createContext<OutletContextType>({
  item: undefined!,
  canWrite: false,
  canAdmin: false,
  permission: undefined!,
});

export const useOutletContext = () => useContext(OutletContext);
