import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PublicationStatus } from '@graasp/sdk';

import { NS } from '@/config/constants';
import { usePublicationStatus } from '@/query/item/publication/hooks';

import { SETTINGS } from '../../../constants';
import { BUILDER } from '../../../langs';
import { Visibility } from './UpdateVisibilityModal';

type Props = {
  itemId: string;
  visibility?: string;
  updateVisibility: (newVisibility: string) => void | Promise<void>;
};

type UseVisibilitySelect = {
  isModalOpen: boolean;
  pendingVisibility: Visibility | undefined;
  onCloseModal: () => void;
  onValidateModal: (newVisibility: string) => void;
  onVisibilityChange: (newVisibility: string) => void;
};

const useVisibilitySelect = ({
  itemId,
  visibility,
  updateVisibility,
}: Props): UseVisibilitySelect => {
  const { t: translateBuilder } = useTranslation(NS.Builder);
  const { data: publicationStatus } = usePublicationStatus(itemId);

  // The visibility value is temporary and awaits user confirmation through the dialog.
  const [pendingVisibility, setPendingVisibility] = useState<
    Visibility | undefined
  >();

  const translatedVisibilities = {
    [SETTINGS.ITEM_LOGIN.name]: translateBuilder(
      BUILDER.ITEM_SETTINGS_VISIBILITY_PSEUDONYMIZED_LABEL,
    ),
    [SETTINGS.ITEM_PUBLIC.name]: translateBuilder(
      BUILDER.ITEM_SETTINGS_VISIBILITY_PUBLIC_INFORMATIONS,
    ),
    [SETTINGS.ITEM_PRIVATE.name]: translateBuilder(
      BUILDER.ITEM_SETTINGS_VISIBILITY_PRIVATE_LABEL,
    ),
  };

  const onVisibilityChange = (newVisibility: string) => {
    if (
      visibility === SETTINGS.ITEM_PUBLIC.name &&
      publicationStatus === PublicationStatus.Published
    ) {
      setPendingVisibility({
        name: translatedVisibilities[newVisibility],
        value: newVisibility,
      });
    } else {
      updateVisibility(newVisibility);
    }
  };

  const onCloseModal = () => setPendingVisibility(undefined);
  const onValidateModal = (newVisibility: string) => {
    onCloseModal();
    updateVisibility(newVisibility);
  };

  return {
    isModalOpen: Boolean(pendingVisibility),
    pendingVisibility,
    onCloseModal,
    onValidateModal,
    onVisibilityChange,
  };
};

export default useVisibilitySelect;
