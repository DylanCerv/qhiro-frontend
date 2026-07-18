const styles = {
  green: 'status-green',
  yellow: 'status-yellow',
  red: 'status-red',
  online: 'status-green',
  offline: 'status-red',
  lowBattery: 'status-yellow',
  scheduled: 'status-yellow',
  started: 'status-yellow',
  pending: 'status-yellow',
  unread: 'status-yellow',
  read: 'status-green',
  info: 'status-green',
  warning: 'status-yellow',
  critical: 'status-red',
  completed: 'status-green',
  failed: 'status-red',
};

export default function StatusBadge({ status, label }) {
  return <span className={`status-badge ${styles[status] ?? ''}`}>{label ?? status}</span>;
}
