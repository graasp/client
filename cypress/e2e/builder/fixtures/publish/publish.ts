import {
  ItemTypeUnion,
  PackedAppItemFactory,
  PackedDocumentItemFactory,
  PackedEtherpadItemFactory,
  PackedFileItemFactory,
  PackedFolderItemFactory,
  PackedH5PItemFactory,
  PackedLinkItemFactory,
  PackedShortcutItemFactory,
} from '@graasp/sdk';

import { ItemForTest } from '../../../../support/types';

export const createPublicItemByType = (
  itemType: ItemTypeUnion,
): ItemForTest => {
  const publicVisibility = { publicVisibility: {} };

  switch (itemType) {
    case 'app':
      return PackedAppItemFactory({}, publicVisibility);
    case 'document':
      return PackedDocumentItemFactory({}, publicVisibility);
    case 'folder':
      return PackedFolderItemFactory({}, publicVisibility);
    case 'embeddedLink':
      return PackedLinkItemFactory({}, publicVisibility);
    case 'file':
      return PackedFileItemFactory({}, publicVisibility);
    case 'shortcut':
      return PackedShortcutItemFactory({}, publicVisibility);
    case 'h5p':
      return PackedH5PItemFactory({}, publicVisibility);
    case 'etherpad':
      return PackedEtherpadItemFactory({}, publicVisibility);
    default:
      throw new Error(
        `Item Type "${itemType}" is unknown in "createPublicItemWithType"`,
      );
  }
};

export default createPublicItemByType;
