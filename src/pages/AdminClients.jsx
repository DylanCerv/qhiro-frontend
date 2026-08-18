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

const STATUS_PRIORITY = { pending: 0, active: 1, suspended: 2, disabled: 3 };

function getClientActions(status) {
  if (status === 'pending') {
    return [
      { accountStatus: 'active', label: ui.admin.grantAccess, kind: 'grant' },
      { kind: 'remove', label: ui.admin.removeAccess, icon: 'person_off' },
    ];
  }
  if (status === 'active') {
    return [
      { accountStatus: 'suspended', label: ui.admin.suspend, kind: 'suspend', icon: 'pause_circle' },
      { kind: 'remove', label: ui.admin.removeAccess, icon: 'person_off' },
    ];
  }
  if (status === 'suspended') {
    return [
      { accountStatus: 'active', label: ui.admin.grantAccess, kind: 'grant' },
      { kind: 'remove', label: ui.admin.removeAccess, icon: 'person_off' },
    ];
  }
  return [{ accountStatus: 'active', label: ui.admin.grantAccess, kind: 'grant' }];
}

function emailsMatch(left, right) {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState('');
  const [clientToRemove, setClientToRemove] = useState(null);
  const [confirmEmail, setConfirmEmail] = useState('');
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

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter]);

  useEffect(() => {
    if (!clientToRemove) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !updatingUserId) {
        setClientToRemove(null);
        setConfirmEmail('');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [clientToRemove, updatingUserId]);

  const closeRemoveModal = () => {
    if (updatingUserId) return;
    setClientToRemove(null);
    setConfirmEmail('');
  };

  const handleAccountStatus = async (userId, accountStatus, emailToConfirm) => {
    setError('');
    setSuccess('');
    setUpdatingUserId(userId);
    try {
      const response = await api.updateClientStatus(userId, accountStatus, emailToConfirm);
      setClients((current) =>
        current.map((client) =>
          client.userId === userId
            ? { ...client, accountStatus: response.client?.accountStatus ?? accountStatus }
            : client,
        ),
      );
      setSuccess(accountStatus === 'disabled' ? ui.admin.removeSuccess : ui.admin.updated);
      setClientToRemove(null);
      setConfirmEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingUserId('');
    }
  };

  const metrics = useMemo(() => {
    const pendingClients = clients.filter((client) => client.accountStatus === 'pending').length;
    const activeDevices = clients.reduce((total, client) => total + (client.activeDeviceCount ?? 0), 0);
    const totalAlerts = clients.reduce((total, client) => total + (client.alertCount ?? 0), 0);
    const monitoredArea = clients.reduce((total, client) => total + (client.areaHa ?? 0), 0);

    return {
      pendingClients,
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
      .sort((a, b) => {
        const statusDiff =
          (STATUS_PRIORITY[a.accountStatus] ?? 9) - (STATUS_PRIORITY[b.accountStatus] ?? 9);
        if (statusDiff !== 0) return statusDiff;
        return a.displayName.localeCompare(b.displayName);
      });
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
          <p>
            Vista de clientes y solicitudes de acceso
            {metrics.pendingClients > 0 ? `. ${metrics.pendingClients} pendientes.` : '.'}
          </p>
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
            <option value="pending">Pendientes</option>
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
                    <th>{ui.admin.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleClients.map((client) => (
                    <tr
                      key={client.userId}
                      className={client.accountStatus === 'pending' ? 'is-pending' : undefined}
                    >
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
                              : client.accountStatus === 'pending' || client.accountStatus === 'suspended'
                                ? 'yellow'
                                : 'red'
                          }
                          label={getAccountStatusLabel(client.accountStatus)}
                        />
                      </td>
                      <td>
                        <div className="admin-actions">
                          {getClientActions(client.accountStatus).map((action) => {
                            if (action.kind === 'grant') {
                              return (
                                <button
                                  key={action.accountStatus}
                                  type="button"
                                  className="admin-grant-btn"
                                  disabled={updatingUserId === client.userId}
                                  onClick={() => handleAccountStatus(client.userId, action.accountStatus)}
                                >
                                  {action.label}
                                </button>
                              );
                            }

                            if (action.kind === 'remove') {
                              return (
                                <button
                                  key="remove"
                                  type="button"
                                  className="admin-icon-btn admin-icon-btn--disable"
                                  title={action.label}
                                  aria-label={action.label}
                                  disabled={updatingUserId === client.userId}
                                  onClick={() => {
                                    setError('');
                                    setSuccess('');
                                    setConfirmEmail('');
                                    setClientToRemove(client);
                                  }}
                                >
                                  <span className="material-symbols-outlined" aria-hidden="true">
                                    {action.icon}
                                  </span>
                                </button>
                              );
                            }

                            return (
                              <button
                                key={action.accountStatus}
                                type="button"
                                className={`admin-icon-btn admin-icon-btn--${action.kind}`}
                                title={action.label}
                                aria-label={action.label}
                                disabled={updatingUserId === client.userId}
                                onClick={() => handleAccountStatus(client.userId, action.accountStatus)}
                              >
                                <span className="material-symbols-outlined" aria-hidden="true">
                                  {action.icon}
                                </span>
                              </button>
                            );
                          })}
                        </div>
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
        {success && <p className="form-success">{success}</p>}
        {error && <p className="form-error">{error}</p>}
      </section>

      {clientToRemove && (
        <div className="admin-modal-backdrop">
          <div
            className="admin-modal admin-modal--danger"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-remove-title"
          >
            <div className="admin-modal-icon" aria-hidden="true">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <h2 id="admin-remove-title">{ui.admin.removeTitle}</h2>
            <p className="admin-modal-lead">{ui.admin.removeWarning}</p>
            <div className="admin-modal-target">
              <strong>{clientToRemove.displayName}</strong>
              <span>{clientToRemove.email}</span>
            </div>
            <label className="admin-modal-field">
              <span>{ui.admin.removeConfirmLabel}</span>
              <input
                type="email"
                autoFocus
                autoComplete="off"
                spellCheck="false"
                placeholder={clientToRemove.email}
                value={confirmEmail}
                disabled={Boolean(updatingUserId)}
                onChange={(event) => setConfirmEmail(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === 'Enter'
                    && !updatingUserId
                    && emailsMatch(confirmEmail, clientToRemove.email)
                  ) {
                    event.preventDefault();
                    handleAccountStatus(clientToRemove.userId, 'disabled', confirmEmail);
                  }
                }}
              />
              <small>
                {ui.admin.removeConfirmHint} <code>{clientToRemove.email}</code>
              </small>
            </label>
            {error && <p className="form-error">{error}</p>}
            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-modal-cancel"
                disabled={Boolean(updatingUserId)}
                onClick={closeRemoveModal}
              >
                {ui.common.cancel}
              </button>
              <button
                type="button"
                className="admin-modal-confirm"
                disabled={
                  Boolean(updatingUserId) || !emailsMatch(confirmEmail, clientToRemove.email)
                }
                onClick={() => handleAccountStatus(clientToRemove.userId, 'disabled', confirmEmail)}
              >
                {updatingUserId ? 'Desactivando…' : ui.admin.removeConfirmAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
