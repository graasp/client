import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { ListItemIcon, MenuItem } from '@mui/material';

import { useMutation } from '@tanstack/react-query';
import { PackageIcon } from 'lucide-react';

import { NS } from '@/config/constants';
import { buildExportAsZipButtonId } from '@/config/selectors';
import type { Item } from '@/openapi/client';
import { exportZipMutation } from '@/openapi/client/@tanstack/react-query.gen';

type Props = {
  itemId: Item['id'];

  /**
   * ui context the button is located
   */
  dataUmamiContext?: string;
};

/**
 * Export folder as zip
 * This button cannot be for other item types
 */
const ExportRawZipButton = ({
  itemId,
  dataUmamiContext,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useTranslation(NS.Builder);
  const { t: translateMessage } = useTranslation(NS.Messages);

  const { mutate: exportZip } = useMutation({
    ...exportZipMutation(),
    onSuccess: () => {
      toast.success(translateMessage('EXPORT_RAW_SUCCESS_MESSAGE'));
    },
    onError: () => {
      toast.error(translateMessage('EXPORT_RAW_ERROR_MESSAGE'));
    },
  });

  return (
    <MenuItem
      id={buildExportAsZipButtonId(itemId)}
      onClick={() => exportZip({ path: { itemId } })}
      data-umami-event="export-zip"
      data-umami-event-context={dataUmamiContext}
    >
      <ListItemIcon>
        <PackageIcon />
      </ListItemIcon>
      {translateBuilder('ITEM_MENU_EXPORT_RAW_MENU_ITEM')}
    </MenuItem>
  );
};

export default ExportRawZipButton;
