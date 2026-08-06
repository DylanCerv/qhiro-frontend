import { Link } from 'react-router-dom';
import QhiroLogo from './brand/QhiroLogo';

const authTagline = 'La tierra habla, el aire observa, la IA piensa y el hardware ejecuta.';

function RegisterVisual() {
  return (
    <section className="qhiro-auth-visual qhiro-register-visual" aria-label="Qhiro Symbiotic">
      <div className="qhiro-register-pattern" aria-hidden="true">
        <span className="qhiro-register-block qhiro-register-block--top-left" />
        <span className="qhiro-register-block qhiro-register-block--top-right" />
        <span className="qhiro-register-block qhiro-register-block--bottom-left" />
        <span className="qhiro-register-block qhiro-register-block--bottom-right" />
      </div>
      <div className="qhiro-auth-brand-block">
        <QhiroLogo
          className="qhiro-logo--stacked"
          variant="full"
          theme="dark"
          size={88}
          wordmark="Qhiro"
        />
        <p>{authTagline}</p>
        <div className="qhiro-register-features">
          <div>
            <span className="material-symbols-outlined" aria-hidden="true">sensors</span>
            <p><strong>Monitoreo IoT</strong>Sensores de precisión en tiempo real.</p>
          </div>
          <div>
            <span className="material-symbols-outlined" aria-hidden="true">psychology</span>
            <p><strong>IA agronómica</strong>Modelado predictivo de rendimiento.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function LoginVisual() {
  return (
    <aside className="qhiro-auth-visual qhiro-login-visual" aria-label="Telemetría del sistema">
      <div className="qhiro-telemetry-grid" aria-hidden="true" />
      <div className="qhiro-scanline" aria-hidden="true" />
      <div className="qhiro-hud">
        <div className="qhiro-hud-ring qhiro-hud-ring--outer" />
        <div className="qhiro-hud-ring qhiro-hud-ring--inner" />
        <div className="qhiro-hud-machine">
          <span className="material-symbols-outlined" aria-hidden="true">precision_manufacturing</span>
          <strong>DRONE_ALPHA_01</strong>
          <small>ACTIVE COMMAND LINK</small>
        </div>
        <div className="qhiro-hud-data qhiro-hud-data--altitude">
          <small>Altitude</small><strong>124.5 m</strong>
        </div>
        <div className="qhiro-hud-data qhiro-hud-data--coordinates">
          <small>Coordinates</small><strong>34.6037 S, 58.3816 W</strong>
        </div>
      </div>
      <div className="qhiro-operational-status">
        <div>
          <small>Estatus del sistema</small>
          <strong><span /> Nominal</strong>
        </div>
        <div>
          <small>Protocolo de seguridad</small>
          <strong>AES-256-GCM</strong>
          <em>ENCRYPTED_STREAM</em>
        </div>
      </div>
    </aside>
  );
}

export default function QhiroPublicShell({ children, variant = 'register' }) {
  const isLogin = variant === 'login';

  return (
    <div className={`qhiro-auth-shell qhiro-auth-shell--${variant}`}>
      {isLogin && (
        <Link to="/" className="qhiro-auth-brand" aria-label="Volver al inicio">
          <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          Inicio
        </Link>
      )}
      <main className="qhiro-auth-card">
        {!isLogin && <RegisterVisual />}
        <section className="qhiro-auth-form-section">{children}</section>
        {isLogin && <LoginVisual />}
      </main>
    </div>
  );
}
