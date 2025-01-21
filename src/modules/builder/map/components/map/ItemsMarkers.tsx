import { useEffect, useRef, useState } from 'react';
import { FeatureGroup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

import { Box, CircularProgress, Stack } from '@mui/material';

import { useQueryClientContext } from '../context/QueryClientContext';
import ItemMarker from './ItemMarker';

const ItemsMarkers = ({
  tags,
  bounds,
}: {
  tags: string[];
  bounds?: {
    lat1: number;
    lat2: number;
    lng1: number;
    lng2: number;
  };
}): JSX.Element | JSX.Element[] | undefined => {
  const groupRef = useRef<any>(null);
  const map = useMap();
  const { useItemsInMap, item } = useQueryClientContext();
  const { data: itemGeolocations, isFetching } = useItemsInMap({
    ...bounds,
    parentItemId: item?.id,
    keywords: tags,
  });
  const [prevState, setPrevState] = useState(itemGeolocations);

  useEffect(() => {
    if (!isFetching) {
      if (JSON.stringify(itemGeolocations) !== JSON.stringify(prevState)) {
        // on positive search, focus on items
        if (
          itemGeolocations?.length &&
          itemGeolocations.length !== prevState?.length &&
          tags.length
        ) {
          map.fitBounds(groupRef.current.getBounds());
        }

        // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
        setPrevState(itemGeolocations);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags, itemGeolocations, isFetching]);

  if (isFetching) {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 50,
          zIndex: 450,
        }}
      >
        <Stack justifyContent="center" alignItems="center" py={2} height="100%">
          <CircularProgress />
        </Stack>
      </Box>
    );
  }
  // color of clusters is defined by number of markers grouped together
  return (
    <FeatureGroup ref={groupRef}>
      <MarkerClusterGroup chunkedLoading showCoverageOnHover={false}>
        {itemGeolocations?.map((geoloc) => (
          <ItemMarker key={geoloc.id} geolocation={geoloc} />
        ))}
      </MarkerClusterGroup>
    </FeatureGroup>
  );
};

export default ItemsMarkers;
