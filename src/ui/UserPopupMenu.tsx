import { type JSX, type MouseEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';

import { AccountType } from '@graasp/sdk';

import {
  CircleHelpIcon,
  DoorOpenIcon,
  SettingsIcon,
  UserCircle2Icon,
} from 'lucide-react';

import { AuthenticatedMember } from '@/AuthContext';
import { MenuItemLink } from '@/components/ui/MenuItemLink';
import { NS } from '@/config/constants';

const MENU_ARIA_ID = 'account-menu';

type Props = {
  buttonId?: string;
  avatar: JSX.Element;
  user: AuthenticatedMember;
  seeProfileButtonId?: string;
  signOutMenuItemId?: string;
  signOutText: string;
  /**
   * Name of the event that will be sent to Umami for tracking user actions
   */
  dataUmamiEvent?: string;

  /**
   * Async function used to perform the sign out
   * @param memberId Id of the user to sign out (current user)
   * @returns Promise of void
   */
  signOut: () => Promise<void>;
};

export function UserPopupMenu({
  buttonId,
  user,
  seeProfileButtonId,
  signOutMenuItemId,
  avatar,
  dataUmamiEvent,
  signOut,
  signOutText,
}: Readonly<Props>) {
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(
    null,
  );
  const { t } = useTranslation(NS.Common);

  const handleClick: MouseEventHandler = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        id={buttonId}
        aria-controls={open ? MENU_ARIA_ID : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        data-umami-event={dataUmamiEvent}
      >
        {avatar}
      </IconButton>
      <Menu
        id={MENU_ARIA_ID}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {user.type === AccountType.Individual && (
          <>
            <MenuItemLink
              key="seeProfile"
              id={seeProfileButtonId}
              to="/home"
              onClick={handleClose}
            >
              <ListItemIcon>
                <UserCircle2Icon />
              </ListItemIcon>
              <Typography variant="subtitle2">
                {t('USER_SWITCH.PROFILE')}
              </Typography>
            </MenuItemLink>
            <MenuItemLink
              key="settings"
              to="/account/settings"
              onClick={handleClose}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <Typography variant="subtitle2">
                {t('USER_SWITCH.SETTINGS')}
              </Typography>
            </MenuItemLink>
            <Divider key="divider" />
            <MenuItemLink key="help" to="/support" onClick={handleClose}>
              <ListItemIcon>
                <CircleHelpIcon />
              </ListItemIcon>
              <Typography variant="subtitle2">
                {t('USER_SWITCH.NEED_HELP')}
              </Typography>
            </MenuItemLink>
          </>
        )}
        <MenuItem key="signout" onClick={signOut} id={signOutMenuItemId}>
          <ListItemIcon>
            <DoorOpenIcon />
          </ListItemIcon>
          <Typography variant="subtitle2">{signOutText}</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
