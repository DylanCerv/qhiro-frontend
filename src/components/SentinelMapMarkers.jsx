import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { getSentinelDisplayLabel } from '../utils/sentinel';

function createSentinelIcon(label, status = 'online', actionStatus) {
  const actionClass = actionStatus === 'completed'
    ? 'sentinel-map-marker--executed'
    : actionStatus === 'pending'
      ? 'sentinel-map-marker--pending-action'
      : '';
  const statusClass = status === 'online'
    ? 'sentinel-map-marker--online'
    : status === 'lowBattery'
      ? 'sentinel-map-marker--low'
      : 'sentinel-map-marker--offline';

  return L.divIcon({
    className: `sentinel-map-marker ${statusClass} ${actionClass}`.trim(),
    html: `<span>${label}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

export default function SentinelMapMarkers({ sentinels = [] }) {
  return sentinels.map((sentinel) => {
    const label = getSentinelDisplayLabel(sentinel);
    return (
      <Marker
        key={sentinel.deviceId}
        position={[sentinel.coordinates.lat, sentinel.coordinates.lng]}
        icon={createSentinelIcon(label, sentinel.status, sentinel.actionStatus)}
      >
        <Tooltip sticky>
          Centinela {label}
          {sentinel.name ? ` · ${sentinel.name}` : ''}
          {sentinel.actionStatus === 'completed' ? ' · Acción ejecutada' : ''}
          {sentinel.actionStatus === 'pending' ? ' · Acción pendiente' : ''}
        </Tooltip>
      </Marker>
    );
  });
}
