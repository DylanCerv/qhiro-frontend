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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      setLoading(false);
      return;
    }
    api
      .getDashboard()
      .then(setData)
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

  return (
    <div className="page">
      <div className="page-head">
        <h1>{ui.dashboard.title}</h1>
        <p>{ui.dashboard.subtitle}</p>
        <ParcelSelector />
      </div>

      <div className="grid-2">
        <section className="card">
          <h2>{ui.dashboard.parcelHealth}</h2>
          {activeParcel ? (
            <div className="stat-block">
              <p className="stat-label">{activeParcel.name}</p>
              <p className="stat-value">{getCropTypeLabel(activeParcel.cropType)}</p>
              <div className="stat-row">
                <StatusBadge
                  status={activeParcel.healthStatus}
                  label={getHealthLabel(activeParcel.healthStatus)}
                />
                <span>NDVI {activeParcel.ndvi?.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div>
              <p className="empty-state">{ui.dashboard.noParcels}</p>
              <Link to="/app/parcels" className="btn-primary inline-link">
                {ui.dashboard.createParcelLink}
              </Link>
            </div>
          )}
        </section>

        <section className="card">
          <h2>{ui.dashboard.nextFlight}</h2>
          {data.nextScheduledFlight ? (
            <div className="stat-block">
              <p className="stat-value">{formatDate(data.nextScheduledFlight.nextRunAt)}</p>
              <p className="stat-label">
                {ui.dashboard.parcelLabel}: {data.nextScheduledFlight.parcelId}
              </p>
              <p className="stat-label">
                {formatFrequency(data.nextScheduledFlight.frequencyDays)}
              </p>
            </div>
          ) : (
            <p className="empty-state">{ui.dashboard.noFlightsScheduled}</p>
          )}
        </section>
      </div>

      <section className="card">
        <h2>{ui.dashboard.ndviMap}</h2>
        <ParcelMap
          parcels={data.parcels}
          center={mapCenter}
          selectedParcelId={selectedParcelId}
          onSelectParcel={setSelectedParcelId}
          interactive
          tileStyle="satellite"
        />
      </section>

      <section className="card">
        <h2>{ui.dashboard.recentAlerts}</h2>
        <AlertList alerts={alertsToShow} />
      </section>
    </div>
  );
}
