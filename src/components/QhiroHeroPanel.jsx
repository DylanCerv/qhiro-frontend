import QhiroDoodlePattern from './QhiroDoodlePattern';
import { ui } from '../i18n/es';

export default function QhiroHeroPanel({ children, compact = false }) {
  return (
    <div className={`qhiro-hero-split${compact ? ' qhiro-hero-compact' : ''}`}>
      <div className="qhiro-public-pattern" aria-hidden="true">
        <QhiroDoodlePattern />
      </div>
      <div className="qhiro-public-body">
        <div className="qhiro-public-content">
          <p className="qhiro-logo">qhiro</p>
          <p className="qhiro-tagline">{ui.landing.tagline}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
