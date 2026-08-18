import { useEffect } from 'react';
import { Circle, MapContainer, Marker, Polygon, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapTiles } from '../utils/geo';
import SentinelMapMarkers from './SentinelMapMarkers';

const healthColors = {
  green: '#54e98a',
  yellow: '#f3cc54',
  red: '#ffaaa6',
};

const zoneColors = {
  scan: '#92ccff',
  selected: '#ffffff',
  pending: '#f3cc54',
  completed: '#54e98a',
  rejected: '#ffaaa6',
};

const selectedIcon = L.divIcon({
  className: 'mission-selected-marker',
  html: '<span></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function FitBounds({ parcels, extraPoints = [], sentinels = [] }) {
  const map = useMap();

  useEffect(() => {
    const points = [
      ...parcels.flatMap((parcel) => parcel.coordinates ?? []),
      ...extraPoints,
      ...sentinels.map((sentinel) => sentinel.coordinates).filter(Boolean),
    ];
    if (points.length >= 3) {
      map.fitBounds(
        L.latLngBounds(points.map((point) => [point.lat, point.lng])),
        { padding: [40, 40] },
      );
      return;
    }
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 15);
    }
  }, [map, parcels, extraPoints, sentinels]);

  return null;
}

function MapClickHandler({ onMapClick, interactive }) {
  useMapEvents({
    click(event) {
      if (!interactive || !onMapClick) return;
      onMapClick({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });
  return null;
}

export default function MissionParcelMap({
  parcels = [],
  selectedParcelId,
  selectedPoint,
  missionMarkers = [],
  actionZones = [],
  sentinels = [],
  onMapClick,
  interactive = true,
  tileStyle = 'satellite',
}) {
  const mapCenter = parcels[0]?.coordinates?.[0] ?? { lat: -0.1807, lng: -78.4678 };
  const tiles = mapTiles[tileStyle] ?? mapTiles.satellite;
  const extraPoints = [
    ...(selectedPoint ? [selectedPoint] : []),
    ...missionMarkers.map((marker) => marker.point).filter(Boolean),
  ];

  return (
    <div className={`map-wrap mission-map ${interactive ? 'mission-map--interactive' : ''}`}>
      <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={14} scrollWheelZoom={interactive}>
        <TileLayer attribution={tiles.attribution} url={tiles.url} />
        <FitBounds parcels={parcels} extraPoints={extraPoints} sentinels={sentinels} />
        <MapClickHandler onMapClick={onMapClick} interactive={interactive} />

        {parcels.map((parcel) =>
          parcel.coordinates?.length ? (
            <Polygon
              key={parcel.parcelId}
              positions={parcel.coordinates.map((point) => [point.lat, point.lng])}
              pathOptions={{
                color: parcel.parcelId === selectedParcelId ? '#ffffff' : healthColors[parcel.healthStatus] ?? '#54e98a',
                fillColor: healthColors[parcel.healthStatus] ?? '#54e98a',
                fillOpacity: parcel.parcelId === selectedParcelId ? 0.38 : 0.22,
                weight: parcel.parcelId === selectedParcelId ? 3 : 2,
              }}
            >
              <Tooltip sticky>
                {parcel.name} · NDVI {parcel.ndvi?.toFixed(2) ?? '—'}
              </Tooltip>
            </Polygon>
          ) : null,
        )}

        {missionMarkers.map((marker) => (
          <Circle
            key={marker.id}
            center={[marker.point.lat, marker.point.lng]}
            radius={marker.radius ?? 22}
            pathOptions={{
              color: zoneColors[marker.status] ?? zoneColors.scan,
              fillColor: zoneColors[marker.status] ?? zoneColors.scan,
              fillOpacity: marker.status === 'completed' ? 0.7 : 0.45,
              weight: 2,
            }}
          >
            <Tooltip>{marker.label}</Tooltip>
          </Circle>
        ))}

        <SentinelMapMarkers sentinels={sentinels} />

        {selectedPoint && (
          <Marker position={[selectedPoint.lat, selectedPoint.lng]} icon={selectedIcon}>
            <Tooltip sticky>Punto seleccionado</Tooltip>
          </Marker>
        )}

        {actionZones.map((zone) =>
          (zone.coordinates ?? []).map((point, index) => (
            <Circle
              key={`${zone.id}-${index}`}
              center={[point.lat, point.lng]}
              radius={zone.radius ?? 35}
              pathOptions={{
                color: zoneColors[zone.status] ?? zoneColors.pending,
                fillColor: zoneColors[zone.status] ?? zoneColors.pending,
                fillOpacity: zone.status === 'completed' ? 0.55 : 0.35,
                weight: 2,
                dashArray: zone.status === 'pending' ? '4 4' : undefined,
              }}
            >
              <Tooltip>
                {zone.label}
                {zone.status === 'completed' ? ' · Ejecutada' : ' · Pendiente'}
              </Tooltip>
            </Circle>
          )),
        )}
      </MapContainer>

      {interactive && (
        <div className="mission-map-hint">
          Haz clic en el mapa para seleccionar el punto de captura del dron
        </div>
      )}

      <div className="mission-map-legend">
        <span className="mission-legend-item">
          <i style={{ background: zoneColors.scan }} /> Captura
        </span>
        <span className="mission-legend-item">
          <i style={{ background: zoneColors.pending }} /> Acción pendiente
        </span>
        <span className="mission-legend-item">
          <i style={{ background: zoneColors.completed }} /> Acción ejecutada
        </span>
        <span className="mission-legend-item">
          <i className="mission-legend-dot-sentinel" /> Centinela
        </span>
      </div>
    </div>
  );
}
