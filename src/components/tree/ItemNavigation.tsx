import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert } from '@mui/material';

import { isAxiosError } from 'axios';

import { useAuth } from '@/AuthContext.tsx';
import { NS } from '@/config/constants.ts';
import { hooks } from '@/config/queryClient';
import { MAIN_MENU_ID, TREE_VIEW_ID } from '@/config/selectors';
import MainMenu from '@/ui/MainMenu/MainMenu';

import { LoadingTree } from './LoadingTree';
import { TreeView } from './TreeView';
import { combineUuids, shuffleAllButLastItemInArray } from './shuffle';

const { useItem, useDescendants } = hooks;

const GRAASP_MENU_ITEMS = ['folder' as const, 'shortcut' as const];
const useNavigationItems = ({
  shuffle,
  rootId,
  showHidden,
}: {
  rootId: string;
  shuffle?: boolean;
  showHidden?: boolean;
}) => {
  const { user } = useAuth();
  const userId = user?.id ?? '';

  const { data: descendants, isLoading: isLoadingTree } = useDescendants({
    id: rootId ?? '',
    types: GRAASP_MENU_ITEMS,
    showHidden,
  });

  const {
    data: rootItem,
    isLoading: isItemLoading,
    isError,
    error,
  } = useItem(rootId);

  // shuffle descendants if enabled
  let shuffledDescendants = [...(descendants || [])];
  if (shuffle) {
    const baseId = rootId ?? '';

    const combinedUuids = combineUuids(baseId, userId);
    shuffledDescendants = shuffleAllButLastItemInArray(
      shuffledDescendants,
      combinedUuids,
    );
  }

  // ignore shortcuts that are part of the descendants
  const filteredDescendants = shuffledDescendants.filter((item) => {
    if (item.type !== 'shortcut') {
      return true;
    }
    return !shuffledDescendants.some(
      (d) => d.id === item.extra.shortcut.target,
    );
  });

  return {
    descendants: filteredDescendants,
    rootItem,
    isLoading: isLoadingTree || isItemLoading,
    isError,
    error,
  };
};

export const ItemNavigation = ({
  rootId,
  itemId,
  shuffle = false,
  showHidden = false,
  handleNavigationOnClick,
}: {
  rootId: string;
  itemId: string;
  shuffle?: boolean;
  showHidden?: boolean;
  handleNavigationOnClick: (newItemId: string) => void;
}): JSX.Element | null => {
  const { t } = useTranslation(NS.Common);

  const { rootItem, isLoading, descendants, isError, error } =
    useNavigationItems({
      shuffle,
      rootId,
      showHidden,
    });

  if (rootItem && descendants) {
    return (
      <MainMenu id={MAIN_MENU_ID}>
        <TreeView
          key={rootId}
          id={TREE_VIEW_ID}
          rootItems={[rootItem]}
          items={[rootItem, ...descendants]}
          onTreeItemSelect={handleNavigationOnClick}
          itemId={itemId}
        />
      </MainMenu>
    );
  }

  if (isLoading) {
    return <LoadingTree />;
  }

  if (isError) {
    // this is an expected error that can occur if user does not have access to the item
    if (isAxiosError(error) && error.response?.status === 403) {
      return null;
    }
    return <Alert severity="error">{t('ERRORS.UNEXPECTED')}</Alert>;
  }

  return null;
};
