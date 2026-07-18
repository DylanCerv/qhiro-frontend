import { useEffect } from 'react';
import { MapContainer, Polygon, TileLayer, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapTiles } from '../utils/geo';

const healthColors = {
  green: '#54e98a',
  yellow: '#f3cc54',
  red: '#ffaaa6',
};

function FitBounds({ parcels, center }) {
  const map = useMap();

  useEffect(() => {
    const points = parcels.flatMap((p) => p.coordinates ?? []);
    if (points.length >= 3) {
      map.fitBounds(
        L.latLngBounds(points.map((c) => [c.lat, c.lng])),
        { padding: [24, 24] },
      );
      return;
    }
    if (center) {
      map.setView([center.lat, center.lng], 13);
    }
  }, [map, parcels, center]);

  return null;
}

export default function ParcelMap({
  parcels = [],
  center,
  selectedParcelId,
  onSelectParcel,
  interactive = false,
  tileStyle = 'satellite',
}) {
  const mapCenter = center ?? parcels[0]?.coordinates?.[0] ?? { lat: -0.1807, lng: -78.4678 };
  const tiles = mapTiles[tileStyle] ?? mapTiles.satellite;

  return (
    <div className="map-wrap">
      <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={13} scrollWheelZoom={interactive}>
        <TileLayer attribution={tiles.attribution} url={tiles.url} />
        <FitBounds parcels={parcels} center={center ?? mapCenter} />
        {parcels.map((p) =>
          p.coordinates?.length ? (
            <Polygon
              key={p.parcelId}
              positions={p.coordinates.map((c) => [c.lat, c.lng])}
              pathOptions={{
                color:
                  p.parcelId === selectedParcelId
                    ? '#54e98a'
                    : healthColors[p.healthStatus] ?? '#54e98a',
                fillColor: healthColors[p.healthStatus] ?? '#54e98a',
                fillOpacity: p.parcelId === selectedParcelId ? 0.5 : 0.35,
                weight: p.parcelId === selectedParcelId ? 3 : 2,
              }}
              eventHandlers={
                onSelectParcel
                  ? {
                      click: () => onSelectParcel(p.parcelId),
                    }
                  : undefined
              }
            >
              <Tooltip>
                {p.name} — NDVI {p.ndvi?.toFixed(2)}
              </Tooltip>
            </Polygon>
          ) : null,
        )}
      </MapContainer>
    </div>
  );
}
