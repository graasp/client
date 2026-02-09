import { ItemType, isCapsule } from '@graasp/sdk';

import type { Item } from '@/openapi/client';

/**
 * Utility function to get the item's type, including capsule
 * @param item
 * @returns type of the item
 */
export function getItemType(item: Item) {
  if (
    item.type === ItemType.FOLDER &&
    // TODO: fix typing issue
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isCapsule(item as any)
  ) {
    return 'capsule';
  }
  return item.type;
}
