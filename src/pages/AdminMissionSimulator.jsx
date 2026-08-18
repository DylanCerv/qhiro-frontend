import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api/client';
import MissionParcelMap from '../components/MissionParcelMap';
import StatusBadge from '../components/StatusBadge';
import { ui } from '../i18n/es';
import { findParcelAtPoint, formatCoordinates } from '../utils/geo';
import { filterSentinels, findNearestSentinel, getSentinelDisplayLabel, MAX_SENTINEL_SNAP_METERS } from '../utils/sentinel';

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 90000;
const GALLERY_STORAGE_KEY = 'qhiro-mission-image-gallery';
const MAX_GALLERY_ITEMS = 24;

const ACTION_LABELS = {
  none: 'Sin acción',
  monitor: 'Monitorear',
  injection: 'Inyección NPK',
  emergency: 'Emergencia',
};

function readImageAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? '');
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    reader.readAsDataURL(file);
  });
}

function toImagePreview(base64) {
  return `data:image/jpeg;base64,${base64}`;
}

function loadImageGallery() {
  try {
    const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
    const items = raw ? JSON.parse(raw) : [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function saveImageGallery(items) {
  localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(items.slice(0, MAX_GALLERY_ITEMS)));
}

function createGalleryItem(file, base64) {
  return {
    id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: file.name,
    base64,
    uploadedAt: new Date().toISOString(),
  };
}

function resolveActiveDrone(devices = []) {
  const drones = devices.filter((device) => device.type === 'drone');
  return drones.find((device) => device.status !== 'offline') ?? drones[0] ?? null;
}

function hasAiFailed(telemetryLog) {
  if (!telemetryLog) return false;
  return telemetryLog.status === 'failed'
    || telemetryLog.actions?.includes('ai:failed')
    || Boolean(telemetryLog.validationMessage && !telemetryLog.aiResponse);
}

function isActionLinkedToMission(actionLog, telemetryLog) {
  if (!actionLog || !telemetryLog?.createdAt || hasAiFailed(telemetryLog)) return false;
  return !actionLog.startedAt || actionLog.startedAt >= telemetryLog.createdAt;
}

function needsSentinelAction(telemetryLog) {
  const ai = telemetryLog?.aiResponse;
  if (!ai) return false;
  return ai.severity >= 0.6
    || ai.recommendedAction === 'injection'
    || ai.recommendedAction === 'emergency';
}

function buildTimelineEvents({
  telemetryLog,
  actionLog,
  parcel,
  point,
  sentinel,
  running = false,
} = {}) {
  const linkedAction = isActionLinkedToMission(actionLog, telemetryLog) ? actionLog : null;
  const aiFailed = hasAiFailed(telemetryLog);
  const hasCapture = Boolean(telemetryLog);
  const hasAnalysis = Boolean(telemetryLog?.aiResponse);
  const sentinelLabel = sentinel ? getSentinelDisplayLabel(sentinel) : null;

  const capture = {
    id: 'capture',
    title: 'Captura',
    time: telemetryLog?.createdAt ?? null,
    status: hasCapture ? 'done' : running ? 'active' : 'pending',
    detail: hasCapture
      ? (parcel ? `Parcela ${parcel.name} · ${formatCoordinates(point)}` : formatCoordinates(point))
      : 'Esperando el punto de captura del dron.',
  };

  const analysis = {
    id: 'analysis',
    title: 'Análisis',
    time: hasAnalysis || aiFailed ? telemetryLog.createdAt : null,
    status: 'pending',
    detail: 'Pendiente del análisis IA.',
  };

  if (aiFailed) {
    analysis.status = 'error';
    analysis.detail = telemetryLog.validationMessage ?? 'No se pudo completar el análisis.';
  } else if (hasAnalysis) {
    analysis.status = 'done';
    analysis.detail = telemetryLog.aiResponse.diagnosis;
    analysis.meta = `Severidad ${(telemetryLog.aiResponse.severity * 100).toFixed(0)}% · ${ACTION_LABELS[telemetryLog.aiResponse.recommendedAction] ?? telemetryLog.aiResponse.recommendedAction}`;
  } else if (hasCapture) {
    analysis.status = 'active';
    analysis.detail = 'Analizando la captura...';
  }

  const action = {
    id: 'action',
    title: 'Acción',
    time: linkedAction ? (linkedAction.completedAt ?? linkedAction.startedAt) : null,
    status: 'pending',
    detail: 'Pendiente de la intervención del centinela.',
  };

  if (aiFailed || (!hasAnalysis && !running)) {
    action.detail = aiFailed
      ? 'Sin procesar por fallo en el análisis.'
      : action.detail;
  } else if (linkedAction) {
    action.detail = sentinelLabel
      ? `Centinela ${sentinelLabel}${parcel ? ` · ${parcel.name}` : ''}`
      : linkedAction.queueReason ?? 'Comando enviado al centinela más cercano.';
    action.meta = linkedAction.status;
    action.status = linkedAction.status === 'completed'
      ? 'done'
      : linkedAction.status === 'failed'
        ? 'error'
        : 'active';
  } else if (hasAnalysis && needsSentinelAction(telemetryLog)) {
    action.status = running ? 'active' : 'pending';
    action.detail = 'Esperando intervención del centinela.';
  } else if (hasAnalysis) {
    action.detail = 'Sin acción requerida.';
  }

  return [capture, analysis, action];
}

function buildMissionRecord({
  id,
  flightId,
  parcel,
  point,
  telemetryLog,
  actionLog,
  imagePreview,
  sentinel,
}) {
  const ai = telemetryLog?.aiResponse;
  return {
    id,
    flightId,
    parcelId: parcel?.parcelId ?? sentinel?.parcelId,
    parcelName: parcel?.name ?? '—',
    point,
    imagePreview,
    createdAt: telemetryLog?.createdAt ?? new Date().toISOString(),
    problem: ai?.diagnosis ?? 'Sin diagnóstico',
    severity: ai?.severity ?? 0,
    recommendedAction: ai?.recommendedAction ?? 'none',
    actionStatus: actionLog?.status ?? (ai?.severity >= 0.6 ? 'pending' : 'none'),
    actionLabel: actionLog?.action ?? (ai?.recommendedAction === 'injection' ? 'inject' : ai?.recommendedAction),
    telemetryLog,
    actionLog,
    sentinelId: sentinel?.deviceId,
    sentinelLabel: sentinel ? getSentinelDisplayLabel(sentinel) : '',
    events: buildTimelineEvents({
      telemetryLog,
      actionLog,
      parcel,
      point,
      sentinel,
    }),
  };
}

export default function AdminMissionSimulator() {
  const [clients, setClients] = useState([]);
  const [devices, setDevices] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [userId, setUserId] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [parcelId, setParcelId] = useState('');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [ndvi, setNdvi] = useState(0.45);
  const [soilMoisture, setSoilMoisture] = useState(34);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageGallery, setImageGallery] = useState(() => loadImageGallery());
  const [selectedGalleryId, setSelectedGalleryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const [flightId, setFlightId] = useState('');
  const [telemetryLog, setTelemetryLog] = useState(null);
  const [actionLog, setActionLog] = useState(null);
  const [missionHistory, setMissionHistory] = useState([]);
  const [activeMissionId, setActiveMissionId] = useState('');
  const [ackSubmitting, setAckSubmitting] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const pollRef = useRef(null);
  const fileInputRef = useRef(null);

  const selectedParcel = useMemo(
    () => parcels.find((parcel) => parcel.parcelId === parcelId) ?? null,
    [parcels, parcelId],
  );

  const activeDrone = useMemo(
    () => resolveActiveDrone(devices),
    [devices],
  );

  const allSentinels = useMemo(
    () => filterSentinels(devices),
    [devices],
  );

  const nearestSentinelMatch = useMemo(
    () => findNearestSentinel(selectedPoint, allSentinels),
    [selectedPoint, allSentinels],
  );

  const nearestSentinel = nearestSentinelMatch?.sentinel ?? null;

  const missionRequirements = useMemo(() => [
    { id: 'point', label: 'Punto en el mapa', done: Boolean(selectedPoint && parcelId) },
    { id: 'drone', label: 'Dron activo', done: Boolean(activeDrone) },
    { id: 'image', label: 'Imagen del dron (opcional)', done: Boolean(imageFile), optional: true },
  ], [selectedPoint, parcelId, activeDrone, imageFile]);

  const canRunMission = missionRequirements
    .filter((item) => !item.optional)
    .every((item) => item.done);

  const activeMission = useMemo(
    () => missionHistory.find((mission) => mission.id === activeMissionId) ?? missionHistory[0] ?? null,
    [missionHistory, activeMissionId],
  );

  const timelineEvents = useMemo(() => {
    const telemetry = activeMission?.telemetryLog ?? telemetryLog;
    const action = activeMission?.actionLog ?? actionLog;
    const point = activeMission?.point ?? selectedPoint;
    const parcel = parcels.find((item) => item.parcelId === (activeMission?.parcelId ?? parcelId))
      ?? selectedParcel;
    const sentinel = devices.find((device) =>
      device.deviceId === (action?.deviceId ?? activeMission?.sentinelId),
    ) ?? nearestSentinel;

    return buildTimelineEvents({
      telemetryLog: telemetry,
      actionLog: action,
      parcel,
      point,
      sentinel,
      running: running && (!activeMission || activeMission.id === activeMissionId),
    });
  }, [
    activeMission,
    activeMissionId,
    telemetryLog,
    actionLog,
    selectedParcel,
    selectedPoint,
    devices,
    nearestSentinel,
    parcels,
    parcelId,
    running,
  ]);

  const missionMarkers = useMemo(
    () => missionHistory.map((mission) => ({
      id: mission.id,
      point: mission.point,
      label: `${mission.parcelName} · ${mission.problem.slice(0, 48)}`,
      status: mission.actionStatus === 'completed' ? 'completed' : mission.actionStatus === 'pending' ? 'pending' : 'scan',
      radius: 24,
    })),
    [missionHistory],
  );

  const actionZones = useMemo(() => {
    const source = activeMission ?? { actionLog, sentinelId: nearestSentinel?.deviceId };
    const action = isActionLinkedToMission(
      source.actionLog,
      source.telemetryLog ?? activeMission?.telemetryLog ?? telemetryLog,
    ) ? source.actionLog : null;
    if (!action) return [];

    const targetSentinel = devices.find((device) =>
      device.deviceId === (action.deviceId ?? source.sentinelId),
    ) ?? nearestSentinel;

    const coordinates = targetSentinel?.coordinates
      ? [targetSentinel.coordinates]
      : action.commandPayload?.targetCoordinates?.length
        ? action.commandPayload.targetCoordinates
        : selectedPoint
          ? [selectedPoint]
          : [];

    if (!coordinates.length) return [];

    return [{
      id: 'sentinel-action',
      label: targetSentinel
        ? `Centinela ${getSentinelDisplayLabel(targetSentinel)}`
        : 'Zona de inyección',
      status: action.status === 'completed' ? 'completed' : 'pending',
      coordinates,
      radius: 28,
    }];
  }, [activeMission, actionLog, telemetryLog, devices, nearestSentinel, selectedPoint]);

  const mapSentinels = useMemo(() => {
    const telemetry = activeMission?.telemetryLog ?? telemetryLog;
    const action = isActionLinkedToMission(activeMission?.actionLog ?? actionLog, telemetry)
      ? (activeMission?.actionLog ?? actionLog)
      : null;
    const targetId = action?.deviceId;
    const actionStatus = action?.status;

    return allSentinels.map((sentinel) => ({
      ...sentinel,
      actionStatus: sentinel.deviceId === targetId && (actionStatus === 'pending' || actionStatus === 'completed')
        ? actionStatus
        : undefined,
    }));
  }, [allSentinels, activeMission, actionLog, telemetryLog]);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const refreshMissionLogs = useCallback(async (activeFlightId, targetParcelId, clientUserId = userId) => {
    if (!clientUserId || !activeFlightId) return null;

    const [telemetryResponse, actionResponse] = await Promise.all([
      api.getClientTelemetryLogs(clientUserId),
      api.getClientActionLogs(clientUserId),
    ]);

    const logs = telemetryResponse.logs ?? [];
    const actions = actionResponse.logs ?? [];
    const latestTelemetry = logs.find((log) => log.flightId === activeFlightId) ?? null;
    const latestAction = latestTelemetry?.createdAt
      ? actions.find((log) => log.startedAt >= latestTelemetry.createdAt)
      : null;

    setTelemetryLog(latestTelemetry);
    setActionLog(latestAction);

    return { latestTelemetry, latestAction };
  }, [userId]);

  const upsertMissionHistory = useCallback((missionId, patch) => {
    setMissionHistory((current) => current.map((mission) => {
      if (mission.id !== missionId) return mission;
      const next = { ...mission, ...patch };
      next.events = buildTimelineEvents({
        telemetryLog: next.telemetryLog,
        actionLog: next.actionLog,
        parcel: parcels.find((parcel) => parcel.parcelId === (next.actionLog?.parcelId ?? next.parcelId)),
        point: next.point,
        sentinel: devices.find((device) => device.deviceId === (next.actionLog?.deviceId ?? next.sentinelId)),
        running: true,
      });
      if (next.actionLog?.deviceId) {
        next.sentinelId = next.actionLog.deviceId;
        const sentinel = devices.find((device) => device.deviceId === next.actionLog.deviceId);
        if (sentinel) {
          next.sentinelLabel = getSentinelDisplayLabel(sentinel);
          next.parcelId = sentinel.parcelId ?? next.parcelId;
          next.parcelName = parcels.find((parcel) => parcel.parcelId === next.parcelId)?.name ?? next.parcelName;
        }
      }
      return next;
    }));
  }, [parcels, devices]);

  const startPolling = useCallback((activeFlightId, targetParcelId, missionId, clientUserId) => {
    stopPolling();
    const startedAt = Date.now();

    pollRef.current = setInterval(async () => {
      try {
        const result = await refreshMissionLogs(activeFlightId, targetParcelId, clientUserId);
        if (result?.latestTelemetry || result?.latestAction) {
          upsertMissionHistory(missionId, {
            telemetryLog: result.latestTelemetry,
            actionLog: result.latestAction,
            problem: result.latestTelemetry?.aiResponse?.diagnosis ?? 'Procesando...',
            severity: result.latestTelemetry?.aiResponse?.severity ?? 0,
            recommendedAction: result.latestTelemetry?.aiResponse?.recommendedAction ?? 'none',
            actionStatus: result.latestAction?.status ?? 'none',
          });
        }

        const actionDone = result?.latestAction?.status === 'completed';
        const telemetryDone = result?.latestTelemetry?.status === 'processed'
          || result?.latestTelemetry?.status === 'failed';
        const timedOut = Date.now() - startedAt > POLL_TIMEOUT_MS;

        if ((telemetryDone && (!result?.latestAction || actionDone)) || timedOut) {
          stopPolling();
          setRunning(false);
        }
      } catch {
        stopPolling();
        setRunning(false);
      }
    }, POLL_INTERVAL_MS);
  }, [refreshMissionLogs, stopPolling, upsertMissionHistory]);

  useEffect(() => {
    api.getClients()
      .then((response) => {
        const nextClients = response.clients ?? [];
        setClients(nextClients);
        if (nextClients[0]?.userId) setUserId(nextClients[0].userId);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    return () => stopPolling();
  }, [stopPolling]);

  useEffect(() => {
    if (!userId) {
      setDevices([]);
      setParcels([]);
      setDeviceId('');
      setParcelId('');
      setSelectedPoint(null);
      setMissionHistory([]);
      return;
    }

    Promise.all([api.getClientDevices(userId), api.getClientParcels(userId)])
      .then(([devicesResponse, parcelsResponse]) => {
        const nextDevices = devicesResponse.devices ?? [];
        const nextParcels = parcelsResponse.parcels ?? [];
        setDevices(nextDevices);
        setParcels(nextParcels);
        setMissionHistory([]);
        setSelectedPoint(null);
        setParcelId('');
        setActiveMissionId('');

        const nextDrone = resolveActiveDrone(nextDevices);
        setDeviceId(nextDrone?.deviceId ?? '');
      })
      .catch((err) => setError(err.message));
  }, [userId]);

  useEffect(() => {
    if (!running || !activeMission?.parcelId) return;
    setParcelId(activeMission.parcelId);
  }, [running, activeMission?.parcelId]);

  useEffect(() => {
    if (activeDrone?.deviceId && activeDrone.deviceId !== deviceId) {
      setDeviceId(activeDrone.deviceId);
    }
  }, [activeDrone, deviceId]);

  const handleMapClick = (point) => {
    setError('');
    const nearest = findNearestSentinel(point, allSentinels);
    const containingParcel = findParcelAtPoint(point, parcels);
    const canSnapToSentinel = Boolean(nearest && nearest.distance <= MAX_SENTINEL_SNAP_METERS);

    if (!containingParcel && !canSnapToSentinel) {
      setSelectedPoint(point);
      setParcelId('');
      setError('El punto seleccionado no pertenece a ninguna parcela del cliente.');
      return;
    }

    setSelectedPoint(point);
    setParcelId(nearest?.sentinel.parcelId ?? containingParcel?.parcelId ?? '');
  };

  const handleImageFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Selecciona un archivo de imagen válido (JPG, PNG, WEBP).');
      return;
    }

    setError('');
    try {
      const base64 = await readImageAsBase64(file);
      const galleryItem = createGalleryItem(file, base64);
      const nextGallery = [galleryItem, ...imageGallery].slice(0, MAX_GALLERY_ITEMS);

      setImageGallery(nextGallery);
      saveImageGallery(nextGallery);
      setSelectedGalleryId(galleryItem.id);
      setImageFile({ file, base64, galleryId: galleryItem.id });
      setImagePreview(toImagePreview(base64));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectGalleryImage = (item) => {
    setError('');
    setSelectedGalleryId(item.id);
    setImageFile({ file: null, base64: item.base64, galleryId: item.id });
    setImagePreview(toImagePreview(item.base64));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveGalleryImage = (itemId) => {
    const nextGallery = imageGallery.filter((item) => item.id !== itemId);
    setImageGallery(nextGallery);
    saveImageGallery(nextGallery);

    if (selectedGalleryId === itemId) {
      setSelectedGalleryId('');
      setImageFile(null);
      setImagePreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setSelectedGalleryId('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleImageFile(file);
  };

  const handleImageDrop = async (event) => {
    event.preventDefault();
    setIsDraggingImage(false);
    const file = event.dataTransfer.files?.[0];
    if (file) await handleImageFile(file);
  };

  const handleRunMission = async () => {
    setError('');
    setRunning(true);
    setFlightId('');
    setTelemetryLog(null);
    setActionLog(null);

    try {
      if (!userId) throw new Error('Selecciona un cliente.');
      if (!selectedPoint) throw new Error('Haz clic en el mapa para seleccionar el punto de captura.');

      const nearest = findNearestSentinel(selectedPoint, allSentinels);
      const targetParcel = parcels.find((parcel) => parcel.parcelId === nearest?.sentinel.parcelId)
        ?? selectedParcel;
      const targetParcelId = targetParcel?.parcelId ?? parcelId;

      if (!targetParcelId || !targetParcel) throw new Error('El punto debe estar dentro de una parcela.');
      if (!activeDrone?.deviceId) throw new Error('Este cliente no tiene un dron activo registrado.');

      setParcelId(targetParcelId);

      const payload = {
        status: 'completed',
        ndvi,
        soilMoisture,
        nitrogen: 25,
        phosphorus: 20,
        potassium: 32,
        batteryLevel: 78,
        coordinates: [selectedPoint],
        timestamp: new Date().toISOString(),
      };

      if (imageFile?.base64) {
        payload.imageBase64 = imageFile.base64;
      }

      const response = await api.runAdminTestDroneFlow({
        userId,
        deviceId: activeDrone.deviceId,
        parcelId: targetParcelId,
        payload,
      });

      const nextFlightId = response.flight.flightId;
      const missionId = `mission-${Date.now()}`;
      const missionRecord = buildMissionRecord({
        id: missionId,
        flightId: nextFlightId,
        parcel: targetParcel,
        point: selectedPoint,
        telemetryLog: null,
        actionLog: null,
        imagePreview,
        sentinel: nearest?.sentinel,
      });

      setFlightId(nextFlightId);
      setActiveMissionId(missionId);
      setMissionHistory((current) => [missionRecord, ...current]);

      const result = await refreshMissionLogs(nextFlightId, targetParcelId, userId);
      if (result?.latestTelemetry || result?.latestAction) {
        upsertMissionHistory(missionId, {
          telemetryLog: result.latestTelemetry,
          actionLog: result.latestAction,
          problem: result.latestTelemetry?.aiResponse?.diagnosis ?? 'Procesando imagen...',
          severity: result.latestTelemetry?.aiResponse?.severity ?? 0,
          recommendedAction: result.latestTelemetry?.aiResponse?.recommendedAction ?? 'none',
          actionStatus: result.latestAction?.status ?? 'none',
        });
      }

      startPolling(nextFlightId, targetParcelId, missionId, userId);
    } catch (err) {
      setError(err.message);
      setRunning(false);
    }
  };

  const handleSimulateAck = async () => {
    const targetAction = activeMission?.actionLog ?? actionLog;
    if (!targetAction?.actionId) return;

    setAckSubmitting(true);
    setError('');
    try {
      await api.sendAdminActionAck({
        userId,
        deviceId: targetAction.deviceId,
        actionId: targetAction.actionId,
        status: 'completed',
        details: 'Injection completed successfully in mission simulator.',
      });

      const result = await refreshMissionLogs(
        activeMission?.flightId ?? flightId,
        activeMission?.parcelId ?? parcelId,
        userId,
      );

      if (activeMission) {
        upsertMissionHistory(activeMission.id, {
          actionLog: { ...targetAction, status: 'completed', completedAt: new Date().toISOString() },
          actionStatus: 'completed',
        });
      } else if (result?.latestAction) {
        setActionLog(result.latestAction);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setAckSubmitting(false);
    }
  };

  const handleSelectMission = (mission) => {
    setActiveMissionId(mission.id);
    setParcelId(mission.parcelId);
    setSelectedPoint(mission.point);
    setTelemetryLog(mission.telemetryLog);
    setActionLog(mission.actionLog);
    if (mission.imagePreview) setImagePreview(mission.imagePreview);
  };

  if (loading) return <p className="page-state">{ui.common.loadingSession}</p>;

  const mapParcels = parcels.filter((parcel) => parcel.coordinates?.length);

  return (
    <div className="page admin-missions-page">
      <div className="page-head admin-clients-head">
        <div>
          <h1>{ui.missionSimulator.title}</h1>
          <p>{ui.missionSimulator.subtitle}</p>
        </div>
        <div className="admin-head-actions admin-missions-head-actions">
          <select value={userId} onChange={(event) => setUserId(event.target.value)}>
            <option value="">Seleccionar cliente</option>
            {clients.map((client) => (
              <option key={client.userId} value={client.userId}>
                {client.displayName}
              </option>
            ))}
          </select>
          {activeDrone ? (
            <div className="mission-drone-badge" title="Cada cuenta tiene un solo dron activo">
              <span className="material-symbols-outlined" aria-hidden="true">flight</span>
              <span>{activeDrone.name}</span>
              <StatusBadge
                status={activeDrone.status === 'online' ? 'green' : activeDrone.status === 'lowBattery' ? 'yellow' : 'red'}
                label={activeDrone.status}
              />
            </div>
          ) : (
            <p className="mission-drone-missing">Sin dron activo</p>
          )}
        </div>
      </div>

      <div className="admin-missions-workspace">
        <section className="card admin-missions-map-card">
          <div className="admin-missions-map-head">
            <div>
              <h2>Mapa de parcelas</h2>
              <p className="map-meta">
                {mapParcels.length} parcela{mapParcels.length === 1 ? '' : 's'} · clic para seleccionar punto de captura
              </p>
            </div>
            {selectedPoint && (
              <div className="mission-point-badge">
                <span>{formatCoordinates(selectedPoint)}</span>
                {selectedParcel && <strong>{selectedParcel.name}</strong>}
                {nearestSentinel && (
                  <span>Centinela {getSentinelDisplayLabel(nearestSentinel)}</span>
                )}
              </div>
            )}
          </div>

          {mapParcels.length ? (
            <MissionParcelMap
              parcels={mapParcels}
              selectedParcelId={parcelId}
              selectedPoint={selectedPoint}
              missionMarkers={missionMarkers}
              actionZones={actionZones}
              sentinels={mapSentinels}
              onMapClick={handleMapClick}
            />
          ) : (
            <p className="page-state">Este cliente no tiene parcelas con coordenadas.</p>
          )}
        </section>

        <aside className="card admin-missions-side">
          <h2>Ejecutar misión</h2>

          <div className="mission-side-block">
            <p className="stat-label">Punto seleccionado</p>
            {selectedPoint ? (
              <>
                <p className="mission-side-value">{formatCoordinates(selectedPoint)}</p>
                <p className="map-meta">
                  {selectedParcel
                    ? `Parcela: ${selectedParcel.name}${nearestSentinel ? ` · Centinela ${getSentinelDisplayLabel(nearestSentinel)}` : ''}`
                    : 'Fuera de parcela — selecciona un área dentro del polígono.'}
                </p>
              </>
            ) : (
              <p className="map-meta">Haz clic en el mapa para detectar coordenadas y parcela.</p>
            )}
          </div>

          <div className="form mission-side-form">
            <label>
              NDVI simulado
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={ndvi}
                onChange={(event) => setNdvi(Number(event.target.value))}
              />
            </label>
            <label>
              Humedad del suelo (%)
              <input
                type="number"
                min="0"
                max="100"
                value={soilMoisture}
                onChange={(event) => setSoilMoisture(Number(event.target.value))}
              />
            </label>
          </div>

          <div className="mission-upload-section">
            <div className="mission-upload-head">
              <p className="stat-label">Imagen del dron</p>
              <span className="mission-upload-optional">Opcional</span>
            </div>

            {imageGallery.length > 0 && (
              <div className="mission-gallery">
                <div className="mission-gallery-head">
                  <p className="map-meta">Galería de imágenes subidas aquí</p>
                  <span className="mission-gallery-count">{imageGallery.length}</span>
                </div>
                <div className="mission-gallery-grid">
                  {imageGallery.map((item) => (
                    <div
                      key={item.id}
                      className={item.id === selectedGalleryId ? 'mission-gallery-item active' : 'mission-gallery-item'}
                    >
                      <button
                        type="button"
                        className="mission-gallery-select"
                        onClick={() => handleSelectGalleryImage(item)}
                        title={item.name}
                      >
                        <img src={toImagePreview(item.base64)} alt={item.name} />
                        <span className="mission-gallery-name">{item.name}</span>
                      </button>
                      <button
                        type="button"
                        className="mission-gallery-remove"
                        onClick={() => handleRemoveGalleryImage(item.id)}
                        aria-label={`Eliminar ${item.name} de la galería`}
                      >
                        <span className="material-symbols-outlined" aria-hidden="true">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              id="mission-image-input"
              className="mission-upload-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {imagePreview ? (
              <div className="mission-image-preview">
                <img src={imagePreview} alt="Vista previa de captura del dron" />
                <div className="mission-image-actions">
                  <button type="button" className="btn-secondary" onClick={handleRemoveImage}>
                    Quitar selección
                  </button>
                </div>
              </div>
            ) : (
              <p className="map-meta mission-gallery-hint">
                Selecciona una imagen de la galería o sube una nueva desde tu PC.
              </p>
            )}

            <label
              htmlFor="mission-image-input"
              className={`mission-upload-dropzone mission-upload-dropzone--compact ${isDraggingImage ? 'mission-upload-dropzone--active' : ''}`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDraggingImage(true);
              }}
              onDragLeave={() => setIsDraggingImage(false)}
              onDrop={handleImageDrop}
            >
              <span className="material-symbols-outlined" aria-hidden="true">upload_file</span>
              <strong>Subir nueva imagen desde tu PC</strong>
              <span className="mission-upload-formats">JPG, PNG, WEBP</span>
            </label>
          </div>

          <ul className="mission-requirements">
            {missionRequirements.map((item) => (
              <li
                key={item.id}
                className={item.done ? 'mission-requirement mission-requirement--done' : 'mission-requirement'}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  {item.done ? 'check_circle' : item.optional ? 'radio_button_unchecked' : 'error'}
                </span>
                {item.label}
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="btn-primary mission-run-btn"
            onClick={handleRunMission}
            disabled={running || !canRunMission}
            title={!canRunMission ? 'Completa los requisitos obligatorios para ejecutar la misión' : undefined}
          >
            <span className="material-symbols-outlined" aria-hidden="true">play_arrow</span>
            {running ? 'Ejecutando misión...' : 'Ejecutar misión'}
          </button>

          {isActionLinkedToMission(
            activeMission?.actionLog ?? actionLog,
            activeMission?.telemetryLog ?? telemetryLog,
          ) && (activeMission?.actionLog ?? actionLog)?.status === 'pending' && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handleSimulateAck}
              disabled={ackSubmitting}
            >
              {ackSubmitting ? 'Confirmando...' : 'Simular ejecución del centinela'}
            </button>
          )}

          {error && <p className="form-error">{error}</p>}
        </aside>
      </div>

      <section className="card admin-missions-timeline-card">
        <div className="admin-missions-timeline-head">
          <div>
            <h2>Timeline de la misión</h2>
            <p className="map-meta">Captura → análisis → acción</p>
          </div>
          {activeMission?.telemetryLog?.aiResponse && (
            <div className="mission-timeline-summary">
              <StatusBadge
                status={activeMission.severity >= 0.6 ? 'yellow' : 'green'}
                label={`${(activeMission.severity * 100).toFixed(0)}% severidad`}
              />
              <span>{ACTION_LABELS[activeMission.recommendedAction] ?? activeMission.recommendedAction}</span>
            </div>
          )}
        </div>

        {missionHistory.length > 1 && (
          <div className="mission-history-tabs">
            {missionHistory.map((mission) => (
              <button
                key={mission.id}
                type="button"
                className={mission.id === activeMissionId ? 'mission-history-tab active' : 'mission-history-tab'}
                onClick={() => handleSelectMission(mission)}
              >
                {mission.parcelName} · {new Date(mission.createdAt).toLocaleTimeString()}
              </button>
            ))}
          </div>
        )}

        <ol className="mission-timeline">
          {timelineEvents.map((event, index) => (
            <li key={event.id} className={`mission-timeline-item mission-timeline-item--${event.status}`}>
              <div className="mission-timeline-track">
                <span className="mission-timeline-dot" />
                {index < timelineEvents.length - 1 && <span className="mission-timeline-line" />}
              </div>
              <div className="mission-timeline-content">
                <div className="mission-timeline-top">
                  <strong>{event.title}</strong>
                  <time>{event.time ? new Date(event.time).toLocaleTimeString() : '—'}</time>
                </div>
                <p>{event.detail}</p>
                {event.meta && <span className="mission-timeline-meta">{event.meta}</span>}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
