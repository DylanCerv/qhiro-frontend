import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { formatDate, getFlightStatusLabel, ui } from '../i18n/es';

export default function FlightHistory() {
  const [activity, setActivity] = useState([]);
  const [devices, setDevices] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloadingReportId, setDownloadingReportId] = useState(null);
  const [retryingActionId, setRetryingActionId] = useState('');

  useEffect(() => {
    api
      .getActivity()
      .then((res) => {
        setActivity(res.activity ?? []);
        setDevices(res.devices ?? []);
        setParcels(res.parcels ?? []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const parcelNameById = useMemo(
    () => new Map(parcels.map((parcel) => [parcel.parcelId, parcel.name])),
    [parcels],
  );

  const deviceNameById = useMemo(
    () => new Map(devices.map((device) => [device.deviceId, device.name])),
    [devices],
  );

  const summary = useMemo(() => ({
    reports: activity.filter((item) => item.kind === 'report').length,
    alerts: activity.filter((item) => item.kind === 'alert').length,
    actions: activity.filter((item) => item.kind === 'action').length,
    pendingActions: activity.filter((item) => item.kind === 'action' && item.status === 'pending').length,
  }), [activity]);

  const handleDownload = async (reportId) => {
    setDownloadingReportId(reportId);
    setError('');
    try {
      await api.downloadReport(reportId);
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloadingReportId(null);
    }
  };

  const handleRetryAction = async (actionId) => {
    setRetryingActionId(actionId);
    setError('');
    try {
      await api.retryAction(actionId);
      const res = await api.getActivity();
      setActivity(res.activity ?? []);
      setDevices(res.devices ?? []);
      setParcels(res.parcels ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setRetryingActionId('');
    }
  };

  const getActionStatusLabel = (status) => {
    if (status === 'completed') return 'Solventado';
    if (status === 'failed') return 'Falló';
    if (status === 'pending') return 'Pendiente';
    if (status === 'unread') return 'Nueva';
    if (status === 'read') return 'Leída';
    if (status === 'critical') return 'Crítica';
    if (status === 'warning') return 'Advertencia';
    if (status === 'info') return 'Informativa';
    if (status === 'scheduled') return 'Programado';
    return status;
  };

  const getParcelName = (parcelId) => parcelNameById.get(parcelId) ?? 'Parcela';
  const getDeviceName = (deviceId) => deviceNameById.get(deviceId) ?? 'Centinela';

  if (loading) return <p className="page-state">Cargando actividad…</p>;
  if (error && activity.length === 0) {
    return <p className="page-state error">{ui.common.error}: {error}</p>;
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Actividad</h1>
        <p>Alertas, informes, vuelos y acciones del cultivo en una sola vista.</p>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="grid-2">
        <section className="card">
          <h2>Informes</h2>
          <p className="stat-value">{summary.reports}</p>
          <p className="stat-label">informes generados</p>
        </section>
        <section className="card">
          <h2>Alertas</h2>
          <p className="stat-value">{summary.alerts}</p>
          <p className="stat-label">alertas registradas</p>
        </section>
        <section className="card">
          <h2>Acciones</h2>
          <p className="stat-value">{summary.actions}</p>
          <p className="stat-label">{summary.pendingActions} pendientes</p>
        </section>
        <section className="card">
          <h2>Estado</h2>
          <p className="stat-label">Todo se ve por nombre de parcela o dispositivo, no por UID.</p>
        </section>
      </div>

      <section className="card">
        <h2>Actividad reciente</h2>
        {activity.length === 0 ? (
          <p className="empty-state">Todavía no hay actividad registrada.</p>
        ) : (
          <ul className="simple-list">
            {activity.map((item) => {
              const parcelName = getParcelName(item.parcelId);
              const isReport = item.kind === 'report';
              const isAction = item.kind === 'action';
              const isFlight = item.kind === 'flight';
              const isAlert = item.kind === 'alert';
              const statusLabel = item.kind === 'flight'
                ? getFlightStatusLabel(item.status)
                : item.kind === 'report'
                  ? getActionStatusLabel(item.status)
                  : getActionStatusLabel(item.status);
              return (
                <li key={item.id}>
                  <div className="stat-row" style={{ alignItems: 'center' }}>
                    <strong>{item.title}</strong>
                    <StatusBadge status={item.status} label={statusLabel} />
                  </div>
                  <span>Parcela: {parcelName}</span>
                  <span>Fecha: {formatDate(item.date)}</span>
                  {isReport && <span>Diagnóstico: {item.diagnosis}</span>}
                  {isReport && <span>Severidad: {item.severity.toFixed(2)}</span>}
                  {isAlert && <span>Mensaje: {item.message}</span>}
                  {isFlight && <span>Estado del vuelo: {getFlightStatusLabel(item.status)}</span>}
                  {isAction && <span>Dispositivo: {getDeviceName(item.deviceId)}</span>}
                  {isAction && item.durationMs ? <span>Duración: {item.durationMs} ms</span> : null}
                  {isAction && item.queueReason ? <span>Motivo: {item.queueReason}</span> : null}
                  {isAction && item.error ? <span>Error: {item.error}</span> : null}
                  <div className="list-actions">
                    {isReport && (
                      <button
                        type="button"
                        className="btn-secondary"
                        disabled={downloadingReportId === item.reportId}
                        onClick={() => handleDownload(item.reportId)}
                      >
                        {downloadingReportId === item.reportId ? 'Descargando…' : 'Ver informe'}
                      </button>
                    )}
                    {isAction && item.status === 'pending' && (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => handleRetryAction(item.actionId)}
                        disabled={retryingActionId === item.actionId}
                      >
                        {retryingActionId === item.actionId ? 'Reintentando…' : 'Ejecutar acción'}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
