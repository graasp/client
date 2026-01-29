import { DiscriminatedItem, ItemType, isCapsule } from '@graasp/sdk';

/**
 * Utility function to get the item's type, including capsule
 * @param item
 * @returns
 */
export function getItemType(item: DiscriminatedItem) {
  if (item.type === ItemType.FOLDER && isCapsule(item)) {
    return 'capsule';
  }
  return item.type;
}
