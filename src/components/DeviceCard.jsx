import StatusBadge from './StatusBadge';
import { formatCoordinates } from '../utils/geo';
import { getDeviceStatusLabel, getDeviceTypeLabel, ui } from '../i18n/es';
import { getSentinelDisplayLabel } from '../utils/sentinel';

const deviceVisuals = {
  drone: { icon: 'flight_takeoff', accent: '#92ccff' },
  nest: { icon: 'hub', accent: '#c084fc' },
  sentinel: { icon: 'cell_tower', accent: '#f3cc54' },
  sensor: { icon: 'sensors', accent: '#8b8f98' },
};

export default function DeviceCard({
  device,
  parcelName,
  selected = false,
  onViewDetails,
  onEdit,
  onToggleStatus,
  onDelete,
  deleting,
  toggling,
}) {
  const visual = deviceVisuals[device.type] ?? deviceVisuals.sensor;
  const showBattery = device.type !== 'nest';

  const subtitle = device.type === 'sentinel'
    ? `${device.parcelId ? parcelName : 'Sin parcela'} · ${device.coordinates ? formatCoordinates(device.coordinates) : 'Sin coords'}`
    : null;

  return (
    <article
      className={`device-row device-row--${device.type}${selected ? ' is-selected' : ''}${showBattery ? '' : ' device-row--no-battery'}`}
    >
      <div
        className="device-row-icon"
        style={{ '--device-accent': visual.accent }}
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          {visual.icon}
        </span>
        {device.type === 'sentinel' && (
          <span className="device-map-label">{getSentinelDisplayLabel(device)}</span>
        )}
      </div>

      <div className="device-row-info">
        <p className="device-row-type">{getDeviceTypeLabel(device.type)}</p>
        <p className="device-row-name">{device.name}</p>
        {subtitle && <p className="device-row-sub">{subtitle}</p>}
        <button type="button" className="device-row-details-btn" onClick={onViewDetails}>
          Ver detalles
        </button>
      </div>

      {showBattery && (
        <div className="device-row-battery" title={`${ui.devices.battery}: ${device.batteryLevel}%`}>
          <div className="battery-bar">
            <div className="battery-fill" style={{ width: `${device.batteryLevel}%` }} />
          </div>
          <span>{device.batteryLevel}%</span>
        </div>
      )}

      <StatusBadge status={device.status} label={getDeviceStatusLabel(device.status)} />

      <div className="device-row-actions">
        <button type="button" className="device-row-btn" onClick={onEdit} title={ui.common.edit}>
          <span className="material-symbols-outlined">edit</span>
        </button>
        <button
          type="button"
          className="device-row-btn"
          onClick={onToggleStatus}
          disabled={toggling}
          title={device.status === 'online' ? 'Desconectar' : 'Conectar'}
        >
          <span className="material-symbols-outlined">
            {device.status === 'online' ? 'link_off' : 'link'}
          </span>
        </button>
        <button
          type="button"
          className="device-row-btn device-row-btn--danger"
          onClick={onDelete}
          disabled={deleting}
          title={ui.common.delete}
        >
          <span className="material-symbols-outlined">{deleting ? 'hourglass_empty' : 'delete'}</span>
        </button>
      </div>
    </article>
  );
}
