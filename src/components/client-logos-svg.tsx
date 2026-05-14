interface LogoProps {
  className?: string;
}

/**
 * Faida — 8-pointed asterisk with house cutout + wordmark.
 * User-approved from v2.4.
 */
function FaidaIcon({ className = "" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <mask id="faida-house-cutout">
          <rect width="60" height="60" fill="white" />
          <path
            d="M30 23 L37.5 30 L37.5 37.5 L22.5 37.5 L22.5 30 Z"
            fill="black"
          />
        </mask>
      </defs>
      <g mask="url(#faida-house-cutout)">
        <rect x="27" y="4" width="6" height="52" rx="3" />
        <rect
          x="27"
          y="4"
          width="6"
          height="52"
          rx="3"
          transform="rotate(45 30 30)"
        />
        <rect
          x="27"
          y="4"
          width="6"
          height="52"
          rx="3"
          transform="rotate(90 30 30)"
        />
        <rect
          x="27"
          y="4"
          width="6"
          height="52"
          rx="3"
          transform="rotate(135 30 30)"
        />
      </g>
    </svg>
  );
}

/**
 * Bochi Croffle — waffle-textured circle (croffle cross-section) + 3 decorative dots.
 * v2 trace: dense lattice for the woven croffle texture.
 */
function BochiIcon({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true">
      <defs>
        <mask id="bochi-waffle-mask">
          <rect width="60" height="60" fill="white" />
          {/* Vertical grooves */}
          <rect x="14.5" y="0" width="1.5" height="60" fill="black" />
          <rect x="20" y="0" width="1.5" height="60" fill="black" />
          <rect x="25.5" y="0" width="1.5" height="60" fill="black" />
          <rect x="31" y="0" width="1.5" height="60" fill="black" />
          <rect x="36.5" y="0" width="1.5" height="60" fill="black" />
          <rect x="42" y="0" width="1.5" height="60" fill="black" />
          {/* Horizontal grooves */}
          <rect x="0" y="14.5" width="60" height="1.5" fill="black" />
          <rect x="0" y="20" width="60" height="1.5" fill="black" />
          <rect x="0" y="25.5" width="60" height="1.5" fill="black" />
          <rect x="0" y="31" width="60" height="1.5" fill="black" />
          <rect x="0" y="36.5" width="60" height="1.5" fill="black" />
          <rect x="0" y="42" width="60" height="1.5" fill="black" />
        </mask>
      </defs>
      {/* Waffle circle */}
      <circle
        cx="28"
        cy="29"
        r="20"
        fill="currentColor"
        mask="url(#bochi-waffle-mask)"
      />
      {/* 3 decorative pearls above-left */}
      <circle cx="7" cy="10" r="1.4" fill="currentColor" />
      <circle cx="13" cy="7" r="1.4" fill="currentColor" />
      <circle cx="11" cy="15" r="1.4" fill="currentColor" />
    </svg>
  );
}

/**
 * Trophy SA — circular badge with stars + trophy cup inside.
 * v2 trace: outer ring + 5 stars across the top + filled trophy with handles.
 */
function TrophyBadgeIcon({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true">
      {/* Outer ring (open at top where stars cross it) */}
      <circle
        cx="30"
        cy="32"
        r="25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* 5 stars across the top, arcing along the ring */}
      <g fill="currentColor">
        {/* Center star (largest) */}
        <path d="M30 2 L31.4 5.4 L35 5.7 L32.2 8 L33 11.5 L30 9.5 L27 11.5 L27.8 8 L25 5.7 L28.6 5.4 Z" />
        {/* 4 smaller stars flanking it on the ring arc */}
        <path
          d="M30 5 L30.8 7 L33 7.2 L31.3 8.5 L31.8 10.5 L30 9.4 L28.2 10.5 L28.7 8.5 L27 7.2 L29.2 7 Z"
          transform="translate(-9 1)"
        />
        <path
          d="M30 5 L30.8 7 L33 7.2 L31.3 8.5 L31.8 10.5 L30 9.4 L28.2 10.5 L28.7 8.5 L27 7.2 L29.2 7 Z"
          transform="translate(9 1)"
        />
        <path
          d="M30 5 L30.8 7 L33 7.2 L31.3 8.5 L31.8 10.5 L30 9.4 L28.2 10.5 L28.7 8.5 L27 7.2 L29.2 7 Z"
          transform="translate(-15 4)"
        />
        <path
          d="M30 5 L30.8 7 L33 7.2 L31.3 8.5 L31.8 10.5 L30 9.4 L28.2 10.5 L28.7 8.5 L27 7.2 L29.2 7 Z"
          transform="translate(15 4)"
        />
      </g>

      {/* Trophy cup */}
      <g fill="currentColor">
        <path d="M22 19 L38 19 L37 32 Q37 38 30 38.5 Q23 38 23 32 Z" />
        {/* Stem */}
        <rect x="27.5" y="38.5" width="5" height="5" />
        {/* Base */}
        <rect x="21" y="43.5" width="18" height="2.5" rx="0.5" />
        <rect x="23" y="46" width="14" height="1.5" />
      </g>

      {/* Trophy handles (stroked outline curves) */}
      <path
        d="M22 22 Q16 23 16 28 Q16 32 22 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M38 22 Q44 23 44 28 Q44 32 38 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Logo components (icon + wordmark in flex row)
// ─────────────────────────────────────────────

export function FaidaLogo({ className = "" }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <FaidaIcon className="h-10 w-10 md:h-11 md:w-11 flex-shrink-0" />
      <span className="text-[26px] md:text-3xl font-bold tracking-tight lowercase leading-none">
        faida
      </span>
    </div>
  );
}

export function BochiLogo({ className = "" }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <BochiIcon className="h-11 w-11 md:h-12 md:w-12 flex-shrink-0" />
      <div className="flex flex-col leading-none">
        <span className="text-[26px] md:text-3xl font-extrabold tracking-tight lowercase">
          bochi
        </span>
        <span className="text-[8px] md:text-[9px] tracking-[3px] uppercase font-semibold mt-1">
          croffle
        </span>
      </div>
    </div>
  );
}

export function TrophyLogo({ className = "" }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <TrophyBadgeIcon className="h-11 w-11 md:h-12 md:w-12 flex-shrink-0" />
      <span className="text-xl md:text-2xl font-extrabold tracking-tight uppercase leading-none">
        Trophy SA
      </span>
    </div>
  );
}

export const CLIENT_LOGO_MAP = {
  bochi: BochiLogo,
  faida: FaidaLogo,
  trophy: TrophyLogo,
} as const;

export type ClientLogoKey = keyof typeof CLIENT_LOGO_MAP;
