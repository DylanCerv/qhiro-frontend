import { Link } from 'react-router-dom';
import QhiroDoodlePattern from '../components/QhiroDoodlePattern';
import { ui } from '../i18n/es';

function LandingSection({ title, subtitle, children, id }) {
  return (
    <section className="landing-section" id={id}>
      {title && <h2>{title}</h2>}
      {subtitle && <p className="landing-section-sub">{subtitle}</p>}
      {children}
    </section>
  );
}

function HeroActions() {
  return (
    <div className="landing-hero-actions">
      <Link to="/register" className="landing-btn landing-btn-primary">
        {ui.landing.ctaRegister}
      </Link>
      <Link to="/login" className="landing-btn landing-btn-secondary">
        {ui.landing.ctaLogin}
      </Link>
    </div>
  );
}

export default function Landing() {
  const { problem, ecosystem, solution, stats, segments, business } = ui.landing;

  return (
    <div className="landing-page landing-page-v2">
      <header className="landing-nav">
        <Link to="/" className="landing-brand" aria-label="Qhiro inicio">
          qhiro
        </Link>
        <nav className="landing-nav-links" aria-label="Navegación principal">
          <a href="#ecosistema">Ecosistema</a>
          <a href="#solucion">Solución</a>
          <a href="#mercado">Mercado</a>
          <a href="#modelo">Modelo</a>
        </nav>
        <Link to="/login" className="landing-nav-login">
          {ui.landing.ctaLogin}
        </Link>
      </header>

      <section className="landing-hero-v2">
        <div className="landing-hero-copy">
          <p className="landing-eyebrow">AgTech · IA · Robótica autónoma</p>
          <h1>La agricultura de precisión que observa, piensa y actúa.</h1>
          <p>
            Qhiro Symbiotic une drones, sensores, IA y dosificación localizada para reducir
            desperdicio químico y aplicar nutrientes con precisión quirúrgica.
          </p>
          <HeroActions />
        </div>

        <div className="landing-hero-visual" aria-hidden="true">
          <QhiroDoodlePattern />
          <div className="landing-orbit landing-orbit-core">
            <span>Qhiro Core</span>
            <strong>IA</strong>
          </div>
          <div className="landing-orbit landing-orbit-drone">El Vigía</div>
          <div className="landing-orbit landing-orbit-node">Centinelas</div>
        </div>
      </section>

      <main className="landing-main">
        <LandingSection title={problem.title} id="problema">
          <div className="landing-grid">
            {problem.items.map((item) => (
              <article key={item.title} className="landing-card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </LandingSection>

        <LandingSection title={ecosystem.title} subtitle={ecosystem.subtitle} id="ecosistema">
          <div className="landing-grid">
            {ecosystem.units.map((unit) => (
              <article key={unit.name} className="landing-card">
                <p className="landing-kicker">{unit.role}</p>
                <h3>{unit.name}</h3>
                <p>{unit.desc}</p>
              </article>
            ))}
          </div>

          <div className="landing-flow">
            <h3>{ecosystem.flowTitle}</h3>
            <ol>
              {ecosystem.flow.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="landing-principle">{ecosystem.principle}</p>
          </div>
        </LandingSection>

        <LandingSection title={solution.title} subtitle={solution.subtitle} id="solucion">
          <ul className="landing-list landing-list-cards">
            {solution.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </LandingSection>

        <LandingSection title={stats.title} id="mercado">
          <div className="landing-stats">
            {stats.items.map((item) => (
              <article key={item.value} className="landing-stat">
                <p className="landing-stat-value">{item.value}</p>
                <p className="landing-stat-label">{item.label}</p>
              </article>
            ))}
          </div>
        </LandingSection>

        <LandingSection title={segments.title} id="segmentos">
          <div className="landing-trends">
            {segments.trends.map((trend) => (
              <span key={trend} className="landing-trend-chip">
                {trend}
              </span>
            ))}
          </div>
          <div className="landing-grid">
            {segments.audiences.map((audience) => (
              <article key={audience.segment} className="landing-card">
                <p className="landing-kicker">{audience.model}</p>
                <h3>{audience.segment}</h3>
                <p>{audience.desc}</p>
              </article>
            ))}
          </div>
        </LandingSection>

        <LandingSection title={business.title} subtitle={business.subtitle} id="modelo">
          <div className="landing-grid landing-grid-2">
            {business.plans.map((plan) => (
              <article key={plan.name} className="landing-card landing-plan-card">
                <h3>{plan.name}</h3>
                <p>{plan.desc}</p>
              </article>
            ))}
          </div>
          <ul className="landing-list">
            {business.revenue.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </LandingSection>

        <section className="landing-cta">
          <h2>{business.ctaTitle}</h2>
          <HeroActions />
        </section>
      </main>

      <footer className="landing-footer">
        <p className="qhiro-logo qhiro-logo-sm">qhiro</p>
        <p>{ui.landing.tagline}</p>
      </footer>
    </div>
  );
}
