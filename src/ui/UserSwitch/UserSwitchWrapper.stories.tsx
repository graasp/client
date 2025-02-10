import {
  GuestFactory,
  ItemLoginSchemaFactory,
  ItemLoginSchemaType,
  Member,
  MemberFactory,
  PackedFolderItemFactory,
} from '@graasp/sdk';

import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent, within } from '@storybook/test';

import { SMALL_AVATAR_SIZE } from '@/ui/constants.js';

import Avatar from '../Avatar/Avatar.js';
import UserSwitchWrapper from './UserSwitchWrapper.js';

const meta = {
  title: 'Common/UserSwitch/UserSwitchWrapper',
  component: UserSwitchWrapper,
  argTypes: {
    signOut: { action: 'signOut' },
  },
  args: {
    signOut: async () => {},
    redirectPath: 'redirectPath',
  },
} satisfies Meta<typeof UserSwitchWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

const CURRENT_MEMBER = MemberFactory();

export const SignedIn = {
  args: {
    signOutText: 'Sign Out',
    currentMember: CURRENT_MEMBER,
    avatar: (
      <Avatar
        maxWidth={SMALL_AVATAR_SIZE}
        maxHeight={SMALL_AVATAR_SIZE}
        url={'https://picsum.photos/100'}
        alt={`profile image ${CURRENT_MEMBER.name}`}
        component={'avatar'}
        sx={{ mx: 1 }}
      />
    ),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const { currentMember } = args;
    const member = currentMember as Member;

    // open dialog
    const nameText = canvas.getByLabelText(member.name);
    await userEvent.click(nameText);

    const menuCanvas = within(screen.getByRole('menu'));

    // profile and settings buttons
    expect(menuCanvas.getByText('Profile')).toBeInTheDocument();
    expect(menuCanvas.getByText('Settings')).toBeInTheDocument();

    // email
    const emailText = menuCanvas.getByText(member.email);
    expect(emailText).toBeInTheDocument();

    // sign out button
    const signOutButton = menuCanvas.getByText('Sign Out');
    expect(signOutButton).toBeInTheDocument();
  },
} satisfies Story;

export const Guest = {
  args: {
    signOutText: 'Sign Out',
    currentMember: GuestFactory({
      itemLoginSchema: ItemLoginSchemaFactory({
        item: PackedFolderItemFactory(),
        type: ItemLoginSchemaType.Username,
      }),
    }),
    avatar: (
      <Avatar
        maxWidth={SMALL_AVATAR_SIZE}
        maxHeight={SMALL_AVATAR_SIZE}
        url={'https://picsum.photos/100'}
        alt={`profile image`}
        component={'avatar'}
        sx={{ mx: 1 }}
      />
    ),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    // open dialog
    const nameText = canvas.getByLabelText(args.currentMember!.name);
    await userEvent.click(nameText);

    const menuCanvas = within(screen.getByRole('menu'));

    // have 2 menu items - do not show profile button
    expect(menuCanvas.getAllByRole('menuitem')).toHaveLength(2);

    // sign out button
    const signOutButton = menuCanvas.getByText('Sign Out');
    expect(signOutButton).toBeInTheDocument();
  },
} satisfies Story;

export const SignedOut = {
  args: {
    avatar: (
      <Avatar
        maxWidth={SMALL_AVATAR_SIZE}
        maxHeight={SMALL_AVATAR_SIZE}
        url={'https://picsum.photos/100'}
        alt={`default profile image`}
        component={'avatar'}
        sx={{ mx: 1 }}
      />
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // open dialog
    const nameText = canvas.getByRole('button');
    await userEvent.click(nameText);

    // custom content
    const menuCanvas = within(screen.getByRole('menu'));
    const signInButton = menuCanvas.getByText('Sign In');
    expect(signInButton).toBeInTheDocument();
  },
} satisfies Story;
