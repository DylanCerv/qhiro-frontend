import { Link } from 'react-router-dom';
import QhiroLogo from './brand/QhiroLogo';

export default function LegalPageShell({ title, updatedAt, children, active }) {
  return (
    <div className="stitch-landing legal-page">
      <header className="sl-nav">
        <Link to="/" className="sl-brand" aria-label="Qhiro Symbiotic inicio">
          <QhiroLogo variant="full" theme="dark" size={28} />
        </Link>
        <nav className="sl-nav-links legal-nav-links" aria-label="Documentos legales">
          <Link to="/terms" className={active === 'terms' ? 'is-active' : undefined}>
            Términos
          </Link>
          <Link to="/privacy" className={active === 'privacy' ? 'is-active' : undefined}>
            Privacidad
          </Link>
        </nav>
        <div className="sl-nav-actions">
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/register" className="sl-nav-register">
            Solicitar acceso
          </Link>
        </div>
      </header>

      <main className="legal-main">
        <header className="legal-hero">
          <p className="legal-eyebrow">Documento legal</p>
          <h1>{title}</h1>
          <dl className="legal-meta">
            <div>
              <dt>Última actualización</dt>
              <dd>{updatedAt}</dd>
            </div>
            <div>
              <dt>Prestador</dt>
              <dd>Qhiro Symbiotic</dd>
            </div>
            <div>
              <dt>Contacto</dt>
              <dd>
                <a href="mailto:hola@qhiro.tech">hola@qhiro.tech</a>
              </dd>
            </div>
          </dl>
        </header>
        <article className="legal-body">{children}</article>
      </main>

      <footer className="sl-footer">
        <div className="sl-footer-brand">
          <div className="sl-brand">
            <QhiroLogo variant="full" theme="dark" size={28} />
          </div>
          <p>
            Ecosistema agrícola autónomo: robótica aérea, infraestructura de campo e inteligencia
            artificial.
          </p>
          <small>© {new Date().getFullYear()} Qhiro Symbiotic.</small>
        </div>
        <div className="sl-footer-links">
          <div>
            <strong>Legal</strong>
            <Link to="/terms">Términos y Condiciones</Link>
            <Link to="/privacy">Política de Privacidad</Link>
          </div>
          <div>
            <strong>Acceso</strong>
            <Link to="/register">Solicitar acceso</Link>
            <Link to="/login">Iniciar sesión</Link>
          </div>
          <div>
            <strong>Contacto</strong>
            <a href="mailto:hola@qhiro.tech">hola@qhiro.tech</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function LegalSection({ id, title, children }) {
  return (
    <section className="legal-section" id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
