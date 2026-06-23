import { useEffect, useState } from 'react';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { formatDate, getFlightStatusLabel, ui } from '../i18n/es';

export default function FlightHistory() {
  const [flights, setFlights] = useState([]);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    Promise.all([api.getFlights(), api.getReports()])
      .then(([flightRes, reportRes]) => {
        setFlights(flightRes.flights ?? []);
        setReports(reportRes.reports ?? []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (reportId) => {
    setDownloadingId(reportId);
    setError('');
    try {
      await api.downloadReport(reportId);
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) return <p className="page-state">{ui.common.loadingFlights}</p>;
  if (error && flights.length === 0 && reports.length === 0) {
    return <p className="page-state error">{ui.common.error}: {error}</p>;
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>{ui.flights.title}</h1>
        <p>{ui.flights.subtitle}</p>
      </div>

      {error && <p className="form-error">{error}</p>}

      <section className="card">
        <h2>{ui.flights.flights}</h2>
        {flights.length === 0 ? (
          <p className="empty-state">{ui.flights.noFlights}</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{ui.flights.flightId}</th>
                  <th>{ui.flights.parcel}</th>
                  <th>{ui.flights.status}</th>
                  <th>{ui.flights.scheduled}</th>
                  <th>{ui.flights.completed}</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight) => (
                  <tr key={flight.flightId}>
                    <td>{flight.flightId.slice(0, 8)}…</td>
                    <td>{flight.parcelId}</td>
                    <td>
                      <StatusBadge
                        status={flight.status}
                        label={getFlightStatusLabel(flight.status)}
                      />
                    </td>
                    <td>{formatDate(flight.scheduledAt)}</td>
                    <td>
                      {flight.completedAt
                        ? formatDate(flight.completedAt)
                        : ui.common.notAvailable}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card">
        <h2>{ui.flights.reports}</h2>
        {reports.length === 0 ? (
          <p className="empty-state">{ui.flights.noReports}</p>
        ) : (
          <ul className="simple-list">
            {reports.map((report) => (
              <li key={report.reportId}>
                <strong>{report.parcelId}</strong>
                <span>
                  {ui.flights.severity} {report.severity.toFixed(2)}
                </span>
                <span>{report.diagnosis}</span>
                <span>{formatDate(report.createdAt)}</span>
                <div className="list-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={downloadingId === report.reportId}
                    onClick={() => handleDownload(report.reportId)}
                  >
                    {downloadingId === report.reportId
                      ? ui.flights.downloading
                      : ui.flights.download}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
