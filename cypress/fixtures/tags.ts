import {
  DiscriminatedItem,
  ItemVisibility,
  ItemVisibilityOptionsType,
  ItemVisibilityType,
} from '@graasp/sdk';

import { v4 } from 'uuid';

import { DEFAULT_FOLDER_ITEM } from './items';
import { MockItemTag } from './mockTypes';

export const mockItemTag = ({
  itemPath,
  // creator = CURRENT_MEMBER,
  type,
}: {
  itemPath: string;
  type: ItemVisibilityOptionsType;
  // creator?: Member;
}): ItemVisibility => ({
  id: v4(),
  itemPath,
  type,
  createdAt: new Date().toISOString(),
  // creator,
});
export const mockHiddenTag = (
  item?: DiscriminatedItem,
  // creator?: Member,
): MockItemTag =>
  mockItemTag({
    itemPath: item.path ?? DEFAULT_FOLDER_ITEM.path,
    // creator,
    type: ItemVisibilityType.Hidden,
  });
export const mockPublicTag = (
  item?: DiscriminatedItem,
  // creator?: Member,
): MockItemTag =>
  mockItemTag({
    itemPath: item.path ?? DEFAULT_FOLDER_ITEM.path,
    // creator,
    type: ItemVisibilityType.Public,
  });
