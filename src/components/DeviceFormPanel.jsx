import SentinelPlacementMap from './SentinelPlacementMap';
import { formatCoordinates } from '../utils/geo';
import { getDeviceTypeLabel, ui } from '../i18n/es';

export default function DeviceFormPanel({
  title,
  activeForm,
  isSentinelForm,
  availableDeviceTypes,
  detectedParcel,
  sentinelsOnParcel,
  pendingSentinels = [],
  parcels,
  hasDrone,
  hasNest,
  editing,
  submitting,
  error,
  onSubmit,
  onCancel,
  onNameChange,
  onTypeChange,
  onSelectPoint,
  onRemovePending,
  getParcelName,
}) {
  const submitLabel = (() => {
    if (editing) return ui.devices.saveChanges;
    if (isSentinelForm && pendingSentinels.length > 1) {
      return `Registrar ${pendingSentinels.length} centinelas`;
    }
    if (isSentinelForm && pendingSentinels.length === 1) {
      return 'Registrar centinela';
    }
    return ui.devices.addButton;
  })();

  return (
    <div className="device-inline-editor">
      <div className="device-inline-editor-head">
        <h3>{title}</h3>
        <button type="button" className="btn-ghost" onClick={onCancel}>
          {ui.common.cancel}
        </button>
      </div>

      <form className="form" onSubmit={onSubmit}>
        <div className="grid-2">
          <label>
            {ui.devices.nameOptional}
            <input
              value={activeForm.name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={ui.devices.nameOptionalPlaceholder}
            />
          </label>
          <label>
            {ui.devices.type}
            <select value={activeForm.type} onChange={(e) => onTypeChange(e.target.value)}>
              {availableDeviceTypes.map((type) => (
                <option key={type} value={type}>
                  {getDeviceTypeLabel(type)}
                </option>
              ))}
            </select>
          </label>
        </div>

        {isSentinelForm && (
          <>
            {editing ? (
              <div className="mission-side-block">
                <p className="stat-label">Etiqueta automática</p>
                <p className="mission-side-value">{activeForm.sentinelLabel || 'Se asigna al guardar'}</p>
              </div>
            ) : (
              <p className="map-meta">
                Las etiquetas son únicas en tu cuenta (c1, c2, c3...) aunque estén en parcelas distintas.
              </p>
            )}

            <SentinelPlacementMap
              parcels={parcels}
              sentinels={sentinelsOnParcel}
              selectedPoint={editing ? activeForm.coordinates : null}
              draftPoints={editing ? [] : pendingSentinels}
              selectedParcelId={activeForm.parcelId}
              onSelectPoint={onSelectPoint}
              multiMode={!editing}
            />

            {!editing && pendingSentinels.length > 0 && (
              <div className="device-pending-list">
                <p className="stat-label">Centinelas por registrar ({pendingSentinels.length})</p>
                <ul>
                  {pendingSentinels.map((pending) => (
                    <li key={pending.id}>
                      <span>
                        <strong>{pending.sentinelLabel}</strong>
                        {' · '}
                        {getParcelName(pending.parcelId)}
                        {' · '}
                        {formatCoordinates(pending.coordinates)}
                      </span>
                      <button
                        type="button"
                        className="device-pending-remove"
                        onClick={() => onRemovePending(pending.id)}
                        aria-label={`Quitar ${pending.sentinelLabel}`}
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {editing && (
              <div className="mission-side-block">
                <p className="stat-label">Parcela detectada</p>
                <p className="mission-side-value">
                  {detectedParcel?.name ?? 'Haz clic en el mapa dentro de una parcela'}
                </p>
                <p className="map-meta">
                  Ubicación: {activeForm.coordinates ? formatCoordinates(activeForm.coordinates) : 'Sin marcar'}
                </p>
              </div>
            )}
          </>
        )}

        {!isSentinelForm && activeForm.type === 'drone' && hasDrone && !editing && (
          <p className="map-meta">Esta cuenta ya tiene un dron registrado.</p>
        )}

        {!isSentinelForm && activeForm.type === 'nest' && hasNest && !editing && (
          <p className="map-meta">Esta cuenta ya tiene un nido registrado.</p>
        )}

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={
              submitting
              || (activeForm.type === 'drone' && hasDrone && !editing)
              || (activeForm.type === 'nest' && hasNest && !editing)
              || (!editing && isSentinelForm && pendingSentinels.length === 0)
            }
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
