import { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSystemVisual from '../components/HeroSystemVisual';
import QhiroLogo from '../components/brand/QhiroLogo';
import { ui } from '../i18n/es';

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBlJg5Jsy5C-OkFqKEr04SWhTtxjcpxPzkaAfYc1U_a3QT6ZtHLxZBtwGAZsETesA9DHX-kq7QUOqIuP86XLcB8YCGzxjqQGBXsJJhFN4fgjMYTsY4GNk6_gjhN10pm_K6TCgSh1Sxs2OQhxYdLVeFknJPNwrKo16mBVEHYshetbnbLYEYTCPO6uBPuvzo1ZungDwHxJpHgbvo-kLKb2tYJ7Rr6k-RCcDrFU8-2vCLlefDRq0wrK9QxyVNG_n4TlT1rcferZ5dBJD';

const VIDEO_SIMULATION =
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
const VIDEO_EXPLAIN =
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';

const problemIcons = ['person_off', 'agriculture', 'water_drop', 'visibility_off'];
const nodeIcons = ['warehouse', 'cell_tower', 'flight'];

function SectionHeader({ eyebrow, title, lead, align = 'center' }) {
  return (
    <header className={`sl-section-header sl-section-header--${align}`}>
      {eyebrow && <p>{eyebrow}</p>}
      <h2>{title}</h2>
      {lead && <p className="sl-section-lead">{lead}</p>}
    </header>
  );
}

function PrimaryCta({ large = false, label }) {
  return (
    <Link
      to="/register"
      className={`sl-button sl-button--primary${large ? ' sl-button--large' : ''}`}
    >
      {label}
      <span className="material-symbols-outlined" aria-hidden="true">
        arrow_forward
      </span>
    </Link>
  );
}

function HeroActions() {
  const { ctaPrimary, ctaSecondary } = ui.landing;
  return (
    <div className="sl-actions">
      <PrimaryCta label={ctaPrimary} />
      <a href="#videos" className="sl-button sl-button--secondary">
        {ctaSecondary}
      </a>
    </div>
  );
}

function MidCta({ title }) {
  return (
    <div className="sl-mid-cta">
      <p>{title}</p>
      <PrimaryCta label={ui.landing.ctaPrimary} />
    </div>
  );
}

function FaqList({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="sl-faq">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.q} className={`sl-faq-item${isOpen ? ' is-open' : ''}`}>
            <button
              type="button"
              className="sl-faq-trigger"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <span>{item.q}</span>
              <span className="material-symbols-outlined" aria-hidden="true">
                {isOpen ? 'remove' : 'add'}
              </span>
            </button>
            {isOpen && <p className="sl-faq-answer">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}

export default function Landing() {
  const {
    problem,
    product,
    capabilities,
    architecture,
    cycle,
    videos,
    results,
    faq,
    closing,
  } = ui.landing;

  return (
    <div className="stitch-landing">
      <header className="sl-nav">
        <Link to="/" className="sl-brand" aria-label="Qhiro Symbiotic inicio">
          <QhiroLogo variant="full" theme="dark" size={28} />
        </Link>
        <nav className="sl-nav-links" aria-label="Secciones">
          <a href="#problema">Problema</a>
          <a href="#resultado">Resultado</a>
          <a href="#videos">Cómo funciona</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="sl-nav-actions">
          <Link to="/login" className="sl-nav-login">
            {ui.landing.ctaLogin}
          </Link>
          <Link to="/register" className="sl-nav-register">
            {ui.landing.ctaPrimary}
          </Link>
        </div>
      </header>

      <main>
        <section
          className="sl-hero"
          style={{ '--sl-hero-image': `url("${HERO_IMAGE}")` }}
        >
          <div className="sl-hero-atmosphere" aria-hidden="true" />
          <div className="sl-hero-copy">
            <p className="sl-brand-hero">
              Qhiro <span>Symbiotic</span>
            </p>
            <h1>{ui.landing.heroTitle}</h1>
            <p className="sl-hero-lead">{ui.landing.heroLead}</p>
            <HeroActions />
            <p className="sl-hero-micro">{ui.landing.heroMicro}</p>
          </div>
          <HeroSystemVisual />
        </section>

        <section className="sl-proof" aria-label="Resultados del sistema">
          <div className="sl-proof-grid">
            {results.items.map((item) => (
              <article key={item.value} className="sl-proof-item">
                <strong>{item.value}</strong>
                <p>{item.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sl-section sl-section--deep" id="problema">
          <SectionHeader
            eyebrow={problem.eyebrow}
            title={problem.title}
            lead={problem.lead}
          />
          <div className="sl-problem-grid">
            {problem.items.map((item, index) => (
              <article key={item.title} className="sl-problem-item">
                <span className="sl-problem-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="material-symbols-outlined" aria-hidden="true">
                  {problemIcons[index]}
                </span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sl-section" id="resultado">
          <SectionHeader
            eyebrow={product.eyebrow}
            title={product.title}
            lead={product.lead}
          />
          <div className="sl-pillars">
            {product.pillars.map((pillar) => (
              <article key={pillar.title} className="sl-pillar">
                <h3>{pillar.title}</h3>
                <p>{pillar.desc}</p>
              </article>
            ))}
          </div>
          <MidCta title={ui.landing.midCtaAfterSolution} />
        </section>

        <section className="sl-section sl-section--deep" id="videos">
          <SectionHeader
            eyebrow={videos.eyebrow}
            title={videos.title}
            lead={videos.lead}
          />
          <div className="sl-video-grid">
            <figure className="sl-video-block">
              <div className="sl-video-frame">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster={HERO_IMAGE}
                  aria-label={videos.simulation.title}
                >
                  <source src={VIDEO_SIMULATION} type="video/mp4" />
                </video>
              </div>
              <figcaption>
                <strong>{videos.simulation.title}</strong>
                <span>{videos.simulation.desc}</span>
              </figcaption>
            </figure>
            <figure className="sl-video-block">
              <div className="sl-video-frame">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster={HERO_IMAGE}
                  aria-label={videos.explain.title}
                >
                  <source src={VIDEO_EXPLAIN} type="video/mp4" />
                </video>
              </div>
              <figcaption>
                <strong>{videos.explain.title}</strong>
                <span>{videos.explain.desc}</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="sl-flow" id="ciclo">
          <SectionHeader
            eyebrow={cycle.eyebrow}
            title={cycle.title}
            lead={cycle.lead}
          />
          <ol>
            {cycle.steps.map((step, index) => (
              <li key={step.title}>
                <span>{index + 1}</span>
                <strong>{step.title}</strong>
                <p>{step.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="sl-section" id="arquitectura">
          <SectionHeader
            eyebrow={architecture.eyebrow}
            title={architecture.title}
            lead={architecture.lead}
          />
          <div className="sl-nodes">
            {architecture.nodes.map((node, index) => (
              <article key={node.name} className="sl-node">
                <span className="material-symbols-outlined" aria-hidden="true">
                  {nodeIcons[index]}
                </span>
                <p className="sl-node-role">{node.role}</p>
                <h3>{node.name}</h3>
                <p>{node.desc}</p>
              </article>
            ))}
          </div>
          <p className="sl-core-banner">{architecture.core}</p>
          <div className="sl-benefit-list" aria-label="Beneficios operativos">
            {capabilities.items.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sl-section sl-section--deep" id="faq">
          <SectionHeader eyebrow={faq.eyebrow} title={faq.title} lead={faq.lead} />
          <FaqList items={faq.items} />
        </section>

        <section className="sl-cta" id="acceso">
          <p className="sl-cta-eyebrow">{closing.eyebrow}</p>
          <h2>{closing.title}</h2>
          <p className="sl-cta-lead">{closing.lead}</p>
          <div className="sl-actions sl-actions--large">
            <PrimaryCta large label={ui.landing.ctaPrimary} />
            <Link to="/login" className="sl-button sl-button--secondary sl-button--large">
              {ui.landing.ctaLogin}
            </Link>
          </div>
        </section>
      </main>

      <footer className="sl-footer">
        <div className="sl-footer-brand">
          <div className="sl-brand">
            <QhiroLogo variant="full" theme="dark" size={28} />
          </div>
          <p>{ui.landing.tagline}</p>
          <small>© {new Date().getFullYear()} Qhiro Symbiotic.</small>
        </div>
        <div className="sl-footer-links">
          <div>
            <strong>Legal</strong>
            <Link to="/terms">Términos</Link>
            <Link to="/privacy">Privacidad</Link>
          </div>
          <div>
            <strong>Acceso</strong>
            <Link to="/register">{ui.landing.ctaPrimary}</Link>
            <Link to="/login">{ui.landing.ctaLogin}</Link>
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
