import { useEffect, useState } from 'react';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { formatDate, getAccountStatusLabel, ui } from '../i18n/es';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadClients = async () => {
    const response = await api.getClients();
    setClients(response.clients ?? []);
  };

  useEffect(() => {
    loadClients()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) return <p className="page-state">{ui.common.loadingSession}</p>;

  return (
    <div className="page">
      <div className="page-head">
        <h1>{ui.admin.title}</h1>
        <p>{ui.admin.subtitle}</p>
      </div>

      <section className="card">
        {clients.length === 0 ? (
          <p className="empty-state">{ui.admin.noClients}</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{ui.admin.client}</th>
                  <th>{ui.admin.email}</th>
                  <th>{ui.admin.country}</th>
                  <th>{ui.admin.parcels}</th>
                  <th>{ui.admin.status}</th>
                  <th>{ui.admin.actions}</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.userId}>
                    <td>{client.displayName}</td>
                    <td>{client.email}</td>
                    <td>{client.country}</td>
                    <td>{client.parcelCount ?? 0}</td>
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
                        className="btn-secondary"
                        onClick={() => updateStatus(client.userId, 'active')}
                      >
                        {ui.admin.activate}
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => updateStatus(client.userId, 'suspended')}
                      >
                        {ui.admin.suspend}
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => updateStatus(client.userId, 'disabled')}
                      >
                        {ui.admin.disable}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {message && <p className="form-success">{message}</p>}
        {error && <p className="form-error">{error}</p>}
      </section>
    </div>
  );
}
