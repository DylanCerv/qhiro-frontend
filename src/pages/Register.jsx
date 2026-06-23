import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import QhiroPublicShell from '../components/QhiroPublicShell';
import { useAuth } from '../context/AuthContext';
import { ui } from '../i18n/es';
import { countryDefaults, resolveUserLocation } from '../utils/geo';

export default function Register() {
  const { registerClient, error, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    displayName: '',
    country: 'EC',
  });
  const [location, setLocation] = useState(countryDefaults.EC);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    resolveUserLocation(form.country).then(setLocation);
  }, [form.country]);

  const handleUseLocation = async () => {
    setLocating(true);
    const coords = await resolveUserLocation(form.country);
    setLocation(coords);
    setLocating(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await registerClient({
        ...form,
        location: { lat: location.lat, lng: location.lng },
      });
      navigate('/app/parcels');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <QhiroPublicShell>
      <div className="qhiro-auth-panel">
        <h1 className="qhiro-auth-title">{ui.auth.registerTitle}</h1>
        <form className="form qhiro-form" onSubmit={handleSubmit}>
          <label>
            {ui.auth.displayName}
            <input
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              required
            />
          </label>
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
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>
          <label>
            {ui.auth.country}
            <select
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            >
              {Object.entries(countryDefaults).map(([code, data]) => (
                <option key={code} value={code}>
                  {data.label}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="qhiro-btn qhiro-btn-outline" onClick={handleUseLocation}>
            {locating ? ui.auth.locating : ui.auth.useLocation}
          </button>
          <p className="location-preview qhiro-muted">
            {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </p>
          <button type="submit" className="qhiro-btn qhiro-btn-solid" disabled={submitting}>
            {ui.auth.registerButton}
          </button>
        </form>

        {error && <p className="form-error">{error}</p>}

        <p className="qhiro-auth-switch">
          {ui.auth.hasAccount}{' '}
          <Link to="/login">{ui.auth.goLogin}</Link>
        </p>
        <Link to="/" className="qhiro-back-link">
          {ui.landing.backHome}
        </Link>
      </div>
    </QhiroPublicShell>
  );
}
