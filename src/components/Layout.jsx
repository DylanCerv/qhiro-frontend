import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ui } from '../i18n/es';

const clientLinks = [
  { to: '/app', label: ui.nav.dashboard, end: true },
  { to: '/app/parcels', label: ui.nav.parcels },
  { to: '/app/flights', label: ui.nav.activity },
  { to: '/app/devices', label: ui.nav.devices },
];

const adminLinks = [
  { to: '/app/admin/clients', label: ui.nav.admin, end: true },
  { to: '/app/admin/clients/mqtt', label: ui.nav.mqttDiagnostics },
];

export default function Layout() {
  const { profile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const links = isAdmin ? adminLinks : clientLinks;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">q</span>
          <div>
            <p className="brand-title">qhiro</p>
            <p className="brand-sub">{profile?.displayName ?? ui.brandSubtitle}</p>
          </div>
        </div>
        <nav className="app-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {link.label}
            </NavLink>
          ))}
          <button type="button" className="nav-link logout-btn" onClick={handleLogout}>
            {ui.common.logout}
          </button>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
