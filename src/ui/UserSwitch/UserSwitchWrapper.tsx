import {
  AccountCircle as AccountCircleIcon,
  MeetingRoom as MeetingRoomIcon,
} from '@mui/icons-material';
import { ListItemIcon, MenuItem, Typography } from '@mui/material';

import { AccountType, CurrentAccount, redirect } from '@graasp/sdk';

import Loader from '../Loader/Loader.js';
import { UserSwitch } from './UserSwitch.js';

type UserMenuItem = {
  icon: JSX.Element;
  text: string;
  redirect_path: string;
  id?: string;
};
type Props = {
  buildMemberMenuItemId?: (id: string) => string;
  ButtonContent?: JSX.Element;
  buttonId?: string;
  currentMember?: CurrentAccount | null;
  // domain: string;
  isCurrentMemberLoading?: boolean;
  // isCurrentMemberSuccess: boolean;
  profilePath: string;
  redirectPath: string;
  avatar: JSX.Element;
  seeProfileButtonId?: string;
  seeProfileText?: string;
  signedOutTooltipText?: string;
  signInMenuItemId?: string;
  /**
   * Async function used to perform the sign out
   * @param memberId Id of the user to sign out (current user)
   * @returns Promise of void
   */
  signOut: () => Promise<void>;
  signOutMenuItemId?: string;
  signOutText?: string;
  // switchMember: (args: { memberId: string; domain: string }) => Promise<void>;
  switchMemberText?: string;
  /**
   * Name of the event that will be sent to Umami for tracking user actions
   */
  dataUmamiEvent?: string;
  userMenuItems?: UserMenuItem[];
};

export const UserSwitchWrapper = ({
  buildMemberMenuItemId,
  ButtonContent,
  buttonId,
  currentMember,
  // domain,
  isCurrentMemberLoading = false,
  // isCurrentMemberSuccess,
  profilePath,
  redirectPath,
  avatar,
  seeProfileButtonId,
  seeProfileText = 'See Profile',
  signedOutTooltipText = 'You are not signed in.',
  signInMenuItemId,
  signOut,
  signOutMenuItemId,
  signOutText = 'Sign Out',
  // switchMember,
  switchMemberText = 'Sign in',
  userMenuItems = [],
  dataUmamiEvent,
}: Props): JSX.Element => {
  // get stored sessions
  // const sessions = getStoredSessions();
  // const { data } = useMembers(sessions.map(({ id }) => id));
  // const members = data?.data?.toSeq()?.toList();

  // save current member in sessions if it doesn't exist
  // it is not possible to do it on /auth since it's a backend call
  // useEffect(() => {
  //   if (currentMember && isCurrentMemberSuccess) {
  //     const token = getCurrentSession();
  //     if (token) {
  //       storeSession(
  //         { id: currentMember.get('id'), token, createdAt: Date.now() },
  //         domain,
  //       );
  //     }
  //   }
  // }, [currentMember, isCurrentMemberSuccess]);

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
    // setCurrentSession(null, domain);
    // saveUrlForRedirection(window.location.href, domain);
    return redirect(window, redirectPath);
  };

  const goToProfile = (): void => {
    redirect(window, profilePath);
  };

  // const onMemberClick = (memberId: string) => () =>
  //   switchMember({ memberId, domain });

  let Actions: JSX.Element[];

  const MenuItems = userMenuItems.map((item: UserMenuItem) => (
    <MenuItem
      key={item.text}
      onClick={() => redirect(window, item.redirect_path)}
      id={item.id}
    >
      <ListItemIcon>{item.icon}</ListItemIcon>
      <Typography variant='subtitle2'>{item.text}</Typography>
    </MenuItem>
  ));
  if (currentMember && currentMember.id) {
    Actions =
      currentMember.type === AccountType.Individual
        ? [
            <MenuItem
              key='seeProfile'
              onClick={goToProfile}
              id={seeProfileButtonId}
            >
              <ListItemIcon>
                <AccountCircleIcon fontSize='large' />
              </ListItemIcon>
              <Typography variant='subtitle2'>{seeProfileText}</Typography>
            </MenuItem>,
          ]
        : [];

    Actions.push(...MenuItems);

    Actions.push(
      <MenuItem key='signout' onClick={handleSignOut} id={signOutMenuItemId}>
        <ListItemIcon>
          <MeetingRoomIcon fontSize='large' />
        </ListItemIcon>
        <Typography variant='subtitle2'>{signOutText}</Typography>
      </MenuItem>,
    );
  } else {
    Actions = [
      <MenuItem key='signin' onClick={handleSignIn} id={signInMenuItemId}>
        <ListItemIcon>
          <AccountCircleIcon fontSize='large' />
        </ListItemIcon>
        <Typography variant='subtitle2'>{switchMemberText}</Typography>
      </MenuItem>,
    ];
  }

  return (
    <UserSwitch
      ButtonContent={ButtonContent}
      Actions={Actions}
      // onMemberClick={onMemberClick}
      currentMember={currentMember}
      // members={members}
      signedOutTooltipText={signedOutTooltipText}
      buttonId={buttonId}
      buildMemberMenuItemId={buildMemberMenuItemId}
      avatar={avatar}
      dataUmamiEvent={dataUmamiEvent}
    />
  );
};

export default UserSwitchWrapper;