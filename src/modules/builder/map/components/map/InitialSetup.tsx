import { Dispatch, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';

import { useQueryClientContext } from '../context/QueryClientContext';

const InitialSetup = ({
  showMap,
  setShowMap,
  currentPosition,
}: {
  showMap: boolean;
  setShowMap: Dispatch<boolean>;
  currentPosition?: { lat: number; lng: number };
}): null => {
  const { useItemsInMap, item } = useQueryClientContext();
  const [isInitial, setIsInitial] = useState(true);
  const map = useMap();

  // central point
  const { data: itemGeolocations } = useItemsInMap({
    parentItemId: item?.id,
  });

  useEffect(() => {
    if (showMap || !isInitial) {
      return;
    }
    if (isInitial) {
      // center on all visible points
      if (itemGeolocations?.length) {
        const c = itemGeolocations.map((g) => [g.lat, g.lng]);
        if (c.length) {
          map.fitBounds(c as any);
        }
        setShowMap(true);
        // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
        setIsInitial(false);
      }
      // center on current position of user
      else if (currentPosition) {
        map.setZoom(11);
        map.flyTo([currentPosition.lat, currentPosition.lng] as any);
        setShowMap(true);
        // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
        setIsInitial(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemGeolocations]);

  return null;
};

export default InitialSetup;
