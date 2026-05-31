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

/* Mobile snake — vertical serpentine down its own band below the stacked text. */
const VB_M = { w: 420, h: 1240 };
const PATH_M =
  "M 214 -40 C 214 80 110 120 110 236 C 110 352 312 384 312 500 C 312 616 110 648 110 764 C 110 880 312 912 312 1028 C 312 1112 250 1190 214 1300";

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

const DURATION = 34; // seconds for one logo to travel the whole snake

export function StudioSnakeLine() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathDRef = useRef<SVGPathElement>(null);
  const pathMRef = useRef<SVGPathElement>(null);
  const nodeRefs = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const N = TECHS.length;

      const run = (path: SVGPathElement | null, vb: { w: number; h: number }) => {
        if (!path) return () => {};
        const L = path.getTotalLength();

        const place = (i: number, frac: number) => {
          const el = nodeRefs.current[i];
          if (!el) return;
          const pt = path.getPointAtLength(frac * L);
          el.style.left = `${(pt.x / vb.w) * 100}%`;
          el.style.top = `${(pt.y / vb.h) * 100}%`;
          // fade in/out near the off-screen ends so the loop wrap is invisible
          el.style.opacity = `${Math.max(0, Math.min(1, frac / 0.06, (1 - frac) / 0.06))}`;
        };

        if (reduce) {
          TECHS.forEach((_, i) => place(i, (i + 0.5) / N));
          return () => {};
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
      };

      mm.add("(min-width: 768px)", () => run(pathDRef.current, VB));
      mm.add("(max-width: 767px)", () => run(pathMRef.current, VB_M));

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none relative z-0 mt-4 h-[640px] w-full select-none md:absolute md:inset-0 md:mt-0 md:h-auto"
    >
      {/* Desktop snake path */}
      <svg
        className="absolute inset-0 hidden h-full w-full md:block"
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

      {/* Mobile snake path */}
      <svg
        className="absolute inset-0 block h-full w-full md:hidden"
        viewBox={`0 0 ${VB_M.w} ${VB_M.h}`}
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="snake-grad-m" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={VB_M.h}>
            <stop offset="0" stopColor="#3a4047" />
            <stop offset="0.5" stopColor="#7f8893" />
            <stop offset="1" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <path
          ref={pathMRef}
          d={PATH_M}
          stroke="url(#snake-grad-m)"
          strokeWidth={1.4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="snake-flow"
        />
      </svg>

      {/* Brand logos that ride the snake */}
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
  );
}
