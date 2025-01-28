import { type JSX, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

import { Alert } from '@mui/material';

import { ErrorBoundary } from '@sentry/react';
import { LatLngTuple, type Map } from 'leaflet';
import 'leaflet-easybutton/src/easy-button.css';
import 'leaflet-geosearch/assets/css/leaflet.css';
import 'leaflet/dist/leaflet.css';

import { Country } from '../types';
import { GeolocationPickerProps } from './GeolocationPicker/GeolocationPicker';
import LoggedOutWarning from './common/LoggedOutWarning';
import {
  QueryClientContextInterface,
  QueryClientContextProvider,
} from './context/QueryClientContext';
import { CountryContent } from './map/CountryContent';
import MapContent from './map/MapContent';
import TopBar from './topbar/TopBar';

type Props = QueryClientContextInterface;

export function MapComponent({
  item,
  currentMember,
  useAddressFromGeolocation,
  useItemsInMap,
  useSuggestionsForAddress,
  useRecycleItems,
  usePostItem,
  viewItem,
  useDeleteItemGeolocation,
  handleAddOnClick,
  currentPosition,
  viewItemInBuilder,
}: Readonly<Props>): JSX.Element {
  const [mapRef, setMapRef] = useState<Map | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const onChangeTags = (newTags: string[]) => {
    setTags(newTags);
  };
  const onCountrySelection = (newValue: Country) => {
    if (mapRef) {
      mapRef.fitBounds([newValue.minBoundary, newValue.maxBoundary]);
    }
  };
  const onChangeOption: GeolocationPickerProps['onChangeOption'] = ({
    lat,
    lng,
  }) => {
    if (mapRef) {
      mapRef.flyTo({ lat, lng }, 10);
    }
  };

  const { data: itemGeolocations } = useItemsInMap({
    parentItemId: item?.id,
  });

  useEffect(() => {
    if (item) {
      const map = mapRef;
      if (map) {
        // center on all visible points
        if (itemGeolocations?.length) {
          const c: LatLngTuple[] = itemGeolocations.map((g) => [g.lat, g.lng]);
          if (c.length) {
            map.fitBounds(c);
          }
        }
        // center on current position of user
        else if (currentPosition) {
          map.setZoom(11);
          map.flyTo([currentPosition.lat, currentPosition.lng]);
        }
      }
    }
  }, [itemGeolocations, item, currentPosition, mapRef]);

  const immutableMap = useMemo(
    () => (
      <MapContainer
        // default to Switzerland
        center={[47, 8]}
        zoom={4}
        dragging={false}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
        ref={setMapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapContent tags={tags} currentPosition={currentPosition} />
      </MapContainer>
    ),
    [currentPosition, tags],
  );

  return (
    <QueryClientContextProvider
      currentMember={currentMember}
      currentPosition={currentPosition}
      handleAddOnClick={handleAddOnClick}
      item={item}
      useAddressFromGeolocation={useAddressFromGeolocation}
      useDeleteItemGeolocation={useDeleteItemGeolocation}
      useItemsInMap={useItemsInMap}
      usePostItem={usePostItem}
      useRecycleItems={useRecycleItems}
      useSuggestionsForAddress={useSuggestionsForAddress}
      viewItem={viewItem}
      viewItemInBuilder={viewItemInBuilder}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <ErrorBoundary fallback={<ErrorFallback />}>
          <LoggedOutWarning />
          {!currentPosition && (
            <CountryContent onCountrySelection={onCountrySelection} />
          )}
          <TopBar
            tags={tags}
            onChange={onChangeTags}
            onChangeOption={onChangeOption}
          />

          {immutableMap}
        </ErrorBoundary>
      </div>
    </QueryClientContextProvider>
  );
}

function ErrorFallback() {
  return (
    <Alert severity="warning">
      We are having issues showing you the map. Please try again later. If this
      issue persist, please let us know and we will get back to you.
    </Alert>
  );
}
