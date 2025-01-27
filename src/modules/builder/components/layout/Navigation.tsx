import type { JSX } from 'react';

import { IconButton } from '@mui/material';

import { AccountType } from '@graasp/sdk';

import { Link, useParams } from '@tanstack/react-router';
import { Home } from 'lucide-react';

import { hooks } from '@/config/queryClient';
import {
  NAVIGATION_HOME_ID,
  NAVIGATION_ROOT_ID,
  buildNavigationLink,
} from '@/config/selectors';
import { Navigation } from '@/ui/Navigation/Navigation';

const { useItem, useParents, useCurrentMember, useChildren } = hooks;

const Navigator = (): JSX.Element | null => {
  const { itemId } = useParams({ strict: false });
  const { data: currentMember } = useCurrentMember();
  const { data: item, isLoading: isItemLoading } = useItem(itemId);

  const { data: parents, isLoading: areParentsLoading } = useParents({
    id: itemId,
  });

  if (isItemLoading || areParentsLoading) {
    return null;
  }

  const renderRoot = () => {
    // no access to root if signed out
    if (currentMember?.type !== AccountType.Individual) {
      return null;
    }

    return (
      <Link to="/builder" search={(prev) => ({ ...prev })}>
        <IconButton id={NAVIGATION_HOME_ID}>
          <Home />
        </IconButton>
      </Link>
    );
  };

  return (
    <Navigation
      id={NAVIGATION_ROOT_ID}
      item={item}
      itemPath={`/builder/items/$itemId`}
      parents={parents}
      renderRoot={renderRoot}
      buildMenuItemId={buildNavigationLink}
      useChildren={useChildren}
    />
  );
};

export default Navigator;
