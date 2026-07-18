import { useEffect, useState } from 'react';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { useParcels } from '../context/ParcelContext';
import { formatDate, getDeviceStatusLabel, getDeviceTypeLabel, ui } from '../i18n/es';

const deviceTypeOptions = ['drone', 'sensor', 'nest', 'sentinel'];
const emptyDeviceForm = {
  name: '',
  type: 'sensor',
  status: 'online',
  parcelId: '',
  zoneId: '',
};

export default function Devices() {
  const { parcels } = useParcels();
  const [devices, setDevices] = useState([]);
  const [form, setForm] = useState(emptyDeviceForm);
  const [editingDeviceId, setEditingDeviceId] = useState(null);
  const [editForm, setEditForm] = useState(emptyDeviceForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const getParcelName = (parcelId) => parcels.find((parcel) => parcel.parcelId === parcelId)?.name ?? 'Parcela';

  const loadDevices = () =>
    api
      .getDevices()
      .then((res) => setDevices(res.devices ?? []))
      .catch((err) => setError(err.message));

  useEffect(() => {
    loadDevices().finally(() => setLoading(false));
  }, []);

  const hydrateSentinelDefaults = (nextForm) => {
    if (nextForm.type !== 'sentinel') return nextForm;
    const selectedParcel = parcels.find((parcel) => parcel.parcelId === nextForm.parcelId) ?? parcels[0];
    return {
      ...nextForm,
      parcelId: nextForm.parcelId || selectedParcel?.parcelId || '',
      zoneId: nextForm.zoneId || selectedParcel?.zoneId || '',
    };
  };

  const buildDevicePayload = (source) => {
    const payload = {
      name: source.name,
      type: source.type,
      status: source.status ?? 'online',
    };
    if (source.type !== 'sentinel') return payload;
    return {
      ...payload,
      parcelId: source.parcelId,
      zoneId: source.zoneId || undefined,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const result = await api.createDevice(buildDevicePayload(form));
      setDevices((prev) => [...prev, result.device]);
      setForm(emptyDeviceForm);
      setMessage(ui.devices.added);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (device) => {
    setEditingDeviceId(device.deviceId);
    setEditForm({
      name: device.name,
      type: device.type,
      status: device.status,
      parcelId: device.parcelId ?? '',
      zoneId: device.zoneId ?? '',
    });
    setMessage('');
    setError('');
  };

  const cancelEdit = () => {
    setEditingDeviceId(null);
    setEditForm(emptyDeviceForm);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const result = await api.updateDevice(editingDeviceId, buildDevicePayload(editForm));
      setDevices((prev) =>
        prev.map((device) => (device.deviceId === editingDeviceId ? result.device : device)),
      );
      cancelEdit();
      setMessage(ui.devices.updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (device) => {
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const nextStatus = device.status === 'online' ? 'offline' : 'online';
      const result = await api.toggleDeviceStatus(device.deviceId, nextStatus);
      setDevices((prev) =>
        prev.map((item) => (item.deviceId === device.deviceId ? result.device : item)),
      );
      setMessage(nextStatus === 'online' ? 'Dispositivo conectado.' : 'Dispositivo desconectado.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="page-state">{ui.common.loadingDevices}</p>;

  return (
    <div className="page devices-page">
      <div className="page-head devices-head">
        <div>
          <p className="page-eyebrow">Hardware-Ops Dashboard</p>
          <h1>Flota de Hardware</h1>
        </div>
        <p>{ui.devices.subtitle}</p>
      </div>

      <section className="card">
        <h2>{editingDeviceId ? ui.devices.editTitle : ui.devices.addTitle}</h2>
        <form className="form" onSubmit={editingDeviceId ? handleUpdate : handleSubmit}>
          <div className="grid-2">
            <label>
              {ui.devices.name}
              <input
                value={editingDeviceId ? editForm.name : form.name}
                onChange={(e) =>
                  editingDeviceId
                    ? setEditForm({ ...editForm, name: e.target.value })
                    : setForm({ ...form, name: e.target.value })
                }
                placeholder={ui.devices.namePlaceholder}
                required
              />
            </label>
            <label>
              {ui.devices.type}
              <select
                value={editingDeviceId ? editForm.type : form.type}
                onChange={(e) =>
                  editingDeviceId
                    ? setEditForm(hydrateSentinelDefaults({ ...editForm, type: e.target.value }))
                    : setForm(hydrateSentinelDefaults({ ...form, type: e.target.value }))
                }
              >
                {deviceTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {getDeviceTypeLabel(type)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {(editingDeviceId ? editForm.type : form.type) === 'sentinel' && (
            <>
              <div className="grid-2">
                <label>
                  Parcela asignada
                  <select
                    value={editingDeviceId ? editForm.parcelId : form.parcelId}
                    onChange={(e) => {
                      const selectedParcel = parcels.find((parcel) => parcel.parcelId === e.target.value);
                      const next = {
                        ...(editingDeviceId ? editForm : form),
                        parcelId: e.target.value,
                        zoneId: selectedParcel?.zoneId ?? '',
                      };
                      editingDeviceId ? setEditForm(next) : setForm(next);
                    }}
                    required
                  >
                    <option value="">Seleccionar parcela</option>
                    {parcels.map((parcel) => (
                      <option key={parcel.parcelId} value={parcel.parcelId}>
                        {parcel.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Zona
                  <input
                    value={editingDeviceId ? editForm.zoneId : form.zoneId}
                    onChange={(e) =>
                      editingDeviceId
                        ? setEditForm({ ...editForm, zoneId: e.target.value })
                        : setForm({ ...form, zoneId: e.target.value })
                    }
                    placeholder="Ej. zone_a"
                  />
                </label>
              </div>
              <p className="map-meta">
                MVP: solo se permite un centinela por parcela. El backend enviará automáticamente la orden al centinela registrado para esa parcela.
              </p>
            </>
          )}
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {editingDeviceId ? ui.devices.saveChanges : ui.devices.addButton}
            </button>
            {editingDeviceId && (
              <button type="button" className="btn-secondary" onClick={cancelEdit}>
                {ui.common.cancel}
              </button>
            )}
          </div>
        </form>
        {message && <p className="form-success">{message}</p>}
        {error && <p className="form-error">{error}</p>}
      </section>

      <div className="device-grid">
        {devices.map((device) => (
          <section key={device.deviceId} className="card device-card">
            <div className="device-head">
              <h2>{getDeviceTypeLabel(device.type)}</h2>
              <StatusBadge
                status={device.status}
                label={getDeviceStatusLabel(device.status)}
              />
            </div>
            <p className="device-name">{device.name}</p>
            <div className="battery-bar">
              <div className="battery-fill" style={{ width: `${device.batteryLevel}%` }} />
            </div>
            <p className="device-meta">
              {ui.devices.battery}: {device.batteryLevel}%
            </p>
            <p className="device-meta">
              {ui.devices.lastSeen}: {formatDate(device.lastSeenAt)}
            </p>
            {device.type === 'sentinel' && (
              <div className="simple-list">
                <span>Parcela: {device.parcelId ? getParcelName(device.parcelId) : 'Sin asignar'}</span>
                <span>Zona: {device.zoneId ? 'Configurada' : 'Sin zona'}</span>
              </div>
            )}
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => startEdit(device)}>
                {ui.common.edit}
              </button>
              <button type="button" className="btn-secondary" onClick={() => handleToggleStatus(device)}>
                {device.status === 'online' ? 'Desconectar' : 'Conectar'}
              </button>
            </div>
          </section>
        ))}
      </div>

      {devices.length === 0 && !error && <p className="empty-state">{ui.devices.noDevices}</p>}
    </div>
  );
}
