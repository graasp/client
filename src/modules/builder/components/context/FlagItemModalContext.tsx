import { type JSX, createContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FlagType } from '@graasp/sdk';

import { NS } from '@/config/constants';
import notifier from '@/config/notifier';
import { mutations } from '@/config/queryClient';
import { routines } from '@/query';
import { ItemFlagDialog } from '@/ui/ItemFlag/ItemFlagDialog';

const { postItemFlagRoutine } = routines;

const FlagItemModalContext = createContext<{
  openModal?: (id: string) => void;
}>({});

const FlagItemModalProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const { t: translateBuilder } = useTranslation(NS.Builder);
  const { t: translateCommon } = useTranslation(NS.Common);
  const { mutate: postItemFlag } = mutations.usePostItemFlag();
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState<string | null>(null);

  const openModal = (newItemId: string) => {
    setOpen(true);
    setItemId(newItemId);
  };

  const onClose = () => {
    setOpen(false);
    setItemId(null);
  };

  const onFlag = (newFlag?: FlagType) => {
    if (!itemId || !newFlag) {
      notifier({
        type: postItemFlagRoutine.FAILURE,
        payload: { error: new Error('item id or flag type is not defined') },
      });
    } else {
      postItemFlag({
        type: newFlag,
        itemId,
      });
    }
    onClose();
  };

  const value = useMemo(() => ({ openModal }), []);

  return (
    <FlagItemModalContext.Provider value={value}>
      <ItemFlagDialog
        flags={Object.values(FlagType)}
        onFlag={onFlag}
        open={open}
        onClose={onClose}
        descriptionText={translateBuilder('FLAG_REASON_DESCRIPTION')}
        title={translateBuilder('FLAG_MODAL_TITLE')}
        cancelButtonText={translateCommon('CANCEL.BUTTON_TEXT')}
        confirmButtonText={translateBuilder('FLAG_MODAL_CONFIRM')}
      />
      {children}
    </FlagItemModalContext.Provider>
  );
};

export { FlagItemModalProvider, FlagItemModalContext };
