import { type JSX, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { ListItemIcon, MenuItem } from '@mui/material';

import { PackedItem } from '@graasp/sdk';

import { FlagIcon } from 'lucide-react';

import { NS } from '@/config/constants';
import { ITEM_MENU_FLAG_BUTTON_CLASS } from '@/config/selectors';

import { FlagItemModalContext } from '../context/FlagItemModalContext';

const FlagButton = ({ item }: { item: PackedItem }): JSX.Element => {
  const { t: translateBuilder } = useTranslation(NS.Builder);

  const { openModal: openFlagModal } = useContext(FlagItemModalContext);
  const handleFlag = () => {
    openFlagModal?.(item.id);
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
