import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  IconButton,
  IconButtonProps,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';

import { ChevronRightIcon } from 'lucide-react';

import { MenuItemType } from './Navigator.js';

export type ExtraItemsMenuProps = {
  icon?: JSX.Element;
  menuItems: MenuItemType[];
  buildIconId?: (id: string) => string;
  buildMenuId?: (itemId: string) => string;
  name: string;
};

const Separator = <ChevronRightIcon data-testid="NavigateNextIcon" />;

const ExtraItemsMenu = ({
  icon = Separator,
  menuItems,
  buildIconId,
  buildMenuId,
  name,
}: ExtraItemsMenuProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick: IconButtonProps['onClick'] = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-haspopup="true"
        id={buildIconId?.(name)}
        aria-expanded={open ? true : undefined}
      >
        {icon}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        id={buildMenuId?.(name)}
        onClose={handleClose}
        onClick={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {menuItems?.map(({ name, path }) => (
          <MenuItem key={name} component={Link} to={path}>
            <Typography>{name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ExtraItemsMenu;
