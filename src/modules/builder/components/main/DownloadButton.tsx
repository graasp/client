import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { NS } from '@/config/constants';
import { buildDownloadButtonId } from '@/config/selectors';
import type { GenericItem } from '@/openapi/client';
import GraaspDownloadButton from '@/ui/buttons/DownloadButton/DownloadButton';
import { ActionButton, ActionButtonVariant } from '@/ui/types';

import { BUILDER } from '../../langs';

type Props = {
  item: GenericItem;
  type?: ActionButtonVariant;
};

/**
 * Download file button
 * This button cannot be used for folders
 */
export const DownloadButton = ({
  item,
  type = ActionButton.ICON_BUTTON,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useTranslation(NS.Builder);

  return (
    <GraaspDownloadButton
      type={type}
      id={buildDownloadButtonId(item.id)}
      link={`/api/items/${item.id}/download-file`}
      title={translateBuilder(BUILDER.DOWNLOAD_ITEM_BUTTON)}
      ariaLabel={translateBuilder(BUILDER.DOWNLOAD_ITEM_BUTTON)}
    />
  );
};

export default DownloadButton;
