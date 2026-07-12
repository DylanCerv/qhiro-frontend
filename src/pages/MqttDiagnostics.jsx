import { useEffect, useState } from 'react';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { ui } from '../i18n/es';

const telemetryTemplates = [
  {
    id: 'drone-status',
    label: 'Drone: estado básico',
    description: 'Prueba conexión y batería sin disparar IA ni acciones agronómicas.',
    deviceType: 'drone',
    payload: {
      status: 'idle',
      batteryLevel: 85,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 'drone-scan-numeric',
    label: 'Drone: escaneo NDVI + NPK',
    description: 'Completa un vuelo y envía datos numéricos para análisis de IA.',
    deviceType: 'drone',
    payload: {
      parcelId: '<parcelId>',
      flightId: '<flightId>',
      status: 'completed',
      ndvi: 0.42,
      soilMoisture: 34,
      nitrogen: 25,
      phosphorus: 20,
      potassium: 32,
      batteryLevel: 78,
      coordinates: [{ lat: -0.1807, lng: -78.4678 }],
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 'drone-image-url',
    label: 'Drone: imagen por URL para IA',
    description: 'Envía una imagen accesible por URL junto con NDVI/NPK/coordenadas.',
    deviceType: 'drone',
    payload: {
      parcelId: '<parcelId>',
      flightId: '<flightId>',
      status: 'completed',
      ndvi: 0.55,
      soilMoisture: 40,
      nitrogen: 35,
      phosphorus: 28,
      potassium: 36,
      imageUrl: 'https://example.com/crop-image.jpg',
      coordinates: [{ lat: -0.1807, lng: -78.4678 }],
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 'drone-image-base64',
    label: 'Drone: imagen base64 para IA',
    description: 'Envía imagen embebida cuando el dron no puede subirla a una URL.',
    deviceType: 'drone',
    payload: {
      parcelId: '<parcelId>',
      flightId: '<flightId>',
      status: 'completed',
      ndvi: 0.55,
      soilMoisture: 40,
      nitrogen: 35,
      phosphorus: 28,
      potassium: 36,
      imageBase64: '<jpeg-base64-without-data-prefix>',
      coordinates: [{ lat: -0.1807, lng: -78.4678 }],
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 'sensor-soil',
    label: 'Sensor: suelo + batería',
    description: 'Actualiza lecturas de suelo y estado del sensor.',
    deviceType: 'sensor',
    payload: {
      parcelId: '<parcelId>',
      soilMoisture: 38,
      nitrogen: 30,
      phosphorus: 22,
      potassium: 34,
      batteryLevel: 64,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 'nest-supply',
    label: 'Nido: suministro bajo',
    description: 'Prueba niveles del nido y alerta de suministro bajo.',
    deviceType: 'nest',
    payload: {
      parcelId: '<parcelId>',
      supplyLevel: 12,
      batteryLevel: 92,
      timestamp: new Date().toISOString(),
    },
  },
];

export default function MqttDiagnostics() {
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('Qhiro MQTT diagnostic ping');
  const [clients, setClients] = useState([]);
  const [devices, setDevices] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [logs, setLogs] = useState([]);
  const [actionLogs, setActionLogs] = useState([]);
  const [userId, setUserId] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [parcelId, setParcelId] = useState('');
  const [deviceType, setDeviceType] = useState('drone');
  const [payloadText, setPayloadText] = useState(JSON.stringify(telemetryTemplates[0].payload, null, 2));
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [telemetrySubmitting, setTelemetrySubmitting] = useState(false);
  const [testFlightSubmitting, setTestFlightSubmitting] = useState(false);
  const [fullFlowSubmitting, setFullFlowSubmitting] = useState(false);

  const loadStatus = async () => {
    setError('');
    const response = await api.getMqttStatus();
    setStatus(response.mqtt);
  };

  useEffect(() => {
    Promise.all([loadStatus(), api.getClients()])
      .then(([, clientsResponse]) => {
        const nextClients = clientsResponse.clients ?? [];
        setClients(nextClients);
        setUserId(nextClients[0]?.userId ?? '');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!userId) {
      setDevices([]);
      setParcels([]);
      setDeviceId('');
      setParcelId('');
      return;
    }

    Promise.all([api.getClientDevices(userId), api.getClientParcels(userId)])
      .then(([devicesResponse, parcelsResponse]) => {
        const nextDevices = devicesResponse.devices ?? [];
        const nextParcels = parcelsResponse.parcels ?? [];
        setDevices(nextDevices);
        setParcels(nextParcels);
        const firstDevice = nextDevices[0];
        setDeviceId(firstDevice?.deviceId ?? '');
        if (firstDevice?.type) setDeviceType(firstDevice.type);
        setParcelId(nextParcels[0]?.parcelId ?? '');
      })
      .catch((err) => {
        setDevices([]);
        setParcels([]);
        setDeviceId('');
        setParcelId('');
        setError(err.message);
      });

    Promise.all([api.getClientTelemetryLogs(userId), api.getClientActionLogs(userId)])
      .then(([telemetryResponse, actionResponse]) => {
        setLogs(telemetryResponse.logs ?? []);
        setActionLogs(actionResponse.logs ?? []);
      })
      .catch(() => {
        setLogs([]);
        setActionLogs([]);
      });
  }, [userId]);

  useEffect(() => {
    const device = devices.find((item) => item.deviceId === deviceId);
    if (device?.type) setDeviceType(device.type);
  }, [deviceId, devices]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setResult('');
    setError('');
    try {
      const response = await api.sendMqttDiagnostic({ message });
      setStatus(response.mqtt);
      setResult(`${ui.mqttDiagnostics.sent} ${ui.mqttDiagnostics.topic}: ${response.topic}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const hydratePayload = (template) => {
    const selectedParcel = parcels.find((parcel) => parcel.parcelId === parcelId) ?? parcels[0];
    const fallbackCoordinates = [{ lat: -0.1807, lng: -78.4678 }];
    const payload = {
      ...template.payload,
      timestamp: new Date().toISOString(),
    };

    if ('parcelId' in payload) {
      payload.parcelId = selectedParcel?.parcelId ?? '';
    }

    if ('coordinates' in payload) {
      payload.coordinates = selectedParcel?.coordinates?.length
        ? selectedParcel.coordinates
        : fallbackCoordinates;
    }

    if ('flightId' in payload) {
      payload.flightId = '';
    }

    return payload;
  };

  const applyTemplate = (template) => {
    const nextPayloadText = JSON.stringify(hydratePayload(template), null, 2);
    const selectedDevice = devices.find((device) => device.deviceId === deviceId);
    if (selectedDevice?.type !== template.deviceType) {
      const compatibleDevice = devices.find((device) => device.type === template.deviceType);
      if (!compatibleDevice) {
        setPayloadText(nextPayloadText);
        setResult('');
        setError(`El cliente seleccionado no tiene un dispositivo de tipo ${template.deviceType}.`);
        return;
      }
      setDeviceId(compatibleDevice.deviceId);
      setDeviceType(compatibleDevice.type);
    }
    setPayloadText(nextPayloadText);
    setResult('');
    setError('');
  };

  const handleTelemetrySubmit = async (event) => {
    event.preventDefault();
    setTelemetrySubmitting(true);
    setResult('');
    setError('');
    try {
      const payload = JSON.parse(payloadText);
      const selectedDevice = devices.find((device) => device.deviceId === deviceId);
      if (!selectedDevice) {
        throw new Error('Selecciona un dispositivo válido antes de publicar.');
      }
      const response = await api.sendAdminTelemetry({
        userId,
        deviceId,
        deviceType: selectedDevice.type,
        payload,
      });
      setStatus(response.mqtt);
      setResult(`${ui.mqttDiagnostics.sent} ${ui.mqttDiagnostics.topic}: ${response.topic}`);
      const [logsResponse, actionResponse] = await Promise.all([
        api.getClientTelemetryLogs(userId),
        api.getClientActionLogs(userId),
      ]);
      setLogs(logsResponse.logs ?? []);
      setActionLogs(actionResponse.logs ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setTelemetrySubmitting(false);
    }
  };

  const handleCreateTestFlight = async () => {
    setTestFlightSubmitting(true);
    setResult('');
    setError('');
    try {
      const selectedDevice = devices.find((device) => device.deviceId === deviceId);
      const drone = selectedDevice?.type === 'drone'
        ? selectedDevice
        : devices.find((device) => device.type === 'drone');

      if (!drone) {
        throw new Error('Este cliente no tiene un dron registrado. Crea un dispositivo tipo Dron antes de generar el vuelo de prueba.');
      }
      if (!parcelId) throw new Error('Selecciona una parcela antes de crear el vuelo de prueba.');

      setDeviceId(drone.deviceId);
      setDeviceType(drone.type);

      const response = await api.createAdminTestFlight({
        userId,
        deviceId: drone.deviceId,
        parcelId,
      });
      const flightId = response.flight.flightId;
      const payload = JSON.parse(payloadText);
      payload.flightId = flightId;
      payload.parcelId = parcelId;
      payload.status = 'completed';
      setPayloadText(JSON.stringify(payload, null, 2));
      setResult(`Vuelo de prueba creado y aplicado al payload: ${flightId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setTestFlightSubmitting(false);
    }
  };

  const handleRunFullDroneFlow = async () => {
    setFullFlowSubmitting(true);
    setResult('');
    setError('');
    try {
      const selectedDevice = devices.find((device) => device.deviceId === deviceId);
      const drone = selectedDevice?.type === 'drone'
        ? selectedDevice
        : devices.find((device) => device.type === 'drone');

      if (!drone) {
        throw new Error('Este cliente no tiene un dron registrado. Edita o crea un dispositivo tipo Dron.');
      }
      if (!parcelId) throw new Error('Selecciona una parcela antes de ejecutar el flujo completo.');

      setDeviceId(drone.deviceId);
      setDeviceType(drone.type);

      const payload = JSON.parse(payloadText);
      const response = await api.runAdminTestDroneFlow({
        userId,
        deviceId: drone.deviceId,
        parcelId,
        payload,
      });

      setStatus(response.mqtt);
      setPayloadText(JSON.stringify(response.payload, null, 2));
      setResult(`Flujo completo publicado. Vuelo: ${response.flight.flightId}. Topic: ${response.topic}`);

      setTimeout(async () => {
        const [logsResponse, actionResponse] = await Promise.all([
          api.getClientTelemetryLogs(userId),
          api.getClientActionLogs(userId),
        ]);
        setLogs(logsResponse.logs ?? []);
        setActionLogs(actionResponse.logs ?? []);
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setFullFlowSubmitting(false);
    }
  };

  const selectedClient = clients.find((client) => client.userId === userId);

  if (loading) return <p className="page-state">{ui.common.loadingSession}</p>;

  return (
    <div className="page">
      <div className="page-head">
        <h1>{ui.mqttDiagnostics.title}</h1>
        <p>{ui.mqttDiagnostics.subtitle}</p>
      </div>

      <section className="card">
        <div className="stat-block">
          <p className="stat-label">{ui.mqttDiagnostics.status}</p>
          <StatusBadge
            status={status?.connected ? 'green' : 'red'}
            label={status?.connected ? ui.mqttDiagnostics.connected : ui.mqttDiagnostics.disconnected}
          />
          <p className="stat-label">
            {ui.mqttDiagnostics.broker}: {status?.brokerUrl ?? ui.common.notAvailable}
          </p>
          <p className="stat-label">
            {ui.mqttDiagnostics.clientId}: {status?.clientId ?? ui.common.notAvailable}
          </p>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => loadStatus().catch((err) => setError(err.message))}
          >
            {ui.mqttDiagnostics.refresh}
          </button>
        </div>
      </section>

      <section className="card">
        <form className="form" onSubmit={handleSubmit}>
          <label>
            {ui.mqttDiagnostics.message}
            <input value={message} onChange={(event) => setMessage(event.target.value)} required />
          </label>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {ui.mqttDiagnostics.send}
          </button>
        </form>

        {result && <p className="form-success">{result}</p>}
        {error && <p className="form-error">{error}</p>}
      </section>

      <section className="card">
        <h2>Contrato de integración del dron</h2>
        <p className="map-meta">
          El backend debe estar corriendo siempre, incluso si el frontend está cerrado. El dron se conecta al broker MQTT y publica en un topic restringido por usuario y dispositivo.
        </p>
        <div className="simple-list">
          <span>1. Registrar el dispositivo en Qhiro desde la sección Dispositivos.</span>
          <span>2. Copiar userId, deviceId y deviceType del dispositivo asignado.</span>
          <span>3. Conectar el dron al broker con usuario/contraseña MQTT.</span>
          <span>4. Publicar telemetría en qhiro/users/&lcub;userId&rcub;/devices/&lcub;deviceId&rcub;/&lcub;deviceType&rcub;/telemetry.</span>
          <span>5. El backend valida pertenencia y tipo antes de guardar datos o llamar a IA.</span>
          <span>6. Si la IA ordena una acción, el backend publica un comando con actionId en qhiro/users/&lcub;userId&rcub;/devices/&lcub;sensorId&rcub;/command.</span>
          <span>7. El centinela/sensor debe confirmar fin de acción en qhiro/users/&lcub;userId&rcub;/devices/&lcub;sensorId&rcub;/actions/&lcub;actionId&rcub;/ack con status completed o failed.</span>
        </div>
      </section>

      <section className="card">
        <h2>Formatos MQTT soportados</h2>
        <p className="map-meta">
          Haz clic en una plantilla para cargarla con la parcela seleccionada. El `flightId` queda vacío porque debe ser un vuelo real creado por el backend; inventarlo provoca rechazo.
        </p>
        <div className="form-actions">
          {telemetryTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              className="btn-secondary"
              onClick={() => applyTemplate(template)}
            >
              <strong>{template.label}</strong>
              <span>{template.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Publicar telemetría validada</h2>
        <form className="form" onSubmit={handleTelemetrySubmit}>
          <div className="grid-2">
            <label>
              Cliente
              <select value={userId} onChange={(event) => setUserId(event.target.value)} required>
                <option value="">Seleccionar cliente</option>
                {clients.map((client) => (
                  <option key={client.userId} value={client.userId}>
                    {client.displayName} · {client.email}
                  </option>
                ))}
              </select>
            </label>
            <label>
              userId
              <input value={userId} readOnly />
            </label>
            <label>
              Dispositivo
              <select value={deviceId} onChange={(event) => setDeviceId(event.target.value)} required>
                <option value="">Seleccionar dispositivo</option>
                {devices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.name} · {device.type} · {device.deviceId}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Parcela
              <select value={parcelId} onChange={(event) => setParcelId(event.target.value)}>
                <option value="">Sin parcela</option>
                {parcels.map((parcel) => (
                  <option key={parcel.parcelId} value={parcel.parcelId}>
                    {parcel.name} · {parcel.parcelId}
                  </option>
                ))}
              </select>
            </label>
            <label>
              deviceId
              <input value={deviceId} readOnly />
            </label>
            <label>
              deviceType
              <input value={deviceType} readOnly />
            </label>
            <label>
              Topic resultante
              <input
                readOnly
                value={
                  userId && deviceId
                    ? `qhiro/users/${userId}/devices/${deviceId}/${deviceType}/telemetry`
                    : ''
                }
              />
            </label>
          </div>
          {selectedClient && (
            <p className="map-meta">
              Cliente seleccionado: {selectedClient.displayName} · {selectedClient.email}
            </p>
          )}
          {userId && devices.length === 0 && (
            <p className="form-error">
              Este cliente no tiene dispositivos registrados. Registra un dron/sensor/nido antes de probar MQTT.
            </p>
          )}
          <label>
            Payload JSON
            <textarea
              rows="16"
              value={payloadText}
              onChange={(event) => setPayloadText(event.target.value)}
              spellCheck={false}
              required
            />
          </label>
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCreateTestFlight}
              disabled={testFlightSubmitting}
            >
              {testFlightSubmitting ? 'Creando vuelo de prueba...' : 'Crear vuelo de prueba y rellenar flightId'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleRunFullDroneFlow}
              disabled={fullFlowSubmitting}
            >
              {fullFlowSubmitting ? 'Ejecutando flujo completo...' : 'Ejecutar flujo completo como dron'}
            </button>
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={telemetrySubmitting || !userId || !deviceId}
          >
            Publicar telemetría
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Registros recientes de procesamiento</h2>
        {logs.length === 0 ? (
          <p className="empty-state">Aún no hay telemetría procesada para este cliente.</p>
        ) : (
          <ul className="simple-list">
            {logs.map((log) => (
              <li key={log.logId}>
                <strong>
                  {log.deviceType} · {log.deviceId}
                </strong>
                <span>Estado: {log.status}</span>
                <span>Duración: {log.durationMs} ms</span>
                <span>Parcela: {log.parcelId ?? 'N/A'}</span>
                <span>Vuelo: {log.flightId ?? 'N/A'}</span>
                <span>Acciones: {log.actions?.length ? log.actions.join(', ') : 'Ninguna'}</span>
                {log.aiResponse && (
                  <span>
                    IA: severidad {log.aiResponse.severity} · {log.aiResponse.recommendedAction}
                  </span>
                )}
                {log.validationMessage && <span>Detalle: {log.validationMessage}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Registros reales de acciones</h2>
        <p className="map-meta">
          Estos estados no los calcula el frontend. El backend los marca como pendientes al enviar la orden y los finaliza solo cuando llega un ACK MQTT del dispositivo.
        </p>
        {actionLogs.length === 0 ? (
          <p className="empty-state">Aún no hay acciones registradas para este cliente.</p>
        ) : (
          <ul className="simple-list">
            {actionLogs.map((log) => (
              <li key={log.actionId}>
                <strong>
                  {log.action} · {log.deviceId}
                </strong>
                <span>Estado: {log.status}</span>
                <span>Acción ID: {log.actionId}</span>
                <span>Parcela: {log.parcelId}</span>
                <span>Zona: {log.zoneId}</span>
                <span>Inicio: {log.startedAt}</span>
                <span>Finalizó: {log.completedAt ?? 'Pendiente de ACK'}</span>
                <span>Duración hasta finalización: {log.durationMs ? `${log.durationMs} ms` : 'Pendiente'}</span>
                {log.error && <span>Error: {log.error}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
