import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import QhiroPublicShell from '../components/QhiroPublicShell';
import { useAuth } from '../context/AuthContext';
import { ui } from '../i18n/es';
import { countryDefaults, detectCountryCode } from '../utils/geo';

export default function Register() {
  const { registerClient, error, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    country: detectCountryCode(),
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (form.password !== form.confirmPassword) {
        throw new Error('Las contraseñas no coinciden.');
      }
      await registerClient({
        email: form.email,
        password: form.password,
        displayName: form.displayName,
        country: form.country,
        location: {
          lat: (countryDefaults[form.country] ?? countryDefaults.EC).lat,
          lng: (countryDefaults[form.country] ?? countryDefaults.EC).lng,
        },
      });
      navigate('/app/parcels');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <QhiroPublicShell variant="register">
      <div className="qhiro-auth-panel">
        <h1 className="qhiro-auth-title">Crear cuenta</h1>
        <p className="qhiro-auth-intro">Únase al ecosistema de agricultura simbiótica.</p>
        <form className="form qhiro-form" onSubmit={handleSubmit}>
          <label className="qhiro-field">
            <span>{ui.auth.displayName}</span>
            <span className="qhiro-input-wrap">
              <span className="material-symbols-outlined" aria-hidden="true">person</span>
              <input
                placeholder="Ej. Juan Pérez"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                required
              />
            </span>
          </label>
          <label className="qhiro-field">
            <span>Email corporativo</span>
            <span className="qhiro-input-wrap">
              <span className="material-symbols-outlined" aria-hidden="true">alternate_email</span>
              <input
                type="email"
                placeholder="nombre@empresa.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </span>
          </label>
          <label className="qhiro-field">
            <span>{ui.auth.country}</span>
            <span className="qhiro-input-wrap">
              <span className="material-symbols-outlined" aria-hidden="true">public</span>
              <select
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              >
                {Object.entries(countryDefaults).map(([code, data]) => (
                  <option key={code} value={code}>{data.label}</option>
                ))}
              </select>
            </span>
          </label>
          <div className="qhiro-form-grid">
            <label className="qhiro-field">
              <span>{ui.auth.password}</span>
              <span className="qhiro-input-wrap">
                <span className="material-symbols-outlined" aria-hidden="true">lock</span>
                <input
                  type="password"
                  minLength={6}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </span>
            </label>
            <label className="qhiro-field">
              <span>Confirmar</span>
              <span className="qhiro-input-wrap">
                <span className="material-symbols-outlined" aria-hidden="true">lock_reset</span>
                <input
                  type="password"
                  minLength={6}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                />
              </span>
            </label>
          </div>
          <button type="submit" className="qhiro-btn qhiro-btn-solid" disabled={submitting}>
            <span>{submitting ? 'Procesando…' : 'Comenzar registro'}</span>
            <span className="material-symbols-outlined" aria-hidden="true">
              {submitting ? 'progress_activity' : 'arrow_forward'}
            </span>
          </button>
        </form>

        {error && <p className="form-error">{error}</p>}

        <p className="qhiro-auth-switch">
          {ui.auth.hasAccount}{' '}
          <Link to="/login">{ui.auth.goLogin}</Link>
          <span className="qhiro-auth-legal">
            <a href="#terms">Términos</a>
            <a href="#privacy">Privacidad</a>
          </span>
        </p>
      </div>
    </QhiroPublicShell>
  );
}
