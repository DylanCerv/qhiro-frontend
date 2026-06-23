export default function QhiroDoodlePattern({ className = '' }) {
  return (
    <svg
      className={`block h-full min-h-full w-full ${className}`}
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M40 120c60-40 120-20 180 10s140 30 200 0 120-50 180-20 100 40 140 80"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M20 220c80 30 160 10 240-10s180-20 260 20 120 60 180 40"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M60 320c70-50 150-30 230-10s170 40 250 20 90-30 160-10"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M30 420c90 20 180 0 270-20s190-10 280 30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M100 80c30-25 70-35 110-20s60 45 40 80-70 35-110 10S70 105 100 80z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.9"
      />
      <path
        d="M520 90c35-20 75-15 105 10s25 55-5 75-60 10-85-15-20-45 5-60z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.85"
      />
      <path
        d="M650 180c25-30 60-40 95-25s45 50 25 80-55 30-85 10-40-35-20-55z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.8"
      />
      <path
        d="M120 480c40-15 85-10 120 15s35 55 10 85-65 25-95-5-35-50-10-75z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.85"
      />
      <path
        d="M420 440c50-20 105-15 150 15s40 65 10 95-70 25-105-5-45-55-15-80z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.8"
      />
      <circle cx="680" cy="420" r="28" stroke="currentColor" strokeWidth="2" opacity="0.7" />
      <circle cx="720" cy="380" r="14" stroke="currentColor" strokeWidth="1.8" opacity="0.6" />
      <circle cx="200" cy="160" r="18" stroke="currentColor" strokeWidth="1.8" opacity="0.65" />
      <circle cx="380" cy="260" r="22" stroke="currentColor" strokeWidth="2" opacity="0.75" />
      <circle cx="560" cy="340" r="16" stroke="currentColor" strokeWidth="1.8" opacity="0.6" />
      <path
        d="M300 520c20-35 55-50 90-35s45 45 25 75-60 25-90 5-30-30-5-45z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.7"
      />
      <path
        d="M600 60c15-20 40-28 65-15s28 38 12 58-42 22-62 8-18-32-5-45z"
        stroke="currentColor"
        strokeWidth="1.8"
        opacity="0.65"
      />
    </svg>
  );
}
