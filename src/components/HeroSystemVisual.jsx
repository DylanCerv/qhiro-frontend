/** Decorative hero simulation: El Vigía + Centinelas + scan field */
export default function HeroSystemVisual() {
  return (
    <div className="sl-hero-visual" aria-hidden="true">
      <svg className="sl-hero-svg" viewBox="0 0 640 520" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="slField" x1="80" y1="120" x2="560" y2="480" gradientUnits="userSpaceOnUse">
            <stop stopColor="#54e98a" stopOpacity="0.22" />
            <stop offset="1" stopColor="#54e98a" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="slGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(320 210) rotate(90) scale(180 220)">
            <stop stopColor="#54e98a" stopOpacity="0.35" />
            <stop offset="1" stopColor="#54e98a" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="320" cy="390" rx="220" ry="70" fill="url(#slField)" />
        <circle cx="320" cy="210" r="180" fill="url(#slGlow)" />

        {/* Field grid */}
        <g stroke="#54e98a" strokeOpacity="0.18" strokeWidth="1">
          <path d="M90 320 L550 320" />
          <path d="M110 360 L530 360" />
          <path d="M140 400 L500 400" />
          <path d="M180 440 L460 440" />
          <path d="M200 300 L220 450" />
          <path d="M280 290 L300 460" />
          <path d="M360 290 L380 460" />
          <path d="M440 300 L460 450" />
        </g>

        {/* Radar rings */}
        <g className="sl-radar" stroke="#54e98a" strokeOpacity="0.35" fill="none">
          <circle cx="320" cy="250" r="48" />
          <circle cx="320" cy="250" r="88" />
          <circle cx="320" cy="250" r="132" />
          <path d="M320 250 L430 180" strokeOpacity="0.55" />
        </g>

        {/* Centinelas */}
        <g stroke="#92ccff" strokeWidth="2" fill="none">
          <path d="M170 390 V310" />
          <circle cx="170" cy="302" r="7" fill="#92ccff" fillOpacity="0.35" />
          <path d="M170 302 L155 288 M170 302 L185 288" />
          <path d="M470 395 V318" />
          <circle cx="470" cy="310" r="7" fill="#92ccff" fillOpacity="0.35" />
          <path d="M470 310 L455 296 M470 310 L485 296" />
          <path d="M250 410 V340" />
          <circle cx="250" cy="332" r="6" fill="#54e98a" fillOpacity="0.4" />
          <path d="M390 415 V345" />
          <circle cx="390" cy="337" r="6" fill="#54e98a" fillOpacity="0.4" />
        </g>

        {/* El Nido base */}
        <g transform="translate(286 395)">
          <rect x="0" y="0" width="68" height="28" rx="4" stroke="#e2e2e5" strokeOpacity="0.55" fill="#1a1c1e" />
          <rect x="10" y="-10" width="48" height="12" rx="2" stroke="#54e98a" strokeOpacity="0.7" />
          <text x="34" y="18" textAnchor="middle" fill="#54e98a" fontSize="8" fontFamily="Geist, sans-serif">
            NIDO
          </text>
        </g>

        {/* El Vigía drone */}
        <g className="sl-drone" transform="translate(268 148)">
          <ellipse cx="52" cy="58" rx="58" ry="10" fill="#54e98a" fillOpacity="0.12" />
          <path
            d="M12 34 H36 L44 42 H60 L68 34 H92"
            stroke="#e2e2e5"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <rect x="40" y="36" width="24" height="16" rx="4" fill="#54e98a" fillOpacity="0.9" />
          <circle cx="18" cy="34" r="10" stroke="#92ccff" strokeWidth="2" />
          <circle cx="86" cy="34" r="10" stroke="#92ccff" strokeWidth="2" />
          <circle cx="18" cy="34" r="3" fill="#92ccff" />
          <circle cx="86" cy="34" r="3" fill="#92ccff" />
          <path d="M52 52 V68" stroke="#54e98a" strokeWidth="2" />
          <circle cx="52" cy="72" r="4" fill="#54e98a" />
          <text x="52" y="18" textAnchor="middle" fill="#bbcbbb" fontSize="9" fontFamily="Geist, sans-serif">
            EL VIGÍA
          </text>
        </g>

        {/* Scan beam */}
        <path
          className="sl-scan"
          d="M320 220 L250 390 L390 390 Z"
          fill="#54e98a"
          fillOpacity="0.08"
          stroke="#54e98a"
          strokeOpacity="0.25"
        />
      </svg>
    </div>
  );
}
