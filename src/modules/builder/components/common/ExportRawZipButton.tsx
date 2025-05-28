import { type JSX, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { ListItemIcon, MenuItem } from '@mui/material';

import { PackedItem } from '@graasp/sdk';

import { useMutation } from '@tanstack/react-query';
import { Package } from 'lucide-react';

import { NS } from '@/config/constants';
import { exportZipMutation } from '@/openapi/client/@tanstack/react-query.gen';

const ExportRawZipButton = ({ item }: { item: PackedItem }): JSX.Element => {
  const { t: translateBuilder } = useTranslation(NS.Builder);
  const { t: translateMessage } = useTranslation(NS.Messages);

  const { mutate: exportZip } = useMutation({
    ...exportZipMutation(),
    onSuccess: () => {
      toast.success(translateMessage('EXPORT_RAW_SUCCESS_MESSAGE'));
    },
    onError: () => {
      toast.error(translateMessage('UNEXPECTED_EXPORT_ERROR'));
    },
  });

  return (
    <MenuItem onClick={() => exportZip({ path: { itemId: item.id } })}>
      <ListItemIcon>
        <Package />
      </ListItemIcon>
      {translateBuilder('ITEM_MENU_EXPORT_RAW_MENU_ITEM')}
    </MenuItem>
  );
};

export default ExportRawZipButton;
