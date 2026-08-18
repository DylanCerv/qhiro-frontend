import StatusBadge from './StatusBadge';
import SentinelPlacementMap from './SentinelPlacementMap';
import { formatCoordinates } from '../utils/geo';
import { formatDate, getDeviceStatusLabel, getDeviceTypeLabel, ui } from '../i18n/es';
import { getSentinelDisplayLabel } from '../utils/sentinel';

const deviceVisuals = {
  drone: { icon: 'flight_takeoff', accent: '#92ccff' },
  nest: { icon: 'hub', accent: '#c084fc' },
  sentinel: { icon: 'cell_tower', accent: '#f3cc54' },
  sensor: { icon: 'sensors', accent: '#8b8f98' },
};

export default function DeviceDetailsPanel({
  device,
  parcelName,
  parcels,
  onEdit,
  onClose,
}) {
  const visual = deviceVisuals[device.type] ?? deviceVisuals.sensor;
  const showBattery = device.type !== 'nest';

  return (
    <div className="device-details-panel">
      <div className="device-details-hero">
        <div
          className="device-details-icon"
          style={{ '--device-accent': visual.accent }}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            {visual.icon}
          </span>
          {device.type === 'sentinel' && (
            <span className="device-map-label">{getSentinelDisplayLabel(device)}</span>
          )}
        </div>
        <div>
          <p className="device-details-type">{getDeviceTypeLabel(device.type)}</p>
          <h3 className="device-details-name">{device.name}</h3>
          <StatusBadge status={device.status} label={getDeviceStatusLabel(device.status)} />
        </div>
      </div>

      <dl className="device-details-list">
        <div>
          <dt>{ui.devices.lastSeen}</dt>
          <dd>{formatDate(device.lastSeenAt)}</dd>
        </div>

        {showBattery && (
          <div>
            <dt>{ui.devices.battery}</dt>
            <dd>
              <div className="device-details-battery">
                <div className="battery-bar">
                  <div className="battery-fill" style={{ width: `${device.batteryLevel}%` }} />
                </div>
                <span>{device.batteryLevel}%</span>
              </div>
            </dd>
          </div>
        )}

        {device.type === 'sentinel' && (
          <>
            <div>
              <dt>Etiqueta en mapa</dt>
              <dd>{getSentinelDisplayLabel(device)}</dd>
            </div>
            <div>
              <dt>Parcela</dt>
              <dd>{device.parcelId ? parcelName : 'Sin detectar'}</dd>
            </div>
            <div>
              <dt>Ubicación</dt>
              <dd>{device.coordinates ? formatCoordinates(device.coordinates) : 'Sin coordenadas'}</dd>
            </div>
          </>
        )}
      </dl>

      {device.type === 'sentinel' && device.coordinates && (
        <div className="device-details-map">
          <p className="stat-label">Ubicación en parcela</p>
          <SentinelPlacementMap
            parcels={parcels}
            sentinels={[device]}
            selectedParcelId={device.parcelId}
          />
        </div>
      )}

      <div className="device-details-actions">
        <button type="button" className="btn-primary" onClick={onEdit}>
          {ui.common.edit}
        </button>
        <button type="button" className="btn-secondary" onClick={onClose}>
          {ui.common.cancel}
        </button>
      </div>
    </div>
  );
}
