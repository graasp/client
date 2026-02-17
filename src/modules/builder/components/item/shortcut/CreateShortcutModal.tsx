import { type JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ShortcutItemType, buildShortcutExtra } from '@graasp/sdk';

import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import type { GenericItem } from '@/openapi/client';

import { BUILDER } from '../../../langs';
import ItemSelectionModal, {
  ItemSelectionModalProps,
} from '../../main/itemSelectionModal/ItemSelectionModal';

export type Props = {
  item: GenericItem;
  onClose: () => void;
  open: boolean;
};

const CreateShortcutModal = ({
  item: defaultItem,
  onClose,
  open,
}: Props): JSX.Element | null => {
  const { t: translateBuilder } = useTranslation(NS.Builder);
  const { mutate: createShortcut } = mutations.usePostItem();
  const [item] = useState<GenericItem>(defaultItem);

  const onConfirm: ItemSelectionModalProps['onConfirm'] = (destination) => {
    const target = item.id; // id of the item where the shortcut is pointing

    const shortcut: Partial<ShortcutItemType> &
      Pick<GenericItem, 'name' | 'type'> & {
        parentId?: string;
      } = {
      name: translateBuilder(BUILDER.CREATE_SHORTCUT_DEFAULT_NAME, {
        name: item?.name,
      }),
      extra: buildShortcutExtra(target),
      type: 'shortcut',
      parentId: destination,
    };

    createShortcut(shortcut);
    onClose();
  };

  const buttonText = (name?: string) =>
    translateBuilder('CREATE_SHORTCUT_BUTTON', { name, count: name ? 1 : 0 });

  if (item && open) {
    return (
      <ItemSelectionModal
        title={translateBuilder(BUILDER.CREATE_SHORTCUT_MODAL_TITLE)}
        buttonText={buttonText}
        onClose={onClose}
        open={open}
        onConfirm={onConfirm}
        items={[item]}
      />
    );
  }

  return null;
};

export default CreateShortcutModal;
