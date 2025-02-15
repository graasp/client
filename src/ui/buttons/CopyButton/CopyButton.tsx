import { type JSX, MouseEventHandler } from 'react';

import { IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material';

import { CopyIcon } from 'lucide-react';

import {
  ActionButton,
  ActionButtonVariant,
  ColorVariants,
  ColorVariantsType,
} from '../../types.js';

export type Props = {
  color?: ColorVariantsType;
  iconClassName?: string;
  id?: string;
  menuItemClassName?: string;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLLIElement>;
  text?: string;
  type?: ActionButtonVariant;
};

const CopyButton = ({
  color = ColorVariants.Primary,
  iconClassName,
  id = '',
  menuItemClassName,
  onClick,
  text = 'Copy',
  type = ActionButton.ICON_BUTTON,
}: Props): JSX.Element => {
  const icon = <CopyIcon />;
  switch (type) {
    case ActionButton.MENU_ITEM:
      return (
        <MenuItem key={text} onClick={onClick} className={menuItemClassName}>
          <ListItemIcon>{icon}</ListItemIcon>
          {text}
        </MenuItem>
      );
    default:
      return (
        <Tooltip title={text}>
          <span>
            <IconButton
              id={id}
              color={color}
              className={iconClassName}
              aria-label={text}
              onClick={onClick}
            >
              {icon}
            </IconButton>
          </span>
        </Tooltip>
      );
  }
};

export default CopyButton;
