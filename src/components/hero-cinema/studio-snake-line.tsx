"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  NextjsIcon,
  ReactIcon,
  TypeScriptIcon,
  NodeIcon,
  PythonIcon,
  TailwindIcon,
  SupabaseIcon,
  AirtableIcon,
  N8nIcon,
  VercelIcon,
  GitHubIcon,
  WordPressIcon,
  WooCommerceIcon,
  MetaIcon,
  WhatsAppIcon,
  FigmaIcon,
  FramerIcon,
  GsapIcon,
  TECH_COLORS,
} from "../tech-icons";

gsap.registerPlugin(useGSAP);

type IconProps = { size?: number; style?: React.CSSProperties; className?: string };
type Tech = { name: string; Icon: (p: IconProps) => JSX.Element };

/* Desktop snake — a real S: enters left, dips DOWN deep under the paragraph,
   sweeps back UP to a high crest level with the heading, then comes down and
   exits low on the far right. Logos flow along it continuously, off all text. */
const VB = { w: 1200, h: 760 };
const PATH_D =
  "M -90 476 C 90 548 232 660 384 662 C 548 664 604 286 744 222 C 884 162 1008 280 1106 350 C 1246 492 1324 568 1460 612";

const TECHS: Tech[] = [
  { name: "Next.js", Icon: NextjsIcon },
  { name: "React", Icon: ReactIcon },
  { name: "TypeScript", Icon: TypeScriptIcon },
  { name: "Node.js", Icon: NodeIcon },
  { name: "Python", Icon: PythonIcon },
  { name: "Tailwind", Icon: TailwindIcon },
  { name: "Supabase", Icon: SupabaseIcon },
  { name: "Airtable", Icon: AirtableIcon },
  { name: "n8n", Icon: N8nIcon },
  { name: "Vercel", Icon: VercelIcon },
  { name: "GitHub", Icon: GitHubIcon },
  { name: "WordPress", Icon: WordPressIcon },
  { name: "WooCommerce", Icon: WooCommerceIcon },
  { name: "Meta", Icon: MetaIcon },
  { name: "WhatsApp", Icon: WhatsAppIcon },
  { name: "Figma", Icon: FigmaIcon },
  { name: "Framer", Icon: FramerIcon },
  { name: "GSAP", Icon: GsapIcon },
];

const DURATION = 34; // seconds for one logo to travel the whole desktop snake

/* A small brand chip used in the mobile marquee. */
function Chip({ tech }: { tech: Tech }) {
  const brand = TECH_COLORS[tech.name] ?? "#9aa3ad";
  return (
    <span className="flex shrink-0 items-center gap-2 rounded-full border border-white/[0.08] bg-[#0c0f13] px-3 py-1.5">
      <tech.Icon size={15} style={{ color: brand }} />
      <span className="font-mono text-[11px] tracking-[0.02em] text-v4-muted">{tech.name}</span>
    </span>
  );
}

export function StudioSnakeLine() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathDRef = useRef<SVGPathElement>(null);
  const nodeRefs = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const N = TECHS.length;
      const mm = gsap.matchMedia();

      // Desktop only: flow the logos continuously along the snake path.
      mm.add("(min-width: 768px)", () => {
        const path = pathDRef.current;
        if (!path) return;
        const L = path.getTotalLength();
        const place = (i: number, frac: number) => {
          const el = nodeRefs.current[i];
          if (!el) return;
          const pt = path.getPointAtLength(frac * L);
          el.style.left = `${(pt.x / VB.w) * 100}%`;
          el.style.top = `${(pt.y / VB.h) * 100}%`;
          el.style.opacity = `${Math.max(0, Math.min(1, frac / 0.06, (1 - frac) / 0.06))}`;
        };
        if (reduce) {
          TECHS.forEach((_, i) => place(i, (i + 0.5) / N));
          return;
        }
        const tick = (time: number) => {
          const base = time / DURATION;
          for (let i = 0; i < N; i++) {
            let frac = (base + i / N) % 1;
            if (frac < 0) frac += 1;
            place(i, frac);
          }
        };
        gsap.ticker.add(tick);
        return () => gsap.ticker.remove(tick);
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  // two marquee rows (split the stack), opposite directions
  const rowA = TECHS.slice(0, 9);
  const rowB = TECHS.slice(9);

  return (
    <div ref={rootRef} aria-hidden className="pointer-events-none select-none">
      {/* ===== DESKTOP: the snake overlay ===== */}
      <div className="absolute inset-0 hidden md:block">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="snake-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={VB.w} y2="0">
              <stop offset="0" stopColor="#3a4047" />
              <stop offset="0.5" stopColor="#7f8893" />
              <stop offset="1" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <path
            ref={pathDRef}
            d={PATH_D}
            stroke="url(#snake-grad)"
            strokeWidth={1.4}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="snake-flow"
          />
        </svg>
        {TECHS.map((tech, i) => {
          const brand = TECH_COLORS[tech.name] ?? "#ECEEF2";
          return (
            <div
              key={tech.name}
              ref={(el) => {
                if (el) nodeRefs.current[i] = el;
              }}
              className="snake-node absolute"
              style={{ left: "-100%", top: "-100%", opacity: 0, ["--brand" as string]: brand }}
            >
              <span className="snake-node__ring" />
              <tech.Icon size={20} className="snake-node__icon" />
              <span className="snake-node__label">{tech.name}</span>
            </div>
          );
        })}
      </div>

      {/* ===== MOBILE: a compact two-row tech marquee (no tall serpentine) ===== */}
      <div className="mt-9 md:hidden">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-v4-faint">
          / the stack
        </p>
        <div className="flex flex-col gap-2.5 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="marquee-track gap-2.5">
            {[...rowA, ...rowA].map((t, i) => (
              <Chip key={`a-${t.name}-${i}`} tech={t} />
            ))}
          </div>
          <div className="marquee-track gap-2.5" style={{ animationDirection: "reverse" }}>
            {[...rowB, ...rowB].map((t, i) => (
              <Chip key={`b-${t.name}-${i}`} tech={t} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
