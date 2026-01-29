import { ItemType } from '@/openapi/client';

export const InternalItemType = {
  ZIP: 'zip',
} as const;

export type NewItemTabType = ItemType | typeof InternalItemType.ZIP;
