import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import QhiroPublicShell from '../components/QhiroPublicShell';
import { useAuth } from '../context/AuthContext';
import { ui } from '../i18n/es';

export default function Login() {
  const { login, loginDemo, error, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [authMode, setAuthMode] = useState('demo');

  useEffect(() => {
    api.getHealth().then((health) => setAuthMode(health.authMode ?? 'demo'));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(form);
      navigate('/app');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemo = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await loginDemo();
      navigate('/app/admin/clients');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <QhiroPublicShell>
      <div className="qhiro-auth-panel">
        <h1 className="qhiro-auth-title">{ui.auth.loginTitle}</h1>
        <form className="form qhiro-form" onSubmit={handleSubmit}>
          <label>
            {ui.auth.email}
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label>
            {ui.auth.password}
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>
          <button type="submit" className="qhiro-btn qhiro-btn-solid" disabled={submitting}>
            {ui.auth.loginButton}
          </button>
        </form>

        {authMode === 'demo' && (
          <div className="demo-box qhiro-demo-box">
            <p>{ui.auth.demoTitle}</p>
            <button type="button" className="qhiro-btn qhiro-btn-outline" onClick={handleDemo}>
              {ui.auth.demoAdmin}
            </button>
          </div>
        )}

        {authMode === 'firebase-missing-api-key' && (
          <p className="form-error">{ui.auth.missingApiKey}</p>
        )}

        {error && <p className="form-error">{error}</p>}

        <p className="qhiro-auth-switch">
          {ui.auth.noAccount}{' '}
          <Link to="/register">{ui.auth.goRegister}</Link>
        </p>
        <Link to="/" className="qhiro-back-link">
          {ui.landing.backHome}
        </Link>
      </div>
    </QhiroPublicShell>
  );
}
