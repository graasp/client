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
    buttonId: 'popup-button',
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

    // open dialog
    await userEvent.click(canvas.getByRole('button'));

    const menuCanvas = within(screen.getByRole('menu'));

    // profile and settings buttons
    expect(menuCanvas.getByText('Profile')).toBeInTheDocument();
    expect(menuCanvas.getByText('Settings')).toBeInTheDocument();

    // sign out button
    expect(menuCanvas.getByText(args.signOutText)).toBeInTheDocument();
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
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // open dialog
    await userEvent.click(canvas.getByRole('button'));

    const menuCanvas = within(screen.getByRole('menu'));

    // only has the signout menu item
    expect(menuCanvas.getAllByRole('menuitem')).toHaveLength(1);

    // sign out button
    expect(menuCanvas.getByText(args.signOutText)).toBeInTheDocument();
  },
} satisfies Story;
