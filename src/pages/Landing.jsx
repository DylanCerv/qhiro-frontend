import { Link } from 'react-router-dom';
import { ui } from '../i18n/es';

const problemIcons = ['view_column', 'view_column', 'trending_down'];
const ecosystemIcons = ['psychology', 'flight', 'hub'];
const businessIcons = ['hardware', 'cloud_done', 'settings_suggest'];

function SectionHeader({ eyebrow, title }) {
  return (
    <header className="sl-section-header">
      {eyebrow && <p>{eyebrow}</p>}
      <h2>{title}</h2>
    </header>
  );
}

function HeroActions({ large = false }) {
  return (
    <div className={`sl-actions${large ? ' sl-actions--large' : ''}`}>
      <Link to="/register" className="sl-button sl-button--primary">
        {ui.landing.ctaRegister}
        <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
      </Link>
      <Link to="/login" className="sl-button sl-button--secondary">
        {ui.landing.ctaLogin}
      </Link>
    </div>
  );
}

export default function Landing() {
  const { problem, ecosystem, solution, stats, segments, business } = ui.landing;

  return (
    <div className="stitch-landing">
      <header className="sl-nav">
        <Link to="/" className="sl-brand" aria-label="Qhiro inicio">
          <span className="sl-logo-mark" aria-hidden="true">q</span>
          <strong>qhiro</strong>
        </Link>
        <nav className="sl-nav-links" aria-label="Navegación principal">
          <a href="#ecosistema">Ecosistema</a>
          <a href="#solucion">Solución</a>
          <a href="#mercado">Mercado</a>
          <a href="#modelo">Modelo</a>
        </nav>
        <div className="sl-nav-actions">
          <Link to="/login">{ui.landing.ctaLogin}</Link>
          <Link to="/register" className="sl-nav-register">{ui.landing.ctaRegister}</Link>
        </div>
      </header>

      <main>
        <section className="sl-hero">
          <div className="sl-hero-copy">
            <p className="sl-status">
              <span aria-hidden="true" />
              Simbiosis tecnológica activa
            </p>
          <h1>
            La tierra habla, el aire observa, <em>la IA piensa</em> y el hardware ejecuta.
          </h1>
          <p>
            Ecosistema autónomo de gestión de cultivos mediante drones multiespectrales, IA
            de precisión y centinelas de campo. Redefiniendo el rendimiento agrícola con
            inteligencia colectiva.
          </p>
          <HeroActions />
          </div>
        </section>

        <section className="sl-section sl-section--deep" id="problema">
          <SectionHeader
            eyebrow="El desafío actual"
            title="La ineficiencia es el enemigo oculto del campo."
          />
          <div className="sl-card-grid">
            {problem.items.map((item, index) => (
              <article key={item.title} className="sl-card sl-problem-card">
                <span className="material-symbols-outlined" aria-hidden="true">
                  {problemIcons[index]}
                </span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sl-section" id="ecosistema">
          <SectionHeader
            eyebrow="Arquitectura Symbiotic"
            title="Una red inteligente que respira con tu cultivo."
          />
          <div className="sl-card-grid">
            {ecosystem.units.map((unit, index) => (
              <article key={unit.name} className="sl-card sl-ecosystem-card">
                <span className="material-symbols-outlined" aria-hidden="true">
                  {ecosystemIcons[index]}
                </span>
                <h3>{unit.role} - {unit.name}</h3>
                <p>{unit.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sl-flow">
          <SectionHeader title={ecosystem.flowTitle} />
          <ol>
            {ecosystem.flow.map((step, index) => (
              <li key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
          <blockquote>“{ecosystem.principle}”</blockquote>
        </section>

        <section className="sl-section sl-solution" id="solucion">
          <div className="sl-solution-image" role="img" aria-label="Sistema de microinyección agrícola de precisión" />
          <div className="sl-solution-copy">
            <SectionHeader eyebrow="La precisión es poder" title="Micro-inyecciones localizadas." />
            <ul>
              {solution.items.map((item) => {
                const [title, ...description] = item.split(':');
                return (
                  <li key={item}>
                    <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
                    <p><strong>{title}:</strong>{description.join(':')}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="sl-section sl-section--deep" id="mercado">
          <SectionHeader title="Resultados que transforman el campo" />
          <div className="sl-stat-grid">
            {stats.items.map((item) => (
              <article key={item.value} className="sl-stat">
                <strong>{item.value}</strong>
                <p>{item.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sl-section" id="segmentos">
          <SectionHeader title={segments.title} />
          <div className="sl-trends">
            {segments.trends.map((trend) => (
              <span key={trend}>{trend}</span>
            ))}
          </div>
          <div className="sl-card-grid">
            {segments.audiences.map((audience) => (
              <article key={audience.segment} className="sl-card sl-audience-card">
                <h3>{audience.segment} ({audience.model})</h3>
                <p>{audience.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sl-section sl-business" id="modelo">
          <div>
            <SectionHeader eyebrow={business.subtitle} title={business.title} />
            <div className="sl-plans">
              {business.plans.map((plan) => (
                <article key={plan.name} className="sl-card">
                  <h3>{plan.name}</h3>
                  <p>{plan.desc}</p>
                </article>
              ))}
            </div>
          </div>
          <ul className="sl-revenue">
            {business.revenue.map((item, index) => {
              const [title, ...description] = item.split(':');
              return (
                <li key={item}>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {businessIcons[index]}
                  </span>
                  <div>
                    <strong>{title}</strong>
                    <p>{description.join(':')}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="sl-cta">
          <h2>¿Listo para escuchar lo que tu tierra tiene que decir?</h2>
          <HeroActions large />
        </section>
      </main>

      <footer className="sl-footer">
        <div className="sl-footer-brand">
          <div className="sl-brand">
            <span className="sl-logo-mark" aria-hidden="true">q</span>
            <strong>qhiro</strong>
          </div>
          <p>{ui.landing.tagline}</p>
          <small>© 2024 qhiro. La tierra habla, el aire observa, la IA piensa.</small>
        </div>
        <div className="sl-footer-links">
          <div><strong>Producto</strong><a href="#solucion">Solución</a><a href="#ecosistema">Ecosistema</a><a href="#modelo">Hardware</a></div>
          <div><strong>Recursos</strong><a href="#support">Soporte</a><a href="#docs">Documentación</a><a href="#cases">Casos de éxito</a></div>
          <div><strong>Legal</strong><a href="#privacy">Privacidad</a><a href="#terms">Términos</a></div>
        </div>
      </footer>
    </div>
  );
}
