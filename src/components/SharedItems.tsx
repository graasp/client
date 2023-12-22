import { Alert } from '@mui/material';
import Box from '@mui/material/Box';

import { Loader } from '@graasp/ui';

import { BUILDER } from '@/langs/constants';

import { useBuilderTranslation } from '../config/i18n';
import { hooks } from '../config/queryClient';
import {
  SHARED_ITEMS_ERROR_ALERT_ID,
  SHARED_ITEMS_ID,
} from '../config/selectors';
import ErrorAlert from './common/ErrorAlert';
import ItemHeader from './item/header/ItemHeader';
import Items from './main/Items';
import Main from './main/Main';

const SharedItemsLoadableContent = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: sharedItems, isLoading, isError } = hooks.useSharedItems();
  if (isError) {
    return <ErrorAlert id={SHARED_ITEMS_ERROR_ALERT_ID} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box mx={2}>
      <Alert severity="warning" sx={{ mt: 3 }}>
        {translateBuilder(
          "You can also find the items of this page in ''My Graasp''. This page will be unavailable soon.",
        )}
      </Alert>
      <ItemHeader showNavigation={false} />
      <Items
        id={SHARED_ITEMS_ID}
        title={translateBuilder(BUILDER.SHARED_ITEMS_TITLE)}
        items={sharedItems}
        canMove={false}
        totalCount={sharedItems?.length}
      />
    </Box>
  );
};

const SharedItems = (): JSX.Element => (
  <Main>
    <SharedItemsLoadableContent />
  </Main>
);

export default SharedItems;
