import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { DiscriminatedItem } from '@graasp/sdk';
import { DownloadButton as Button } from '@graasp/ui';

import { NS } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import { buildDownloadButtonId } from '@/config/selectors';

import { BUILDER } from '../../langs/constants';

type Props = {
  item: DiscriminatedItem;
};

export const DownloadButton = ({ item }: Props): JSX.Element => {
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
    <span id={buildDownloadButtonId(item.id)}>
      <Button
        handleDownload={handleDownload}
        isLoading={isDownloading}
        title={translateBuilder(BUILDER.DOWNLOAD_ITEM_BUTTON)}
        ariaLabel={translateBuilder(BUILDER.DOWNLOAD_ITEM_BUTTON)}
      />
    </span>
  );
};

export default DownloadButton;
