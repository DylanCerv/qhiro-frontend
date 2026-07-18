import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import QhiroPublicShell from '../components/QhiroPublicShell';
import { useAuth } from '../context/AuthContext';
import { ui } from '../i18n/es';

const qhiroLogo =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCO7KRci78uVEOpLYa_W8IMupsYH_AWNlUNFRrAfVljbNtAT2VFasWf-cYm5NPcv16Sw0rB4D4VvyWCTFJu0nf01uoOUHImNnwA9gMz7uz8pxMvv4p55iSp547eA8FjMSPwSgqbij5bz-0nmQ6VXZoAZKNybUVl1kgHUhf-OrLlcamJrQGzEg-bZ4nloAwvp_uNHMx0HdJ2o30lRRKdcvpL6RIS1qDlz91iMkxvgTIHcpb2s6ZLvJYxnJym0vn8XjaaYL6WNF-6uf7c';

export default function Login() {
  const { login, resetPassword, error, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
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
        <img className="qhiro-login-logo" src={qhiroLogo} alt="Qhiro" />
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
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
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
        </p>
      </div>
    </QhiroPublicShell>
  );
}
