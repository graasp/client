import { Skeleton } from '@mui/material';

import { ItemGeolocation } from '@graasp/sdk';

import { useMapTranslation } from '../../config/i18n';
import { useQueryClientContext } from '../context/QueryClientContext';
import AddItemButton from './AddItemButton';

const CurrentMarkerPopupContent = ({
  point,
  open,
}: {
  open: boolean;
  point: Pick<ItemGeolocation, 'lat' | 'lng'>;
}): JSX.Element => {
  const { t } = useMapTranslation();
  const { useAddressFromGeolocation, currentMember } = useQueryClientContext();
  const { data: address, isLoading } = useAddressFromGeolocation(point, {
    enabled: Boolean(currentMember) && open,
  });

  const renderAddress = () => {
    if (address?.addressLabel) {
      return address?.addressLabel;
    }

    if (isLoading) {
      return <Skeleton />;
    }

    return t('This location does not match a specific address.');
  };

  return (
    <div style={{ minWidth: 300 }}>
      {renderAddress()}
      <br />
      <AddItemButton
        location={{
          ...point,
          addressLabel: address?.addressLabel,
          country: address?.country,
        }}
      />
    </div>
  );
};

export default CurrentMarkerPopupContent;
