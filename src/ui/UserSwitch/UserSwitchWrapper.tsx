import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AccountCircle as AccountCircleIcon,
  MeetingRoom as MeetingRoomIcon,
} from '@mui/icons-material';
import { Divider, ListItemIcon, MenuItem, Typography } from '@mui/material';

import { AccountType, CurrentAccount, redirect } from '@graasp/sdk';

import { Settings } from 'lucide-react';

import { MenuItemLink } from '@/components/ui/MenuItemLink.js';
import { NS } from '@/config/constants.js';

import Loader from '../Loader/Loader.js';
import { UserSwitch } from './UserSwitch.js';

type UserMenuItem = {
  icon: JSX.Element;
  text: string;
  redirect_path: string;
  id?: string;
};
type Props = {
  ButtonContent?: JSX.Element;
  buttonId?: string;
  currentMember?: CurrentAccount | null;
  isCurrentMemberLoading?: boolean;
  redirectPath: string;
  avatar: JSX.Element;
  seeProfileButtonId?: string;
  signedOutTooltipText?: string;
  signOutMenuItemId?: string;
  signOutText?: string;
  /**
   * Name of the event that will be sent to Umami for tracking user actions
   */
  dataUmamiEvent?: string;
  userMenuItems?: UserMenuItem[];

  /**
   * Async function used to perform the sign out
   * @param memberId Id of the user to sign out (current user)
   * @returns Promise of void
   */
  signOut: () => Promise<void>;
};

export const UserSwitchWrapper = ({
  ButtonContent,
  buttonId,
  currentMember,
  isCurrentMemberLoading = false,
  redirectPath,
  avatar,
  seeProfileButtonId,
  signOut,
  signedOutTooltipText = 'You are not signed in.',
  signOutMenuItemId,
  signOutText = 'Sign Out',
  userMenuItems = [],
  dataUmamiEvent,
}: Props): JSX.Element => {
  const { t } = useTranslation(NS.Common);

  if (isCurrentMemberLoading) {
    return <Loader />;
  }

  const handleSignOut = async (): Promise<void> => {
    if (currentMember) {
      await signOut();
    }
    // on sign out success should redirect to sign in
    redirect(window, redirectPath);
  };

  const handleSignIn = (): void => {
    return redirect(window, redirectPath);
  };

  let Actions: JSX.Element[];

  const MenuItems = userMenuItems.map((item: UserMenuItem) => (
    <MenuItem
      key={item.text}
      onClick={() => redirect(window, item.redirect_path)}
      id={item.id}
    >
      <ListItemIcon>{item.icon}</ListItemIcon>
      <Typography variant="subtitle2">{item.text}</Typography>
    </MenuItem>
  ));

  if (currentMember && currentMember.id) {
    Actions =
      currentMember.type === AccountType.Individual
        ? [
            <MenuItemLink key="seeProfile" id={seeProfileButtonId} to="/home">
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <Typography variant="subtitle2">
                {t('USER_SWITCH.PROFILE')}
              </Typography>
            </MenuItemLink>,
            <MenuItemLink key="settings" to="/account/settings">
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <Typography variant="subtitle2">
                {t('USER_SWITCH.SETTINGS')}
              </Typography>
            </MenuItemLink>,
            <Divider key="divider" />,
          ]
        : [];

    Actions.push(...MenuItems);

    Actions.push(
      <MenuItem key="signout" onClick={handleSignOut} id={signOutMenuItemId}>
        <ListItemIcon>
          <MeetingRoomIcon />
        </ListItemIcon>
        <Typography variant="subtitle2">{signOutText}</Typography>
      </MenuItem>,
    );
  } else {
    Actions = [
      <MenuItem key="signin" onClick={handleSignIn}>
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <Typography variant="subtitle2">{t('USER_SWITCH.SIGN_IN')}</Typography>
      </MenuItem>,
    ];
  }

  return (
    <UserSwitch
      ButtonContent={ButtonContent}
      Actions={Actions}
      currentMember={currentMember}
      signedOutTooltipText={signedOutTooltipText}
      buttonId={buttonId}
      avatar={avatar}
      dataUmamiEvent={dataUmamiEvent}
    />
  );
};

export default UserSwitchWrapper;
