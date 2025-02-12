import { AccountType } from '@graasp/sdk';

import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, screen, userEvent, within } from '@storybook/test';

import { SMALL_AVATAR_SIZE } from '@/ui/constants.js';

import Avatar from './Avatar/Avatar.js';
import { UserPopupMenu } from './UserPopupMenu.js';

const meta = {
  component: UserPopupMenu,
  argTypes: {
    signOut: { action: 'signOut' },
  },
  args: {
    signOut: fn(),
  },
} satisfies Meta<typeof UserPopupMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

const CURRENT_MEMBER = {
  id: 'some-id',
  name: 'bob',
  lang: 'en',
  type: AccountType.Individual,
};

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
    const member = currentMember;

    // open dialog
    const nameText = canvas.getByLabelText(member.name);
    await userEvent.click(nameText);

    const menuCanvas = within(screen.getByRole('menu'));

    // profile and settings buttons
    expect(menuCanvas.getByText('Profile')).toBeInTheDocument();
    expect(menuCanvas.getByText('Settings')).toBeInTheDocument();

    // sign out button
    const signOutButton = menuCanvas.getByText('Sign Out');
    expect(signOutButton).toBeInTheDocument();
  },
} satisfies Story;

export const Guest = {
  args: {
    signOutText: 'Sign Out',
    currentMember: { ...CURRENT_MEMBER, type: AccountType.Guest },
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
    const nameText = canvas.getByLabelText(args.currentMember.name);
    await userEvent.click(nameText);

    const menuCanvas = within(screen.getByRole('menu'));

    // have 2 menu items - do not show profile button
    expect(menuCanvas.getAllByRole('menuitem')).toHaveLength(2);

    // sign out button
    const signOutButton = menuCanvas.getByText('Sign Out');
    expect(signOutButton).toBeInTheDocument();
  },
} satisfies Story;
