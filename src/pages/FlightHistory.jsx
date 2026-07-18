import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { ui } from '../i18n/es';

const filterTabs = [
  { id: 'all', label: 'Todos', icon: 'apps' },
  { id: 'flight', label: 'Vuelos', icon: 'flight' },
  { id: 'alert', label: 'Alertas', icon: 'warning' },
  { id: 'report', label: 'Reportes', icon: 'description' },
  { id: 'action', label: 'Intervenciones', icon: 'precision_manufacturing' },
];

export default function FlightHistory() {
  const [activity, setActivity] = useState([]);
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloadingReportId, setDownloadingReportId] = useState(null);
  const [retryingActionId, setRetryingActionId] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 4;

  useEffect(() => {
    api
      .getActivity()
      .then((res) => {
        setActivity(res.activity ?? []);
        setDevices(res.devices ?? []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const summary = useMemo(() => ({
    reports: activity.filter((item) => item.kind === 'report').length,
    alerts: activity.filter((item) => item.kind === 'alert').length,
    actions: activity.filter((item) => item.kind === 'action').length,
    flights: activity.filter((item) => item.kind === 'flight').length,
    pendingActions: activity.filter((item) => item.kind === 'action' && item.status === 'pending').length,
  }), [activity]);

  const deviceSummary = useMemo(() => ({
    online: devices.filter((device) => device.status === 'online').length,
    lowBattery: devices.filter((device) => device.status === 'lowBattery').length,
    offline: devices.filter((device) => device.status === 'offline').length,
    total: devices.length,
  }), [devices]);

  const firstReport = useMemo(
    () => activity.find((item) => item.kind === 'report'),
    [activity],
  );

  const filteredCards = useMemo(() => {
    if (activeFilter === 'all') return activity;
    return activity.filter((item) => item.kind === activeFilter);
  }, [activity, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCards.length / cardsPerPage));

  const visibleCards = useMemo(() => {
    const start = (currentPage - 1) * cardsPerPage;
    return filteredCards.slice(start, start + cardsPerPage);
  }, [cardsPerPage, currentPage, filteredCards]);

  const workflowBars = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0, 0, 0];
    activity.forEach((item, index) => {
      buckets[index % buckets.length] += item.kind === 'alert' ? 2 : item.kind === 'action' ? 1.5 : 1;
    });
    return buckets.map((value, index) => ({ id: index, value: Math.min(100, Math.round((value / Math.max(1, activity.length)) * 100)) }));
  }, [activity]);

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
  const getCardKicker = (item) => {
    if (item.kind === 'alert') return 'ALERTA CRÍTICA';
    if (item.kind === 'flight') return 'MISIÓN COMPLETADA';
    if (item.kind === 'action') return 'INTERVENCIÓN DE HARDWARE';
    if (item.kind === 'report') return 'SISTEMA · REPORTES';
    return 'ACTIVIDAD';
  };

  const getCardClassName = (item) => {
    if (item.kind === 'alert') return 'activity-card activity-alert-card';
    if (item.kind === 'flight') return 'activity-card activity-flight-card';
    if (item.kind === 'action') return 'activity-card activity-action-card';
    if (item.kind === 'report') return 'activity-card activity-report-card';
    return 'activity-card';
  };

  const getCardDescription = (item) => {
    if (item.kind === 'alert') return item.message ?? item.description ?? 'Alerta registrada en el sistema.';
    if (item.kind === 'flight') return item.summary ?? item.description ?? 'Vuelo completado con éxito.';
    if (item.kind === 'action') return item.description ?? item.queueReason ?? 'Intervención ejecutada sobre el dispositivo.';
    if (item.kind === 'report') return item.description ?? item.diagnosis ?? 'Reporte consolidado generado por el sistema.';
    return item.description ?? '';
  };

  const getCardBody = (item) => {
    if (item.kind === 'flight') {
      return (
        <>
          <div className="activity-flight-stats">
            <div>
              <span>Salud NDVI</span>
              <strong>{item.ndviLabel ?? '0.82 (Óptimo)'}</strong>
            </div>
            <div>
              <span>Estado batería</span>
              <strong>{item.batteryLabel ?? '94% (Carga Ok)'}</strong>
            </div>
          </div>
          <Link to="/app" className="activity-link">
            Ver mapa NDVI
            <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
          </Link>
        </>
      );
    }

    if (item.kind === 'alert') {
      return (
        <div className="activity-card-actions">
          <button type="button" className="activity-action-btn activity-action-btn--danger">
            Intervenir ahora
          </button>
          <button type="button" className="activity-action-btn">
            Detalles térmicos
          </button>
        </div>
      );
    }

    if (item.kind === 'report') {
      return (
        <button
          type="button"
          className="activity-download-btn"
          onClick={() => handleDownload(item.reportId ?? firstReport?.reportId)}
          disabled={downloadingReportId === (item.reportId ?? firstReport?.reportId)}
        >
          <span className="material-symbols-outlined" aria-hidden="true">picture_as_pdf</span>
          <span>
            {downloadingReportId === (item.reportId ?? firstReport?.reportId) ? 'Descargando…' : 'Descargar PDF (4.8MB)'}
          </span>
        </button>
      );
    }

    return null;
  };

  const getCardTime = (item) => item.timeLabel ?? item.dateLabel ?? 'Hoy';

  if (loading) return <p className="page-state">Cargando actividad…</p>;
  if (error && activity.length === 0) {
    return <p className="page-state error">{ui.common.error}: {error}</p>;
  }

  return (
    <div className="page activity-page">
      <div className="page-head activity-head">
        <div className="activity-head-copy">
          <p className="page-eyebrow">Panel de Control</p>
          <h1>Historial de Actividad</h1>
        </div>
        <button type="button" className="btn-primary activity-export-button">
          <span className="material-symbols-outlined" aria-hidden="true">download</span>
          <span>Exportar data</span>
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="activity-tabs" role="tablist" aria-label="Filtrar actividad">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeFilter === tab.id}
            className={activeFilter === tab.id ? 'activity-tab active' : 'activity-tab'}
            onClick={() => setActiveFilter(tab.id)}
          >
            <span className="material-symbols-outlined" aria-hidden="true">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="activity-layout">
        <div className="activity-main-column">
          {visibleCards.length === 0 ? (
            <section className="activity-empty-card">
              <p>No hay información para este filtro.</p>
            </section>
          ) : (
            visibleCards.map((item) => (
              <section key={item.id ?? `${item.kind}-${item.date ?? item.title}`} className={getCardClassName(item)}>
                <div className="activity-card-head">
                  <span className={item.kind === 'flight'
                    ? 'activity-card-kicker activity-card-kicker--green'
                    : item.kind === 'action'
                      ? 'activity-card-kicker activity-card-kicker--blue'
                      : item.kind === 'report'
                        ? 'activity-card-kicker activity-card-kicker--muted'
                        : 'activity-card-kicker'}
                  >
                    {getCardKicker(item)}
                  </span>
                  <span className="activity-card-time">{getCardTime(item)}</span>
                </div>
                <h2>{item.title ?? 'Sin título'}</h2>
                <p>{getCardDescription(item)}</p>
                {getCardBody(item)}
              </section>
            ))
          )}

          {filteredCards.length > cardsPerPage && (
            <div className="activity-pagination">
              <button
                type="button"
                className="activity-pagination-btn"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span className="activity-pagination-label">
                Página {currentPage} de {totalPages}
              </span>
              <button
                type="button"
                className="activity-pagination-btn"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>

        <aside className="activity-side-column">
          <section className="activity-side-card">
            <h2>Estado de flota</h2>
            <div className="activity-status-list">
              <div>
                <span>Centinelas activos</span>
                <strong>{deviceSummary.online} / {deviceSummary.total || 10}</strong>
              </div>
              <div>
                <span>Alertas críticas</span>
                <strong>{summary.alerts.toString().padStart(2, '0')}</strong>
              </div>
              <div>
                <span>Vuelos programados</span>
                <strong>{summary.flights.toString().padStart(2, '0')}</strong>
              </div>
            </div>
            <div className="activity-mini-chart" aria-hidden="true">
              {workflowBars.map((bar) => (
                <span key={bar.id} style={{ height: `${Math.max(18, bar.value)}%` }} />
              ))}
            </div>
            <div className="activity-mini-chart-labels">
              <span>00:00</span>
              <span>AHORA</span>
            </div>
          </section>

          <section className="activity-side-card">
            <h2>Accesos rápidos</h2>
            <ul className="activity-sidebar-list">
              <li className="activity-sidebar-item">
                <span className="activity-sidebar-icon">
                  <span className="material-symbols-outlined" aria-hidden="true">add_box</span>
                </span>
                <div>
                  <strong>Nueva Misión</strong>
                </div>
              </li>
              <li className="activity-sidebar-item">
                <span className="activity-sidebar-icon">
                  <span className="material-symbols-outlined" aria-hidden="true">query_stats</span>
                </span>
                <div>
                  <strong>Análisis Comparativo</strong>
                </div>
              </li>
              <li className="activity-sidebar-item">
                <span className="activity-sidebar-icon">
                  <span className="material-symbols-outlined" aria-hidden="true">help</span>
                </span>
                <div>
                  <strong>Centro de Soporte</strong>
                </div>
              </li>
            </ul>
          </section>

        </aside>
      </div>
    </div>
  );
}
