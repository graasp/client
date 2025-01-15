import { useTranslation } from 'react-i18next';

import { Alert, Stack } from '@mui/material';

import { useParams } from '@tanstack/react-router';

import { NS } from '@/config/constants';
import { ITEM_HEADER_ID } from '@/config/selectors';

import Navigation from '../../layout/Navigation';
import ItemHeaderActions from './ItemHeaderActions';

type Props = {
  showNavigation?: boolean;
};

const ItemHeader = ({ showNavigation = true }: Props): JSX.Element | null => {
  const { itemId } = useParams({ strict: false });
  const { t: translateBuilder } = useTranslation(NS.Builder);
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mb={1}
      id={ITEM_HEADER_ID}
    >
      {/* display empty div to render actions on the right */}
      {showNavigation ? <Navigation /> : <div />}
      {itemId ? (
        <ItemHeaderActions itemId={itemId} />
      ) : (
        <Alert severity="error">{translateBuilder('ERROR_MESSAGE')}</Alert>
      )}
    </Stack>
  );
};

export default ItemHeader;
