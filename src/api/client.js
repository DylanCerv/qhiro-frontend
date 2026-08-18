import { ui } from '../i18n/es';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

let authToken = null;

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error ?? ui.common.requestFailed);
  }

  return response.json();
}

export const api = {
  setToken(token) {
    authToken = token;
  },

  register: (payload) =>
    request('/users/register', { method: 'POST', body: JSON.stringify(payload) }),

  createProfile: (payload) =>
    request('/users/profile', { method: 'POST', body: JSON.stringify(payload) }),

  login: (payload) =>
    request('/users/login', { method: 'POST', body: JSON.stringify(payload) }),

  getMe: () => request('/users/me'),
  getHealth: () => fetch(`${API_URL.replace('/api', '')}/api/health`).then((r) => r.json()),
  getCrops: () => fetch(`${API_URL}/crops`).then((r) => r.json()),
  updateMe: (payload) =>
    request('/users/me', { method: 'PUT', body: JSON.stringify(payload) }),

  getDashboard: () => request('/dashboard'),
  getParcels: () => request('/parcels'),
  createParcel: (payload) =>
    request('/parcels', { method: 'POST', body: JSON.stringify(payload) }),
  updateParcel: (parcelId, payload) =>
    request(`/parcels/${parcelId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteParcel: (parcelId) => request(`/parcels/${parcelId}`, { method: 'DELETE' }),

  getAlerts: () => request('/alerts'),
  getActionLogs: () => request('/action-logs'),
  getActivity: () => request('/activity'),
  retryAction: (actionId) => request(`/action-logs/${actionId}/retry`, { method: 'POST' }),
  getSchedules: () => request('/schedules'),
  saveSchedule: (schedule) =>
    request('/schedules', { method: 'PUT', body: JSON.stringify(schedule) }),
  deleteSchedule: (scheduleId) => request(`/schedules/${scheduleId}`, { method: 'DELETE' }),
  getFlights: () => request('/flights'),
  getDevices: () => request('/devices'),
  createDevice: (payload) =>
    request('/devices', { method: 'POST', body: JSON.stringify(payload) }),
  updateDevice: (deviceId, payload) =>
    request(`/devices/${deviceId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  toggleDeviceStatus: (deviceId, status) =>
    request(`/devices/${deviceId}/toggle-status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    }),
  deleteDevice: (deviceId) => request(`/devices/${deviceId}`, { method: 'DELETE' }),
  simulateTelemetry: (payload) =>
    request('/simulator/telemetry', { method: 'POST', body: JSON.stringify(payload) }),
  getReports: () => request('/reports'),
  downloadReport: async (reportId) => {
    const response = await fetch(`${API_URL}/reports/${reportId}/download`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error ?? ui.common.requestFailed);
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qhiro-report-${reportId}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  },

  getClients: () => request('/admin/clients'),
  getClientDevices: (userId) => request(`/admin/clients/${userId}/devices`),
  getClientParcels: (userId) => request(`/admin/clients/${userId}/parcels`),
  getClientTelemetryLogs: (userId) => request(`/admin/clients/${userId}/telemetry-logs`),
  getClientActionLogs: (userId) => request(`/admin/clients/${userId}/action-logs`),
  updateClientStatus: (userId, accountStatus) =>
    request(`/admin/clients/${userId}/account-status`, {
      method: 'PATCH',
      body: JSON.stringify({ accountStatus }),
    }),
  getMqttStatus: () => request('/admin/mqtt/status'),
  sendMqttDiagnostic: (payload) =>
    request('/admin/mqtt/diagnostic', { method: 'POST', body: JSON.stringify(payload) }),
  sendAdminTelemetry: (payload) =>
    request('/admin/mqtt/telemetry', { method: 'POST', body: JSON.stringify(payload) }),
  sendAdminActionAck: (payload) =>
    request('/admin/mqtt/action-ack', { method: 'POST', body: JSON.stringify(payload) }),
  createAdminTestFlight: (payload) =>
    request('/admin/mqtt/test-flight', { method: 'POST', body: JSON.stringify(payload) }),
  runAdminTestDroneFlow: (payload) =>
    request('/admin/mqtt/test-drone-flow', { method: 'POST', body: JSON.stringify(payload) }),
};
