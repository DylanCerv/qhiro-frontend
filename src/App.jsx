import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ParcelProvider } from './context/ParcelContext';
import Layout from './components/Layout';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import AdminClients from './pages/AdminClients';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import FlightHistory from './pages/FlightHistory';
import Landing from './pages/Landing';
import Login from './pages/Login';
import MqttDiagnostics from './pages/MqttDiagnostics';
import Parcels from './pages/Parcels';
import Privacy from './pages/Privacy';
import Register from './pages/Register';
import ScheduleSettings from './pages/ScheduleSettings';
import Terms from './pages/Terms';

function ClientLayout() {
  return (
    <ParcelProvider>
      <Layout />
    </ParcelProvider>
  );
}

function ClientOnly({ children }) {
  const { isAdmin } = useAuth();
  if (isAdmin) return <Navigate to="/app/admin/clients" replace />;
  return children;
}

function AdminOnly({ children }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/app" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/app" element={<ProtectedRoute />}>
            <Route
              element={
                <ClientOnly>
                  <ClientLayout />
                </ClientOnly>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="parcels" element={<Parcels />} />
              <Route path="schedule" element={<ScheduleSettings />} />
              <Route path="flights" element={<FlightHistory />} />
              <Route path="devices" element={<Devices />} />
            </Route>

            <Route
              path="admin/clients"
              element={
                <AdminOnly>
                  <Layout />
                </AdminOnly>
              }
            >
              <Route index element={<AdminClients />} />
              <Route path="mqtt" element={<MqttDiagnostics />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
