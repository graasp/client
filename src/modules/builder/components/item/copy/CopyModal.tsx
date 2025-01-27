import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { DiscriminatedItem } from '@graasp/sdk';

import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';

import { BUILDER } from '../../../langs';
import ItemSelectionModal, {
  ItemSelectionModalProps,
} from '../../main/itemSelectionModal/ItemSelectionModal';

export const CopyModal = ({
  itemIds,
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
  itemIds: DiscriminatedItem['id'][];
}): JSX.Element | null => {
  const { mutate: copyItems } = mutations.useCopyItems();
  const { t: translateBuilder } = useTranslation(NS.Builder);

  const onConfirm: ItemSelectionModalProps['onConfirm'] = (destination) => {
    copyItems({
      ids: itemIds,
      to: destination,
    });
    onClose();
  };

  const buttonText = (name?: string) =>
    translateBuilder('COPY_BUTTON', { name, count: name ? 1 : 0 });

  // prevent loading if not opened
  if (!open) {
    return null;
  }

  return (
    <ItemSelectionModal
      titleKey={BUILDER.COPY_ITEM_MODAL_TITLE}
      buttonText={buttonText}
      onClose={onClose}
      open={open}
      onConfirm={onConfirm}
      itemIds={itemIds}
    />
  );
};
