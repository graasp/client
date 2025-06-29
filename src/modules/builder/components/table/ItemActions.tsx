import type { JSX } from 'react';

import { Stack } from '@mui/material';

import { AccountType, DiscriminatedItem } from '@graasp/sdk';

import { hooks } from '@/config/queryClient';

import BookmarkButton from '../common/BookmarkButton';

type Props = {
  data: DiscriminatedItem;
};

// items and memberships match by index
const ItemActions = ({ data: item }: Props): JSX.Element => {
  const { data: currentMember } = hooks.useCurrentMember();

  return (
    <Stack direction="row" justifyContent="center" alignItems="center">
      {currentMember?.type === AccountType.Individual && (
        <BookmarkButton size="medium" key="bookmark" item={item} />
      )}
    </Stack>
  );
};

export default ItemActions;
