import { type JSX, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { ListItemIcon, MenuItem } from '@mui/material';

import { FlagIcon } from 'lucide-react';

import { NS } from '@/config/constants';
import { ITEM_MENU_FLAG_BUTTON_CLASS } from '@/config/selectors';
import type { Item } from '@/openapi/client';

import { FlagItemModalContext } from '../context/FlagItemModalContext';

const FlagButton = ({ itemId }: { itemId: Item['id'] }): JSX.Element => {
  const { t: translateBuilder } = useTranslation(NS.Builder);

  const { openModal: openFlagModal } = useContext(FlagItemModalContext);
  const handleFlag = () => {
    openFlagModal?.(itemId);
  };

  return (
    <MenuItem onClick={handleFlag} className={ITEM_MENU_FLAG_BUTTON_CLASS}>
      <ListItemIcon>
        <FlagIcon />
      </ListItemIcon>
      {translateBuilder('ITEM_MENU_FLAG_MENU_ITEM')}
    </MenuItem>
  );
};

export default FlagButton;
