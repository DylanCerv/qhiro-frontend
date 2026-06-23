import { useEffect, useState } from 'react';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { formatDate, getDeviceStatusLabel, getDeviceTypeLabel, ui } from '../i18n/es';

const deviceTypeOptions = ['drone', 'sensor', 'nest'];

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'sensor' });
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

  if (loading) return <p className="page-state">{ui.common.loadingDevices}</p>;

  return (
    <div className="page">
      <div className="page-head">
        <h1>{ui.devices.title}</h1>
        <p>{ui.devices.subtitle}</p>
      </div>

      <section className="card">
        <h2>{ui.devices.addTitle}</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="grid-2">
            <label>
              {ui.devices.name}
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={ui.devices.namePlaceholder}
                required
              />
            </label>
            <label>
              {ui.devices.type}
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {deviceTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {getDeviceTypeLabel(type)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {ui.devices.addButton}
          </button>
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
          </section>
        ))}
      </div>

      {devices.length === 0 && !error && <p className="empty-state">{ui.devices.noDevices}</p>}
    </div>
  );
}
