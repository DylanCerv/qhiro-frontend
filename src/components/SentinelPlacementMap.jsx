import { useEffect } from 'react';
import { MapContainer, Marker, Polygon, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { findParcelAtPoint, formatCoordinates, mapTiles } from '../utils/geo';
import SentinelMapMarkers from './SentinelMapMarkers';

const healthColors = {
  green: '#54e98a',
  yellow: '#f3cc54',
  red: '#ffaaa6',
};

function createDraftIcon(label) {
  return L.divIcon({
    className: 'sentinel-map-marker sentinel-map-marker--draft',
    html: `<span>${label}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function FitParcels({ parcels = [], sentinels = [], draftPoints = [], draftPoint }) {
  const map = useMap();

  useEffect(() => {
    const points = [
      ...parcels.flatMap((parcel) => parcel.coordinates ?? []),
      ...sentinels.map((sentinel) => sentinel.coordinates).filter(Boolean),
      ...draftPoints.map((draft) => draft.coordinates).filter(Boolean),
      ...(draftPoint ? [draftPoint] : []),
    ];

    if (points.length >= 3) {
      map.fitBounds(
        L.latLngBounds(points.map((point) => [point.lat, point.lng])),
        { padding: [28, 28] },
      );
      return;
    }

    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 16);
    }
  }, [map, parcels, sentinels, draftPoints, draftPoint]);

  return null;
}

function PlacementClickHandler({ parcels, onSelectPoint }) {
  useMapEvents({
    click(event) {
      if (!onSelectPoint) return;
      const point = { lat: event.latlng.lat, lng: event.latlng.lng };
      const parcel = findParcelAtPoint(point, parcels);
      if (!parcel) return;
      onSelectPoint(point, parcel);
    },
  });
  return null;
}

export default function SentinelPlacementMap({
  parcels = [],
  sentinels = [],
  selectedPoint,
  draftPoints = [],
  selectedParcelId,
  onSelectPoint,
  multiMode = false,
}) {
  const mapParcels = parcels.filter((parcel) => parcel.coordinates?.length);
  if (!mapParcels.length) {
    return <p className="map-meta">Crea al menos una parcela con coordenadas para instalar centinelas.</p>;
  }

  const mapCenter = mapParcels[0].coordinates[0];
  const tiles = mapTiles.satellite;
  const visibleSentinels = sentinels.filter(
    (sentinel) => sentinel.coordinates?.lat != null && sentinel.coordinates?.lng != null,
  );

  return (
    <div className="map-wrap sentinel-placement-map">
      <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={15} scrollWheelZoom>
        <TileLayer attribution={tiles.attribution} url={tiles.url} />
        <FitParcels
          parcels={mapParcels}
          sentinels={visibleSentinels}
          draftPoints={draftPoints}
          draftPoint={selectedPoint}
        />
        <PlacementClickHandler parcels={mapParcels} onSelectPoint={onSelectPoint} />

        {mapParcels.map((parcel) => (
          <Polygon
            key={parcel.parcelId}
            positions={parcel.coordinates.map((point) => [point.lat, point.lng])}
            pathOptions={{
              color: parcel.parcelId === selectedParcelId ? '#ffffff' : healthColors[parcel.healthStatus] ?? '#54e98a',
              fillColor: healthColors[parcel.healthStatus] ?? '#54e98a',
              fillOpacity: parcel.parcelId === selectedParcelId ? 0.34 : 0.16,
              weight: parcel.parcelId === selectedParcelId ? 3 : 2,
            }}
          >
            <Tooltip sticky>{parcel.name}</Tooltip>
          </Polygon>
        ))}

        <SentinelMapMarkers sentinels={visibleSentinels} />

        {draftPoints.map((draft) => (
          <Marker
            key={draft.id}
            position={[draft.coordinates.lat, draft.coordinates.lng]}
            icon={createDraftIcon(draft.sentinelLabel)}
          >
            <Tooltip sticky>
              {draft.sentinelLabel}
              {' · '}
              {formatCoordinates(draft.coordinates)}
            </Tooltip>
          </Marker>
        ))}

        {selectedPoint && !multiMode && (
          <Marker position={[selectedPoint.lat, selectedPoint.lng]} icon={createDraftIcon('+')}>
            <Tooltip sticky>Nueva ubicación · {formatCoordinates(selectedPoint)}</Tooltip>
          </Marker>
        )}
      </MapContainer>

      <p className="map-meta sentinel-placement-hint">
        {multiMode
          ? 'Haz clic en el mapa para añadir varios centinelas. Cada uno recibe etiqueta automática (c1, c2, c3...).'
          : 'Haz clic dentro de una parcela para instalar el centinela. La parcela se detecta automáticamente.'}
        {selectedPoint && !multiMode ? ` · ${formatCoordinates(selectedPoint)}` : ''}
      </p>
    </div>
  );
}
