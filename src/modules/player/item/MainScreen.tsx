import { type JSX, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Skeleton } from '@mui/material';

import { ActionTriggers } from '@graasp/sdk';

import { getRouteApi } from '@tanstack/react-router';

import { NS } from '@/config/constants';
import { hooks, mutations } from '@/config/queryClient';

import { LayoutContextProvider } from '~player/contexts/LayoutContext';
import SideContent from '~player/rightPanel/SideContent';

import Item from './Item';

const MainScreen = (): JSX.Element | null => {
  const { itemId } = getRouteApi('/player/$rootId/$itemId').useParams();
  const { data: item, isLoading, isError } = hooks.useItem(itemId);
  const { t } = useTranslation(NS.Player);
  const { mutate: triggerAction } = mutations.usePostItemAction();

  const content = <Item id={itemId} />;

  useEffect(() => {
    if (itemId && item) {
      triggerAction({
        itemId,
        payload: { type: ActionTriggers.ItemView },
      });
    }
  }, [itemId, item, triggerAction]);

  if (item) {
    return (
      <LayoutContextProvider>
        <SideContent item={item} content={content} />
      </LayoutContextProvider>
    );
  }

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" />;
  }

  if (isError) {
    return <Alert severity="error">{t('ERROR_FETCHING_ITEM')}</Alert>;
  }

  return null;
};

export default MainScreen;
