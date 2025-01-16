import { Marker, Popup } from 'react-leaflet';

import { useMapTranslation } from '../../config/i18n';
import { currentLocationMarker } from '../icons/icons';

const CurrentLocationMarker = ({
  position,
}: {
  position?: { lat: number; lng: number };
}): JSX.Element | null => {
  const { t } = useMapTranslation();

  if (!position) {
    return null;
  }

  return (
    <Marker icon={currentLocationMarker} position={position}>
      <Popup autoPan={false}>{t('My Location')}</Popup>
    </Marker>
  );
};

export default CurrentLocationMarker;
