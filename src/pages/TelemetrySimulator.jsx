import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { useParcels } from '../context/ParcelContext';
import { getDeviceTypeLabel, ui } from '../i18n/es';

const emptyTelemetry = {
  status: 'idle',
  flightId: '',
  ndvi: 0.65,
  batteryLevel: 85,
  soilMoisture: 42,
  nitrogen: 45,
  phosphorus: 30,
  potassium: 55,
  supplyLevel: 80,
};

export default function TelemetrySimulator() {
  const { parcels } = useParcels();
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [selectedParcelId, setSelectedParcelId] = useState('');
  const [telemetry, setTelemetry] = useState(emptyTelemetry);
  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .getDevices()
      .then((res) => {
        const nextDevices = res.devices ?? [];
        setDevices(nextDevices);
        setSelectedDeviceId(nextDevices[0]?.deviceId ?? '');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setSelectedParcelId((current) => current || parcels[0]?.parcelId || '');
  }, [parcels]);

  const selectedDevice = useMemo(
    () => devices.find((device) => device.deviceId === selectedDeviceId) ?? null,
    [devices, selectedDeviceId],
  );

  const updateTelemetry = (field, value) => {
    setTelemetry((prev) => ({ ...prev, [field]: value }));
  };

  const buildPayload = () => {
    const base = {
      status: telemetry.status,
      batteryLevel: Number(telemetry.batteryLevel),
      timestamp: new Date().toISOString(),
    };

    if (selectedDevice?.type === 'drone') {
      return {
        ...base,
        flightId: telemetry.flightId || undefined,
        parcelId: selectedParcelId || undefined,
        ndvi: Number(telemetry.ndvi),
        soilMoisture: Number(telemetry.soilMoisture),
        nitrogen: Number(telemetry.nitrogen),
        phosphorus: Number(telemetry.phosphorus),
        potassium: Number(telemetry.potassium),
      };
    }

    if (selectedDevice?.type === 'sensor') {
      return {
        ...base,
        parcelId: selectedParcelId || undefined,
        soilMoisture: Number(telemetry.soilMoisture),
        nitrogen: Number(telemetry.nitrogen),
        phosphorus: Number(telemetry.phosphorus),
        potassium: Number(telemetry.potassium),
      };
    }

    return {
      ...base,
      parcelId: selectedParcelId || undefined,
      supplyLevel: Number(telemetry.supplyLevel),
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedDevice) return;

    setSubmitting(true);
    setMessage('');
    setTopic('');
    setError('');
    try {
      const response = await api.simulateTelemetry({
        deviceId: selectedDevice.deviceId,
        deviceType: selectedDevice.type,
        payload: buildPayload(),
      });
      setMessage(ui.simulator.sent);
      setTopic(response.topic ?? '');
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
        <h1>{ui.simulator.title}</h1>
        <p>{ui.simulator.subtitle}</p>
      </div>

      <section className="card">
        {devices.length === 0 ? (
          <p className="empty-state">{ui.simulator.noDevices}</p>
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            <div className="grid-2">
              <label>
                {ui.simulator.device}
                <select
                  value={selectedDeviceId}
                  onChange={(event) => setSelectedDeviceId(event.target.value)}
                >
                  {devices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.name} · {getDeviceTypeLabel(device.type)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                {ui.simulator.parcel}
                <select
                  value={selectedParcelId}
                  onChange={(event) => setSelectedParcelId(event.target.value)}
                  disabled={parcels.length === 0}
                >
                  {parcels.length === 0 ? (
                    <option value="">{ui.simulator.noParcels}</option>
                  ) : (
                    parcels.map((parcel) => (
                      <option key={parcel.parcelId} value={parcel.parcelId}>
                        {parcel.name}
                      </option>
                    ))
                  )}
                </select>
              </label>

              <label>
                {ui.simulator.status}
                <select
                  value={telemetry.status}
                  onChange={(event) => updateTelemetry('status', event.target.value)}
                >
                  <option value="idle">idle</option>
                  <option value="started">started</option>
                  <option value="completed">completed</option>
                  <option value="failed">failed</option>
                </select>
              </label>

              <label>
                {ui.simulator.batteryLevel}
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={telemetry.batteryLevel}
                  onChange={(event) => updateTelemetry('batteryLevel', event.target.value)}
                />
              </label>
            </div>

            {selectedDevice?.type === 'drone' && (
              <div className="grid-2">
                <label>
                  {ui.simulator.flightId}
                  <input
                    value={telemetry.flightId}
                    onChange={(event) => updateTelemetry('flightId', event.target.value)}
                    placeholder="Opcional; requerido para completar un vuelo real"
                  />
                </label>
                <label>
                  {ui.simulator.ndvi}
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={telemetry.ndvi}
                    onChange={(event) => updateTelemetry('ndvi', event.target.value)}
                  />
                </label>
              </div>
            )}

            {selectedDevice?.type !== 'nest' && (
              <div className="grid-2">
                <label>
                  {ui.simulator.soilMoisture}
                  <input
                    type="number"
                    value={telemetry.soilMoisture}
                    onChange={(event) => updateTelemetry('soilMoisture', event.target.value)}
                  />
                </label>
                <label>
                  {ui.simulator.nitrogen}
                  <input
                    type="number"
                    value={telemetry.nitrogen}
                    onChange={(event) => updateTelemetry('nitrogen', event.target.value)}
                  />
                </label>
                <label>
                  {ui.simulator.phosphorus}
                  <input
                    type="number"
                    value={telemetry.phosphorus}
                    onChange={(event) => updateTelemetry('phosphorus', event.target.value)}
                  />
                </label>
                <label>
                  {ui.simulator.potassium}
                  <input
                    type="number"
                    value={telemetry.potassium}
                    onChange={(event) => updateTelemetry('potassium', event.target.value)}
                  />
                </label>
              </div>
            )}

            {selectedDevice?.type === 'nest' && (
              <label>
                {ui.simulator.supplyLevel}
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={telemetry.supplyLevel}
                  onChange={(event) => updateTelemetry('supplyLevel', event.target.value)}
                />
              </label>
            )}

            <button type="submit" className="btn-primary" disabled={submitting || !selectedDevice}>
              {ui.simulator.send}
            </button>
          </form>
        )}

        {message && <p className="form-success">{message}</p>}
        {topic && (
          <p className="map-meta">
            {ui.simulator.topic}: {topic}
          </p>
        )}
        {error && <p className="form-error">{error}</p>}
      </section>
    </div>
  );
}
