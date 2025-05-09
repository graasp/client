import { type JSX, useState } from 'react';

import { Skeleton, Stack, Typography } from '@mui/material';

import { type DiscriminatedItem, ItemGeolocation } from '@graasp/sdk';

import { hooks, mutations } from '@/config/queryClient';
import { buildMapViewId } from '@/config/selectors';
import {
  useAddressFromGeolocation,
  useItemsInMap,
  useSuggestionsForAddress,
} from '@/query/hooks/itemGeolocation';
import { useMobileView } from '@/ui/hooks/useMobileView';

import { MapComponent } from '~builder/map/components/Map';

import NewItemModal from '../main/NewItemModal';
import { useCurrentLocation } from '../map/useCurrentLocation';

type Props = {
  viewItem: (item: DiscriminatedItem) => void;
  viewItemInBuilder: (item: DiscriminatedItem) => void;
  enableGeolocation?: boolean;
  parentId?: DiscriminatedItem['id'];
  title?: string;
  height?: string;
};

const MapView = ({
  parentId,
  title,
  height = '100vh',
  viewItem,
  viewItemInBuilder,
  enableGeolocation = true,
}: Props): JSX.Element => {
  const { data: currentMember } = hooks.useCurrentMember();
  const { isMobile } = useMobileView();
  const [geolocation, setGeolocation] =
    useState<Pick<ItemGeolocation, 'lat' | 'lng'>>();
  const [open, setOpen] = useState(false);
  const { data: parent, isLoading: isLoadingParent } = hooks.useItem(parentId);
  const { hasFetchedCurrentLocation, currentPosition } =
    useCurrentLocation(enableGeolocation);

  const handleAddOnClick = (args: {
    location: Pick<ItemGeolocation, 'lat' | 'lng'>;
  }) => {
    setGeolocation(args.location);
    setOpen(true);
  };

  const handleClose = () => {
    setGeolocation(undefined);
    setOpen(false);
  };

  return (
    <>
      <Stack height={height}>
        <Stack>
          {title && (
            <Typography variant="h4" sx={{ wordWrap: 'break-word' }}>
              {title}
            </Typography>
          )}
        </Stack>
        <Stack flex={1}>
          <div
            id={buildMapViewId(parentId)}
            style={{ width: '100%', height: '100%' }}
          >
            {(parentId && isLoadingParent) ||
            (enableGeolocation && !hasFetchedCurrentLocation) ? (
              <Skeleton width="100%" height="100%" />
            ) : (
              <MapComponent
                currentPosition={currentPosition}
                useDeleteItemGeolocation={mutations.useDeleteItemGeolocation}
                usePostItem={mutations.usePostItem}
                useRecycleItems={mutations.useRecycleItems}
                viewItem={viewItem}
                viewItemInBuilder={viewItemInBuilder}
                currentMember={currentMember}
                item={parent}
                // use builder modal to add new item if the screen is big enough
                // todo: always use builder modal when it is responsive
                handleAddOnClick={isMobile ? undefined : handleAddOnClick}
                useAddressFromGeolocation={useAddressFromGeolocation}
                useItemsInMap={useItemsInMap}
                useSuggestionsForAddress={useSuggestionsForAddress}
              />
            )}
          </div>
        </Stack>
      </Stack>
      {!isMobile && (
        <NewItemModal
          open={open}
          handleClose={handleClose}
          geolocation={
            geolocation
              ? { lat: geolocation.lat, lng: geolocation.lng }
              : undefined
          }
        />
      )}
    </>
  );
};

export default MapView;
