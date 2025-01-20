import {
  DiscriminatedItem,
  ItemVisibility,
  ItemVisibilityType,
  Member,
} from '@graasp/sdk';

import { v4 } from 'uuid';

import { DEFAULT_FOLDER_ITEM } from './items';
import { CURRENT_MEMBER } from './members';
import { MockItemTag } from './mockTypes';

export const mockItemTag = ({
  item,
  creator = CURRENT_MEMBER,
  type,
}: {
  item: DiscriminatedItem;
  type: ItemVisibilityType;
  creator?: Member;
}): ItemVisibility => ({
  id: v4(),
  item,
  type,
  createdAt: new Date().toISOString(),
  creator,
});
export const mockHiddenTag = (
  item?: DiscriminatedItem,
  creator?: Member,
): MockItemTag =>
  mockItemTag({
    item: item ?? DEFAULT_FOLDER_ITEM,
    creator,
    type: ItemVisibilityType.Hidden,
  });
export const mockPublicTag = (
  item?: DiscriminatedItem,
  creator?: Member,
): MockItemTag =>
  mockItemTag({
    item: item ?? DEFAULT_FOLDER_ITEM,
    creator,
    type: ItemVisibilityType.Public,
  });
