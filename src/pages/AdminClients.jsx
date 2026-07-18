import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { getAccountStatusLabel, ui } from '../i18n/es';

const PAGE_SIZE = 4;

function getCompanyLabel(client) {
  if (client.companyName) return client.companyName;
  if (client.company) return client.company;
  const domain = client.email?.split('@')[1];
  if (!domain) return client.country ?? '—';
  return domain.replace(/\./g, ' ').replace(/-/g, ' ');
}

function formatArea(areaHa) {
  if (!areaHa) return '0 ha';
  if (areaHa >= 1000) return `${(areaHa / 1000).toFixed(1)}k ha`;
  if (areaHa >= 100) return `${areaHa.toFixed(0)} ha`;
  return `${areaHa.toFixed(1)} ha`;
}

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const loadClients = useCallback(async () => {
    const response = await api.getClients();
    setClients(response.clients ?? []);
  }, []);

  useEffect(() => {
    loadClients()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [loadClients]);

  const updateStatus = async (userId, accountStatus) => {
    setError('');
    setMessage('');
    try {
      await api.updateClientStatus(userId, accountStatus);
      setMessage(ui.admin.updated);
      await loadClients();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter]);

  const metrics = useMemo(() => {
    const activeClients = clients.filter((client) => client.accountStatus === 'active').length;
    const totalParcels = clients.reduce((total, client) => total + (client.parcelCount ?? 0), 0);
    const totalDevices = clients.reduce((total, client) => total + (client.deviceCount ?? 0), 0);
    const activeDevices = clients.reduce((total, client) => total + (client.activeDeviceCount ?? 0), 0);
    const totalAlerts = clients.reduce((total, client) => total + (client.alertCount ?? 0), 0);
    const monitoredArea = clients.reduce((total, client) => total + (client.areaHa ?? 0), 0);

    return {
      activeClients,
      totalParcels,
      totalDevices,
      activeDevices,
      totalAlerts,
      monitoredArea,
    };
  }, [clients]);

  const filteredClients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return clients
      .filter((client) => {
        if (statusFilter !== 'all' && client.accountStatus !== statusFilter) {
          return false;
        }

        if (!normalizedQuery) return true;
        const companyLabel = getCompanyLabel(client);
        return [
          client.displayName,
          client.email,
          client.country,
          companyLabel,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery));
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [clients, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleClients = filteredClients.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (loading) return <p className="page-state">{ui.common.loadingSession}</p>;

  return (
    <div className="page admin-clients-page">
      <div className="page-head admin-clients-head">
        <div>
          <h1>Gestión de Clientes</h1>
          <p>Control centralizado de cuentas y hardware desplegado.</p>
        </div>
        <div className="admin-head-actions">
          <input
            className="admin-search"
            type="search"
            placeholder="Buscar cliente o empresa..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            className="admin-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">Todos los Estados</option>
            <option value="active">Activos</option>
            <option value="suspended">Suspendidos</option>
            <option value="disabled">Deshabilitados</option>
          </select>
        </div>
      </div>

      <div className="admin-kpis">
        <section className="card">
          <p className="admin-kpi-label">Total clientes</p>
          <span className="material-symbols-outlined admin-kpi-icon admin-kpi-icon--green" aria-hidden="true">
            groups
          </span>
          <strong>{clients.length}</strong>
        </section>
        <section className="card">
          <p className="admin-kpi-label">Dispositivos activos</p>
          <span className="material-symbols-outlined admin-kpi-icon admin-kpi-icon--blue" aria-hidden="true">
            wifi_tethering
          </span>
          <strong>{metrics.activeDevices}</strong>
        </section>
        <section className="card">
          <p className="admin-kpi-label">Área monitoreada</p>
          <span className="material-symbols-outlined admin-kpi-icon admin-kpi-icon--green" aria-hidden="true">
            compost
          </span>
          <strong>{formatArea(metrics.monitoredArea)}</strong>
        </section>
        <section className="card">
          <p className="admin-kpi-label">Alertas sistema</p>
          <span className="material-symbols-outlined admin-kpi-icon admin-kpi-icon--red" aria-hidden="true">
            warning
          </span>
          <strong className="admin-kpi-alert">{metrics.totalAlerts}</strong>
        </section>
      </div>

      <section className="card">
        {filteredClients.length === 0 ? (
          <p className="empty-state">{ui.admin.noClients}</p>
        ) : (
          <div className="admin-table-shell">
            <div className="table-wrap admin-table-wrap">
              <table className="data-table admin-clients-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Empresa</th>
                    <th>Parcelas</th>
                    <th>Dispositivos</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleClients.map((client) => (
                    <tr key={client.userId}>
                      <td>
                        <div className="admin-client-primary">
                          <strong>{client.displayName}</strong>
                          <span>{client.email}</span>
                        </div>
                      </td>
                      <td>
                        <div className="admin-client-secondary">
                          <strong>{getCompanyLabel(client)}</strong>
                          <span>{client.country}</span>
                        </div>
                      </td>
                      <td>
                        <span className="admin-pill">{client.parcelCount ?? 0} Parcelas</span>
                      </td>
                      <td>
                        <span className="admin-pill">{client.deviceCount ?? 0} Units</span>
                      </td>
                      <td>
                        <StatusBadge
                          status={
                            client.accountStatus === 'active'
                              ? 'green'
                              : client.accountStatus === 'suspended'
                                ? 'yellow'
                                : 'red'
                          }
                          label={getAccountStatusLabel(client.accountStatus)}
                        />
                      </td>
                      <td className="admin-actions">
                        <button
                          type="button"
                          className="admin-icon-btn admin-icon-btn--active"
                          onClick={() => updateStatus(client.userId, 'active')}
                          title="Activar"
                          aria-label="Activar cliente"
                        >
                          <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn admin-icon-btn--suspend"
                          onClick={() => updateStatus(client.userId, 'suspended')}
                          title="Suspender"
                          aria-label="Suspender cliente"
                        >
                          <span className="material-symbols-outlined" aria-hidden="true">pause_circle</span>
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn admin-icon-btn--disable"
                          onClick={() => updateStatus(client.userId, 'disabled')}
                          title="Deshabilitar"
                          aria-label="Deshabilitar cliente"
                        >
                          <span className="material-symbols-outlined" aria-hidden="true">block</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-table-footer">
              <p>
                Mostrando {filteredClients.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-
                {Math.min(currentPage * PAGE_SIZE, filteredClients.length)} de {filteredClients.length} clientes
              </p>
              <div className="admin-pagination" aria-label="Paginación">
                <button
                  type="button"
                  className="admin-page-btn"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>
                {Array.from({ length: Math.min(totalPages, 3) }, (_, index) => index + 1).map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={item === currentPage ? 'admin-page-btn active' : 'admin-page-btn'}
                    onClick={() => setPage(item)}
                  >
                    {item}
                  </button>
                ))}
                {totalPages > 3 && <span className="admin-pagination-ellipsis">…</span>}
                {totalPages > 3 && (
                  <button type="button" className="admin-page-btn" onClick={() => setPage(totalPages)}>
                    {totalPages}
                  </button>
                )}
                <button
                  type="button"
                  className="admin-page-btn"
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        )}
        {message && <p className="form-success">{message}</p>}
        {error && <p className="form-error">{error}</p>}
      </section>
    </div>
  );
}
