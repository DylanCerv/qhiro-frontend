import { formatDate, getEventLabel, ui } from '../i18n/es';

export default function AlertList({ alerts }) {
  if (!alerts?.length) {
    return <p className="empty-state">{ui.alerts.none}</p>;
  }

  return (
    <ul className="alert-list">
      {alerts.map((alert) => (
        <li key={alert.alertId} className="alert-item">
          <div className="alert-meta">
            <span className="alert-event">{getEventLabel(alert.event)}</span>
            <span className="alert-date">{formatDate(alert.createdAt)}</span>
          </div>
          <p className="alert-message">{alert.message}</p>
          <span className="alert-severity">
            {ui.alerts.severity}: {alert.severity.toFixed(2)}
          </span>
        </li>
      ))}
    </ul>
  );
}
