import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { auth, collection, db, limit, onSnapshot, orderBy, query, where } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useParcels } from '../context/ParcelContext';
import AlertList from '../components/AlertList';
import ParcelMap from '../components/ParcelMap';
import ParcelSelector from '../components/ParcelSelector';
import StatusBadge from '../components/StatusBadge';
import {
  formatDate,
  formatFrequency,
  getCropTypeLabel,
  getHealthLabel,
  ui,
} from '../i18n/es';

export default function Dashboard() {
  const { profile, isAdmin } = useAuth();
  const { selectedParcel, selectedParcelId, setSelectedParcelId } = useParcels();
  const [data, setData] = useState(null);
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [actionLogs, setActionLogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retryingActionId, setRetryingActionId] = useState('');

  useEffect(() => {
    if (isAdmin) {
      setLoading(false);
      return;
    }
    Promise.all([api.getDashboard(), api.getActionLogs()])
      .then(([dashboardData, actionData]) => {
        setData(dashboardData);
        setActionLogs(actionData.logs ?? []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  useEffect(() => {
    if (!profile?.userId || !db || !auth?.currentUser) return undefined;

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    const alertsQuery = query(
      collection(db, 'alerts'),
      where('userId', '==', profile.userId),
      orderBy('createdAt', 'desc'),
      limit(20),
    );

    let isFirstSnapshot = true;
    const unsubscribe = onSnapshot(alertsQuery, (snapshot) => {
      const alerts = snapshot.docs.map((doc) => doc.data());
      setLiveAlerts(alerts);

      if (isFirstSnapshot) {
        isFirstSnapshot = false;
        return;
      }

      if (Notification.permission === 'granted') {
        snapshot.docChanges().forEach((change) => {
          if (change.type !== 'added') return;
          const alert = change.doc.data();
          new Notification('Qhiro Symbiotic', {
            body: alert.message ?? 'Nueva alerta detectada',
          });
        });
      }
    });

    return () => unsubscribe();
  }, [profile?.userId]);

  const alertsToShow = useMemo(() => {
    if (liveAlerts.length > 0) return liveAlerts;
    return data?.alerts ?? [];
  }, [data?.alerts, liveAlerts]);

  if (isAdmin) {
    return (
      <div className="page">
        <div className="page-head">
          <h1>{ui.admin.title}</h1>
          <p>{ui.admin.subtitle}</p>
        </div>
        <Link to="/app/admin/clients" className="btn-primary inline-link">
          {ui.nav.admin}
        </Link>
      </div>
    );
  }

  if (loading) return <p className="page-state">{ui.common.loadingDashboard}</p>;
  if (error) return <p className="page-state error">{ui.common.error}: {error}</p>;

  const activeParcel = selectedParcel ?? data.parcels?.[0] ?? null;
  const mapCenter = profile?.location ?? data.user?.location;
  const parcelNameById = new Map((data.parcels ?? []).map((parcel) => [parcel.parcelId, parcel.name]));
  const deviceNameById = new Map((data.devices ?? []).map((device) => [device.deviceId, device.name]));
  const visibleActions = activeParcel
    ? actionLogs.filter((action) => action.parcelId === activeParcel.parcelId)
    : actionLogs;
  const getActionStatusLabel = (status) => {
    if (status === 'completed') return 'Solventado';
    if (status === 'failed') return 'Requiere atención';
    return 'Pendiente del centinela';
  };

  const handleRetryAction = async (actionId) => {
    setRetryingActionId(actionId);
    setError(null);
    try {
      await api.retryAction(actionId);
      const [dashboardData, actionData] = await Promise.all([api.getDashboard(), api.getActionLogs()]);
      setData(dashboardData);
      setActionLogs(actionData.logs ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setRetryingActionId('');
    }
  };

  return (
    <div className="page dashboard-page">
      <header className="page-head dashboard-head">
        <div>
          <p className="page-eyebrow">Misión Control · {activeParcel?.name ?? 'Sin parcela'}</p>
          <h1>
            Panel de Control{activeParcel ? ` - Parcela: ${activeParcel.name} (${getCropTypeLabel(activeParcel.cropType)})` : ''}
          </h1>
        </div>
        <div className="dashboard-head-actions">
          <ParcelSelector />
          <Link to="/app/flights" className="btn-secondary">Reporte NDVI</Link>
          <Link to="/app/schedule" className="btn-primary">Misión Manual</Link>
        </div>
      </header>

      <div className="dashboard-kpis">
        <section className="card dashboard-kpi">
          <div className="dashboard-kpi-head">
            <span>Salud de parcela</span>
            {activeParcel && (
              <StatusBadge
                status={activeParcel.healthStatus}
                label={getHealthLabel(activeParcel.healthStatus)}
              />
            )}
          </div>
          {activeParcel ? (
            <>
              <p className="dashboard-kpi-value">
                {Math.round((activeParcel.ndvi ?? 0) * 100)}%
              </p>
              <p className="dashboard-kpi-note">
                NDVI {activeParcel.ndvi?.toFixed(2)} · {activeParcel.name}
              </p>
              <div className="dashboard-progress">
                <span style={{ width: `${Math.round((activeParcel.ndvi ?? 0) * 100)}%` }} />
              </div>
            </>
          ) : (
            <Link to="/app/parcels" className="btn-primary inline-link">
              {ui.dashboard.createParcelLink}
            </Link>
          )}
        </section>

        <section className="card dashboard-kpi">
          <div className="dashboard-kpi-head">
            <span>Próximo vuelo</span>
            <span className="material-symbols-outlined dashboard-blue">schedule</span>
          </div>
          {data.nextScheduledFlight ? (
            <>
              <p className="dashboard-kpi-time">{formatDate(data.nextScheduledFlight.nextRunAt)}</p>
              <p className="dashboard-kpi-note">
                {parcelNameById.get(data.nextScheduledFlight.parcelId) ?? 'Parcela'} ·{' '}
                {formatFrequency(data.nextScheduledFlight.frequencyDays)}
              </p>
            </>
          ) : (
            <p className="empty-state">{ui.dashboard.noFlightsScheduled}</p>
          )}
        </section>

        <section className="card dashboard-kpi">
          <div className="dashboard-kpi-head">
            <span>Alertas activas</span>
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <p className="dashboard-kpi-value">{alertsToShow.length}</p>
          <p className="dashboard-kpi-note">
            {alertsToShow.length ? 'Requieren revisión operativa' : 'Sistema operando con normalidad'}
          </p>
        </section>
      </div>

      <div className="dashboard-workspace">
        <section className="card dashboard-map-card">
          <div className="dashboard-card-toolbar">
            <h2>Vista Satelital Live</h2>
            <div className="dashboard-map-tabs" aria-label="Capas del mapa">
              <button type="button" className="active">Mapa</button>
              <button type="button">NDVI</button>
              <button type="button">Térmico</button>
            </div>
          </div>
          <ParcelMap
            parcels={data.parcels}
            center={mapCenter}
            selectedParcelId={selectedParcelId}
            onSelectParcel={setSelectedParcelId}
            interactive
            tileStyle="satellite"
          />
          <div className="dashboard-map-meta">
            <span>Parcela: {activeParcel?.name ?? 'N/A'}</span>
            <span>NDVI: {activeParcel?.ndvi?.toFixed(2) ?? 'N/A'}</span>
            <span>Actualización: tiempo real</span>
          </div>
        </section>

        <aside className="dashboard-side">
          <section className="card">
            <h2>Alertas Recientes</h2>
            <AlertList alerts={alertsToShow.slice(0, 3)} />
            <Link to="/app/flights" className="btn-secondary dashboard-full-button">
              Ver historial
            </Link>
          </section>

          <section className="card">
            <h2>Actividad en Campo</h2>
            {visibleActions.length === 0 ? (
              <p className="empty-state">Sin intervenciones activas.</p>
            ) : (
              <ul className="simple-list dashboard-actions-list">
                {visibleActions.slice(0, 3).map((action) => (
                  <li key={action.actionId}>
                    <strong>{action.action}</strong>
                    <StatusBadge status={action.status} label={getActionStatusLabel(action.status)} />
                    <span>{deviceNameById.get(action.deviceId) ?? 'Centinela'}</span>
                    {action.status === 'pending' && (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => handleRetryAction(action.actionId)}
                        disabled={retryingActionId === action.actionId}
                      >
                        {retryingActionId === action.actionId ? 'Reintentando...' : 'Ejecutar acción'}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
