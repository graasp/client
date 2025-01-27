import { type JSX, useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@mui/material';

import GoogleMapReact from 'google-map-react';
import useSupercluster from 'use-supercluster';

import { NS } from '@/config/constants';
import { GOOGLE_KEY } from '@/config/env';

import StyledAlert from '~analytics/common/StyledAlert';
import { DataContext } from '~analytics/context/DataProvider';

import ChartContainer from '../common/ChartContainer';
import ChartTitle from '../common/ChartTitle';
import {
  CLUSTER_RADIUS,
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
  DEFAULT_ZOOM,
  ENTER_KEY,
  MAX_CLUSTER_ZOOM,
} from '../constants';
import {
  filterActionsByUsers,
  mapActionsToGeoJsonFeatureObjects,
} from '../utils';

const Marker = ({ children }: { children: JSX.Element }) => children;
// type from "geojson" library
type BBox =
  | [number, number, number, number]
  | [number, number, number, number, number, number];
const ActionsMap = (): JSX.Element | null => {
  const theme = useTheme();
  const { t } = useTranslation(NS.Analytics);
  // TODO: replace with a better type, maybe by replacing the google map with leaflet
  const mapRef = useRef<any>(undefined);
  const [bounds, setBounds] = useState<BBox>();
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const { actions, selectedUsers } = useContext(DataContext);

  const actionsToChart = selectedUsers
    ? filterActionsByUsers(actions, selectedUsers)
    : actions;

  // GeoJSON Feature objects
  const points = mapActionsToGeoJsonFeatureObjects(actionsToChart);

  const { clusters } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: CLUSTER_RADIUS, maxZoom: MAX_CLUSTER_ZOOM },
  });

  const calculateClusterRadius = (
    clusterCount: number,
    totalCount: number,
    baseRadius: number,
    scalar: number,
  ) => baseRadius + (clusterCount / totalCount) * scalar;

  const handleClusterZoom = (longitude: number, latitude: number) => {
    if (!mapRef.current) {
      return;
    }

    mapRef.current.setZoom(mapRef.current.zoom + 1);
    mapRef.current.panTo({ lng: longitude, lat: latitude });
  };

  // no actions for that item
  if (!actionsToChart.length) {
    return null;
  }

  return (
    <>
      <ChartTitle title={t('ACTIONS_BY_LOCATION')} />
      {points.length !== actionsToChart.length && (
        <StyledAlert severity="warning">
          {t('ACTIONS_MIGHT_HAS_NO_GEOLOCATION')}
        </StyledAlert>
      )}
      {points.length > 0 && (
        <ChartContainer>
          <GoogleMapReact
            bootstrapURLKeys={{ key: GOOGLE_KEY }}
            defaultCenter={{ lat: DEFAULT_LATITUDE, lng: DEFAULT_LONGITUDE }}
            defaultZoom={DEFAULT_ZOOM}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map }) => {
              mapRef.current = map;
            }}
            onChange={(map) => {
              setZoom(map.zoom);
              setBounds([
                map.bounds.nw.lng,
                map.bounds.se.lat,
                map.bounds.se.lng,
                map.bounds.nw.lat,
              ]);
            }}
          >
            {clusters.map((cluster) => {
              const [longitude, latitude] = cluster.geometry.coordinates;
              const { cluster: isCluster, point_count: pointCount } =
                cluster.properties;
              if (isCluster) {
                return (
                  <Marker key={cluster.id}>
                    <div
                      style={{
                        color: '#fff',
                        background: theme.palette.primary.main,
                        borderRadius: '50%',
                        padding: 10,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        width: `${calculateClusterRadius(
                          pointCount,
                          points.length,
                          10,
                          20,
                        )}px`,
                        height: `${calculateClusterRadius(
                          pointCount,
                          points.length,
                          10,
                          20,
                        )}px`,
                      }}
                      onClick={() => handleClusterZoom(longitude, latitude)}
                      onKeyDown={(event) => {
                        if (event.key === ENTER_KEY) {
                          handleClusterZoom(longitude, latitude);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      {pointCount}
                    </div>
                  </Marker>
                );
              }
              return null;
            })}
          </GoogleMapReact>
        </ChartContainer>
      )}
    </>
  );
};

export default ActionsMap;
