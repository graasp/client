import { type JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DiscriminatedItem } from '@graasp/sdk';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { NS } from '@/config/constants';
import { createShortcutMutation } from '@/openapi/client/@tanstack/react-query.gen';
import { getKeyForParentId } from '@/query/keys';

import { BUILDER } from '../../../langs';
import ItemSelectionModal, {
  ItemSelectionModalProps,
} from '../../main/itemSelectionModal/ItemSelectionModal';

export type Props = {
  item: DiscriminatedItem;
  onClose: () => void;
  open: boolean;
};

const CreateShortcutModal = ({
  item: defaultItem,
  onClose,
  open,
}: Props): JSX.Element | null => {
  const queryClient = useQueryClient();
  const { t: translateBuilder } = useTranslation(NS.Builder);
  const { mutateAsync: createShortcut } = useMutation(createShortcutMutation());
  const [item] = useState<DiscriminatedItem>(defaultItem);

  const onConfirm: ItemSelectionModalProps['onConfirm'] = async (
    destination,
  ): Promise<void> => {
    const target = item.id; // id of the item where the shortcut is pointing

    await createShortcut({
      body: {
        name: translateBuilder(BUILDER.CREATE_SHORTCUT_DEFAULT_NAME, {
          name: item?.name,
        }),
        target,
      },
      query: {
        parentId: destination,
      },
    });

    // invalidate children of parent
    const key = getKeyForParentId(destination);
    queryClient.invalidateQueries({ queryKey: key });

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
        itemIds={[item.id]}
      />
    );
  }

  return null;
};

export default CreateShortcutModal;
