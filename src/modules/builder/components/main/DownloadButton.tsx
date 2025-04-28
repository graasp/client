import { type JSX, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { DiscriminatedItem } from '@graasp/sdk';

import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import { buildDownloadButtonId } from '@/config/selectors';
import GraaspDownloadButton from '@/ui/buttons/DownloadButton/DownloadButton';
import { ActionButton, ActionButtonVariant } from '@/ui/types';

import { BUILDER } from '../../langs';

type Props = {
  item: DiscriminatedItem;
  type?: ActionButtonVariant;
};

export const DownloadButton = ({
  item,
  type = ActionButton.ICON_BUTTON,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useTranslation(NS.Builder);

  const {
    mutate: downloadItem,
    data,
    isSuccess,
    isPending: isDownloading,
  } = mutations.useExportItem();

  useEffect(() => {
    if (isSuccess) {
      const url = window.URL.createObjectURL(new Blob([data.data]));
      const link = document.createElement('a');
      link.href = url;

      link.setAttribute('download', data.name);
      document.body.appendChild(link);
      link.click();
    }
  }, [data, isSuccess, item]);

  const handleDownload = () => {
    downloadItem({ id: item.id });
  };
  return (
    <GraaspDownloadButton
      type={type}
      id={buildDownloadButtonId(item.id)}
      handleDownload={handleDownload}
      isLoading={isDownloading}
      title={translateBuilder(BUILDER.DOWNLOAD_ITEM_BUTTON)}
      ariaLabel={translateBuilder(BUILDER.DOWNLOAD_ITEM_BUTTON)}
    />
  );
};

export default DownloadButton;
