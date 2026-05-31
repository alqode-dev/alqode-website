"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  NextjsIcon,
  ReactIcon,
  TypeScriptIcon,
  PythonIcon,
  N8nIcon,
  SupabaseIcon,
  AirtableIcon,
  MetaIcon,
  WooCommerceIcon,
  TECH_COLORS,
} from "../tech-icons";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type IconProps = { size?: number; style?: React.CSSProperties; className?: string };
type Tech = { name: string; Icon: (p: IconProps) => JSX.Element; t: number };

/* Landscape weave — lives in the lower band + the empty gutter between the text
   columns, never crossing the heading or paragraph. One calm rise through the
   gutter is the "up between the columns" moment, then it runs out to the right. */
const VB = { w: 1200, h: 760 };
const PATH_D =
  "M -60 590 C 140 590 300 588 432 578 C 520 570 560 372 690 372 C 762 372 782 520 862 528 C 1010 538 1190 530 1340 526";

/* The stack we reach for, strung along the line in build order. */
const TECHS: Tech[] = [
  { name: "Next.js", Icon: NextjsIcon, t: 0.1 },
  { name: "React", Icon: ReactIcon, t: 0.19 },
  { name: "TypeScript", Icon: TypeScriptIcon, t: 0.27 },
  { name: "Python", Icon: PythonIcon, t: 0.35 },
  { name: "n8n", Icon: N8nIcon, t: 0.45 },
  { name: "Supabase", Icon: SupabaseIcon, t: 0.585 },
  { name: "Airtable", Icon: AirtableIcon, t: 0.7 },
  { name: "Meta", Icon: MetaIcon, t: 0.785 },
  { name: "WooCommerce", Icon: WooCommerceIcon, t: 0.85 },
];

/* Portrait weave — vertical serpentine for the stacked (mobile) band below the text. */
const VB_M = { w: 420, h: 1240 };
const PATH_M =
  "M 214 -30 C 214 80 110 120 110 236 C 110 352 312 384 312 500 C 312 616 110 648 110 764 C 110 880 312 912 312 1028 C 312 1112 250 1190 214 1280";

/* Build order down the mobile serpentine. */
const TECHS_M_T = [0.05, 0.16, 0.27, 0.38, 0.49, 0.6, 0.71, 0.82, 0.92];

export function StudioSnakeLine() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathDRef = useRef<SVGPathElement>(null); // desktop
  const pathMRef = useRef<SVGPathElement>(null); // mobile
  const cometRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      const build = (
        path: SVGPathElement | null,
        vb: { w: number; h: number },
        ts: number[]
      ) => {
        if (!path) return () => {};
        const L = path.getTotalLength();
        path.style.strokeDasharray = `${L}`;
        path.style.strokeDashoffset = `${L}`;

        // Place each tech node at its point on the path, as a % of the box.
        const placed = TECHS.map((tech, i) => {
          const el = nodeRefs.current[i];
          const t = ts[i];
          const pt = path.getPointAtLength(t * L);
          if (el) {
            el.style.left = `${(pt.x / vb.w) * 100}%`;
            el.style.top = `${(pt.y / vb.h) * 100}%`;
          }
          return { el, t };
        });

        const comet = cometRef.current;
        const st = ScrollTrigger.create({
          trigger: root,
          start: "top 78%",
          end: "bottom 72%",
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            path.style.strokeDashoffset = `${L * (1 - p)}`;

            // Comet rides the drawing head.
            if (comet) {
              const head = path.getPointAtLength(Math.min(p, 1) * L);
              comet.style.left = `${(head.x / vb.w) * 100}%`;
              comet.style.top = `${(head.y / vb.h) * 100}%`;
              comet.style.opacity = p > 0.01 && p < 0.995 ? "1" : "0";
            }

            // Light each node as the head passes it, igniting to brand colour.
            placed.forEach(({ el, t }) => {
              if (!el) return;
              const lit = gsap.utils.clamp(0, 1, (p - t) / 0.045);
              el.style.setProperty("--lit", `${lit}`);
            });
          },
        });
        return () => st.kill();
      };

      mm.add("(min-width: 768px)", () =>
        build(pathDRef.current, VB, TECHS.map((t) => t.t))
      );
      mm.add("(max-width: 767px)", () =>
        build(pathMRef.current, VB_M, TECHS_M_T)
      );

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none relative z-0 mt-4 h-[600px] w-full select-none md:absolute md:inset-0 md:mt-0 md:h-auto"
    >
      {/* Desktop / landscape line */}
      <svg
        className="absolute inset-0 hidden h-full w-full md:block"
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="snake-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={VB.w} y2="0">
            <stop offset="0" stopColor="#565d66" />
            <stop offset="0.55" stopColor="#aab2bb" />
            <stop offset="0.86" stopColor="#aab2bb" />
            <stop offset="1" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <path
          ref={pathDRef}
          d={PATH_D}
          stroke="url(#snake-grad)"
          strokeWidth={1.6}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Mobile / portrait line */}
      <svg
        className="absolute inset-0 block h-full w-full md:hidden"
        viewBox={`0 0 ${VB_M.w} ${VB_M.h}`}
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="snake-grad-m" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={VB_M.h}>
            <stop offset="0" stopColor="#565d66" />
            <stop offset="0.55" stopColor="#aab2bb" />
            <stop offset="0.86" stopColor="#aab2bb" />
            <stop offset="1" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <path
          ref={pathMRef}
          d={PATH_M}
          stroke="url(#snake-grad-m)"
          strokeWidth={1.6}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Comet head riding the draw front */}
      <div
        ref={cometRef}
        className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{
          background: "#10b981",
          boxShadow: "0 0 12px 3px rgba(16,185,129,0.7), 0 0 26px 8px rgba(16,185,129,0.25)",
        }}
      />

      {/* Tech nodes — dim at rest, ignite to brand colour as the head passes */}
      {TECHS.map((tech, i) => {
        const brand = TECH_COLORS[tech.name] ?? "#ECEEF2";
        return (
          <div
            key={tech.name}
            ref={(el) => {
              if (el) nodeRefs.current[i] = el;
            }}
            className="snake-node absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: "-100%", top: "-100%", ["--brand" as string]: brand }}
          >
            <span className="snake-node__ring" />
            <tech.Icon size={22} className="snake-node__icon" />
            <span className="snake-node__label">{tech.name}</span>
          </div>
        );
      })}
    </div>
  );
}
