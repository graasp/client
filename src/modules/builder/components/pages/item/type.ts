import type { PackedItem } from '@graasp/sdk';

import type { PermissionLevel } from '@/openapi/client';

export interface OutletType {
  item: PackedItem;
  permission?: PermissionLevel;
  canWrite: boolean;
  canAdmin: boolean;
}
