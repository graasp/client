import { useState } from 'react';

import { PermissionLevel, PermissionLevelCompare } from '@graasp/sdk';

import { useQueryClientContext } from '../context/QueryClientContext';
import TopBar from '../topbar/TopBar';
import CurrentLocationMarker from './CurrentLocationMarker';
import CurrentMarker from './CurrentMarker';
import ItemsMarkers from './ItemsMarkers';
import MapEvents from './MapEvents';

const MapContent = ({
  currentPosition,
}: {
  currentPosition?: { lat: number; lng: number };
}): JSX.Element => {
  const { item } = useQueryClientContext();
  const [bounds, setBounds] = useState<{
    lat1: number;
    lat2: number;
    lng1: number;
    lng2: number;
  }>();
  const [tags, setTags] = useState<string[]>([]);

  const onChangeTags = (newTags: string[]) => {
    setTags(newTags);
  };

  // can write in root or with right permission in item
  const canWrite =
    !item ||
    (item.permission &&
      PermissionLevelCompare.gte(item.permission, PermissionLevel.Write));

  return (
    <>
      <MapEvents setBounds={setBounds} />
      <TopBar tags={tags} onChange={onChangeTags} />
      <ItemsMarkers tags={tags} bounds={bounds} />
      <CurrentLocationMarker position={currentPosition} />
      {canWrite && <CurrentMarker />}
    </>
  );
};

export default MapContent;
