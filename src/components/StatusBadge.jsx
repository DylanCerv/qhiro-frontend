const styles = {
  green: 'status-green',
  yellow: 'status-yellow',
  red: 'status-red',
  online: 'status-green',
  offline: 'status-red',
  lowBattery: 'status-yellow',
  scheduled: 'status-yellow',
  started: 'status-yellow',
  completed: 'status-green',
  failed: 'status-red',
};

export default function StatusBadge({ status, label }) {
  return <span className={`status-badge ${styles[status] ?? ''}`}>{label ?? status}</span>;
}
