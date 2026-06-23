import { Link } from 'react-router-dom';
import QhiroDoodlePattern from './QhiroDoodlePattern';
import { ui } from '../i18n/es';

export default function QhiroPublicShell({ children }) {
  return (
    <div className="qhiro-auth-shell">
      <Link to="/" className="qhiro-auth-brand" aria-label="Volver al inicio">
        qhiro
      </Link>
      <main className="qhiro-auth-card">
        <section className="qhiro-auth-visual" aria-label="Qhiro Symbiotic">
          <div className="qhiro-auth-doodle" aria-hidden="true">
            <QhiroDoodlePattern />
          </div>
          <div className="qhiro-auth-brand-block">
            <p className="qhiro-auth-logo">qhiro</p>
            <p>{ui.landing.tagline}</p>
          </div>
        </section>
        <section className="qhiro-auth-form-section">{children}</section>
      </main>
    </div>
  );
}
