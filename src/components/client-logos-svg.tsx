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
        <mask id="bochi-weave-mask">
          <rect width="60" height="60" fill="white" />
          {/* Diagonal lattice — basket weave: / direction */}
          <g stroke="black" strokeWidth="1.4" fill="none">
            <line x1="-5" y1="20" x2="40" y2="-25" />
            <line x1="-5" y1="28" x2="48" y2="-25" />
            <line x1="-5" y1="36" x2="56" y2="-25" />
            <line x1="-5" y1="44" x2="64" y2="-25" />
            <line x1="-5" y1="52" x2="72" y2="-25" />
            <line x1="-5" y1="60" x2="80" y2="-25" />
            <line x1="3" y1="60" x2="80" y2="-17" />
            <line x1="11" y1="60" x2="80" y2="-9" />
            <line x1="19" y1="60" x2="80" y2="-1" />
            <line x1="27" y1="60" x2="80" y2="7" />
          </g>
          {/* Diagonal lattice — basket weave: \ direction */}
          <g stroke="black" strokeWidth="1.4" fill="none">
            <line x1="-5" y1="-20" x2="40" y2="25" />
            <line x1="-5" y1="-12" x2="48" y2="41" />
            <line x1="-5" y1="-4" x2="56" y2="57" />
            <line x1="-5" y1="4" x2="64" y2="73" />
            <line x1="-5" y1="12" x2="72" y2="89" />
            <line x1="3" y1="-25" x2="80" y2="52" />
            <line x1="11" y1="-25" x2="80" y2="44" />
            <line x1="19" y1="-25" x2="80" y2="36" />
            <line x1="27" y1="-25" x2="80" y2="28" />
            <line x1="35" y1="-25" x2="80" y2="20" />
          </g>
        </mask>
      </defs>
      {/* Croissant: slightly oval shape with basket-weave texture */}
      <ellipse
        cx="28"
        cy="30"
        rx="20"
        ry="21"
        fill="currentColor"
        mask="url(#bochi-weave-mask)"
      />
      {/* 3 decorative pearls above-left */}
      <circle cx="6" cy="11" r="1.5" fill="currentColor" />
      <circle cx="12" cy="7" r="1.5" fill="currentColor" />
      <circle cx="10" cy="15" r="1.5" fill="currentColor" />
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

/**
 * Compact brand logo for testimonial cards and inline contexts.
 * Bochi uses the real auto-traced SVG. Faida + Trophy use hand-traced icons.
 */
export function ClientMiniLogo({
  clientKey,
}: {
  clientKey: ClientLogoKey;
}) {
  if (clientKey === "bochi") {
    // Real auto-traced SVG via CSS mask: currentColor controls fill,
    // letting the same asset render in brand color (here) or monochrome elsewhere.
    return (
      <span
        className="block w-[110px] h-8"
        role="img"
        aria-label="Bochi Croffle"
        style={{
          backgroundColor: "#7B1818",
          WebkitMaskImage: "url(/images/clients/bochi.svg)",
          maskImage: "url(/images/clients/bochi.svg)",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    );
  }
  if (clientKey === "faida") {
    return (
      <div
        className="inline-flex items-center gap-1.5"
        style={{ color: "#7B5BE5" }}
      >
        <FaidaIcon className="h-6 w-6" />
        <span className="text-sm font-bold tracking-tight lowercase leading-none">
          faida
        </span>
      </div>
    );
  }
  return (
    <div
      className="inline-flex items-center gap-1.5"
      style={{ color: "#B8895A" }}
    >
      <TrophyBadgeIcon className="h-6 w-6" />
      <span className="text-xs font-extrabold tracking-tight uppercase leading-none">
        Trophy SA
      </span>
    </div>
  );
}
