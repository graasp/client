import { createContext, useContext } from 'react';

import { PackedItem, PermissionLevel } from '@graasp/sdk';

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
