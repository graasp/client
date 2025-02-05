import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { ListItemIcon, MenuItem } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

import { CopyIcon } from 'lucide-react';

import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import { ITEM_MENU_DUPLICATE_BUTTON_CLASS } from '@/config/selectors';

import { BUILDER } from '~builder/langs';
import { getParentsIdsFromPath } from '~builder/utils/item';

const DuplicateButton = ({
  item,
}: {
  item: DiscriminatedItem;
}): JSX.Element => {
  const { mutate: copyItems } = mutations.useCopyItems();
  const { t: translateBuilder } = useTranslation(NS.Builder);

  const handleDuplicate = () => {
    const parentsIds = getParentsIdsFromPath(item.path, { ignoreSelf: true });
    // get the close parent if not then undefined
    const to = parentsIds.length
      ? parentsIds[parentsIds.length - 1]
      : undefined;

    copyItems({
      ids: [item.id],
      to,
    });
  };

  return (
    <MenuItem
      onClick={handleDuplicate}
      key="duplicate"
      className={ITEM_MENU_DUPLICATE_BUTTON_CLASS}
    >
      <ListItemIcon>
        <CopyIcon />
      </ListItemIcon>
      {translateBuilder(BUILDER.ITEM_MENU_DUPLICATE_MENU_ITEM)}
    </MenuItem>
  );
};

export default DuplicateButton;
