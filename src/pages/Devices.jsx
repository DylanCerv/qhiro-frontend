import { useEffect, useState } from 'react';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { formatDate, getDeviceStatusLabel, getDeviceTypeLabel, ui } from '../i18n/es';

const deviceTypeOptions = ['drone', 'sensor', 'nest'];

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'sensor' });
  const [editingDeviceId, setEditingDeviceId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', type: 'sensor' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadDevices = () =>
    api
      .getDevices()
      .then((res) => setDevices(res.devices ?? []))
      .catch((err) => setError(err.message));

  useEffect(() => {
    loadDevices().finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const result = await api.createDevice(form);
      setDevices((prev) => [...prev, result.device]);
      setForm({ name: '', type: 'sensor' });
      setMessage(ui.devices.added);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (device) => {
    setEditingDeviceId(device.deviceId);
    setEditForm({ name: device.name, type: device.type });
    setMessage('');
    setError('');
  };

  const cancelEdit = () => {
    setEditingDeviceId(null);
    setEditForm({ name: '', type: 'sensor' });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const result = await api.updateDevice(editingDeviceId, editForm);
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

  if (loading) return <p className="page-state">{ui.common.loadingDevices}</p>;

  return (
    <div className="page">
      <div className="page-head">
        <h1>{ui.devices.title}</h1>
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
                    ? setEditForm({ ...editForm, type: e.target.value })
                    : setForm({ ...form, type: e.target.value })
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
            <p className="device-id">{device.deviceId}</p>
            <div className="battery-bar">
              <div className="battery-fill" style={{ width: `${device.batteryLevel}%` }} />
            </div>
            <p className="device-meta">
              {ui.devices.battery}: {device.batteryLevel}%
            </p>
            <p className="device-meta">
              {ui.devices.lastSeen}: {formatDate(device.lastSeenAt)}
            </p>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => startEdit(device)}>
                {ui.common.edit}
              </button>
            </div>
          </section>
        ))}
      </div>

      {devices.length === 0 && !error && <p className="empty-state">{ui.devices.noDevices}</p>}
    </div>
  );
}
