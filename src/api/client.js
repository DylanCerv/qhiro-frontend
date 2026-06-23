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
  getSchedules: () => request('/schedules'),
  saveSchedule: (schedule) =>
    request('/schedules', { method: 'PUT', body: JSON.stringify(schedule) }),
  deleteSchedule: (scheduleId) => request(`/schedules/${scheduleId}`, { method: 'DELETE' }),
  getFlights: () => request('/flights'),
  getDevices: () => request('/devices'),
  createDevice: (payload) =>
    request('/devices', { method: 'POST', body: JSON.stringify(payload) }),
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
  updateClientStatus: (userId, accountStatus) =>
    request(`/admin/clients/${userId}/account-status`, {
      method: 'PATCH',
      body: JSON.stringify({ accountStatus }),
    }),
};
