import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ui } from '../i18n/es';

export function ProtectedRoute({ adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <p className="page-state">{ui.common.loadingSession}</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <p className="page-state">{ui.common.loadingSession}</p>;
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/app/admin/clients' : '/app'} replace />;
  }

  return <Outlet />;
}
