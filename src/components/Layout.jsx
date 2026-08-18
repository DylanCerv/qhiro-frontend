import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import QhiroLogo from './brand/QhiroLogo';
import { useAuth } from '../context/AuthContext';
import { ui } from '../i18n/es';

const clientLinks = [
  { to: '/app', label: ui.nav.dashboard, icon: 'dashboard', end: true },
  { to: '/app/parcels', label: ui.nav.parcels, icon: 'agriculture' },
  { to: '/app/devices', label: ui.nav.devices, icon: 'sensors' },
  { to: '/app/schedule', label: 'Programación', icon: 'calendar_month' },
  { to: '/app/flights', label: ui.nav.activity, icon: 'history' },
];

const adminLinks = [
  { to: '/app/admin/clients', label: ui.nav.admin, icon: 'groups', end: true },
  { to: '/app/admin/clients/missions', label: ui.nav.missionSimulator, icon: 'flight_takeoff' },
  { to: '/app/admin/clients/mqtt', label: ui.nav.mqttDiagnostics, icon: 'terminal' },
];

function getInitials(name) {
  return (
    name
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') ?? 'QH'
  );
}

function ShellNavLink({ to, label, icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
    >
      <span className="material-symbols-outlined" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </NavLink>
  );
}

function AppFooter() {
  return (
    <footer className="app-footer">
      <QhiroLogo variant="full" theme="dark" size={18} wordmark="Qhiro Symbiotic" />
      <p>© {new Date().getFullYear()} Qhiro Symbiotic.</p>
      <nav aria-label="Enlaces legales">
        <Link to="/privacy">Privacidad</Link>
        <Link to="/terms">Términos</Link>
        <a href="mailto:hola@qhiro.tech">Soporte</a>
      </nav>
    </footer>
  );
}

export default function Layout() {
  const { profile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const links = isAdmin ? adminLinks : clientLinks;
  const initials = getInitials(profile?.displayName);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isAdmin) {
    return (
      <div className="app-shell app-shell--admin">
        <aside className="app-sidebar">
          <div className="app-sidebar-brand">
            <QhiroLogo variant="icon" theme="dark" size={36} title="Qhiro" />
            <div className="sidebar-brand-copy">
              <p className="brand-title">Admin Console</p>
              <p className="brand-sub">TECHNICAL OPERATIONS</p>
            </div>
          </div>

          <nav className="app-sidebar-nav" aria-label={ui.nav.admin}>
            {links.map((link) => (
              <ShellNavLink key={link.to} {...link} />
            ))}
          </nav>

          <div className="app-sidebar-footer">
            <div className="sidebar-profile">
              <div className="sidebar-avatar" aria-hidden="true">
                {getInitials(profile?.displayName)}
              </div>
              <div>
                <p className="sidebar-name">{profile?.displayName ?? 'Admin'}</p>
                <p className="sidebar-role">Technical Operations</p>
              </div>
            </div>
            <button type="button" className="logout-btn" onClick={handleLogout}>
              <span className="material-symbols-outlined" aria-hidden="true">
                logout
              </span>
              <span>{ui.common.logout}</span>
            </button>
          </div>
        </aside>

        <div className="app-shell-content">
          <main className="app-main">
            <Outlet />
          </main>
          <AppFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell app-shell--client">
      <header className="app-header app-header--client">
        <div className="brand">
          <QhiroLogo variant="full" theme="dark" size={30} />
        </div>
        <nav className="app-nav">
          {links.map((link) => (
            <ShellNavLink key={link.to} {...link} />
          ))}
        </nav>
        <div className="app-header-tools">
          <label className="app-search">
            <span className="material-symbols-outlined" aria-hidden="true">
              search
            </span>
            <input type="search" placeholder="Buscar parcela..." aria-label="Buscar parcela" />
          </label>
          <button type="button" className="header-icon-btn" aria-label="Notificaciones">
            <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
          </button>
          <button type="button" className="header-icon-btn" aria-label="Configuración">
            <span className="material-symbols-outlined" aria-hidden="true">settings</span>
          </button>
          <button type="button" className="user-chip" onClick={handleLogout} aria-label={ui.common.logout}>
            {initials}
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}
