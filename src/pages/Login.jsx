import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import QhiroLogo from '../components/brand/QhiroLogo';
import QhiroPublicShell from '../components/QhiroPublicShell';
import { useAuth } from '../context/AuthContext';
import { ui } from '../i18n/es';

export default function Login() {
  const { login, resetPassword, error, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

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

  const handleResetPassword = async () => {
    setResetSent(false);
    setError(null);
    try {
      await resetPassword(form.email);
      setResetSent(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <QhiroPublicShell variant="login">
      <div className="qhiro-auth-panel">
        <QhiroLogo className="qhiro-login-logo" variant="icon" theme="dark" size={56} />
        <h1 className="qhiro-auth-title">Bienvenido de nuevo</h1>
        <p className="qhiro-auth-intro">
          Ingresa tus credenciales para acceder al centro de comando de Qhiro.
        </p>
        <form className="form qhiro-form" onSubmit={handleSubmit}>
          <label className="qhiro-field">
            <span>{ui.auth.email}</span>
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
            <span className="qhiro-password-label">
              <span>{ui.auth.password}</span>
              <button type="button" onClick={handleResetPassword}>Olvidé mi contraseña</button>
            </span>
            <span className="qhiro-input-wrap">
              <span className="material-symbols-outlined" aria-hidden="true">lock</span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="qhiro-password-toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </span>
          </label>
          <button type="submit" className="qhiro-btn qhiro-btn-solid" disabled={submitting}>
            <span>{submitting ? 'Ingresando…' : 'Ingresar'}</span>
            <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
          </button>
        </form>

        {error && <p className="form-error">{error}</p>}
        {resetSent && <p className="form-success">Te enviamos un enlace para restablecer tu contraseña.</p>}

        <p className="qhiro-auth-switch">
          ¿No tienes una cuenta?{' '}
          <Link to="/register">Crear cuenta</Link>
          <span className="qhiro-auth-legal">
            <Link to="/terms">Términos</Link>
            <Link to="/privacy">Privacidad</Link>
          </span>
        </p>
      </div>
    </QhiroPublicShell>
  );
}
