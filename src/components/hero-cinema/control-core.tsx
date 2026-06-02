"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  registerMachine,
  prefersReducedMotion,
  gsap,
  useGSAP,
  ScrollTrigger,
} from "./machine";
import {
  NextjsIcon,
  ReactIcon,
  N8nIcon,
  SupabaseIcon,
  WhatsAppIcon,
  MetaIcon,
} from "../tech-icons";

/**
 * THE CONTROL CORE — the founder section, rebuilt.
 *
 * NOT a solar system. This is a control schematic: the operator sits in a
 * chrome housing at the core, and the systems we build with are FIXED modules
 * wired into him. Signal pulses travel down the traces toward the core — the
 * systems answer to him, they route through him. On scroll-in the traces draw
 * (DrawSVG) and current starts flowing (MotionPath). Nothing orbits; it reads
 * like a wiring panel feeding a central unit, which is what a one-roof studio
 * actually is.
 */

type IconProps = { size?: number; style?: React.CSSProperties; className?: string };

type Sys = {
  name: string;
  Icon: (p: IconProps) => JSX.Element;
  color: string;
  x: number; // node position in 0..100 square space
  y: number;
  d: string; // wire path: starts at the node, ends at the core (so pulses flow IN)
};

// two flanking columns of modules wired into the central operator core
const SYSTEMS: Sys[] = [
  { name: "Next.js", Icon: NextjsIcon, color: "#ffffff", x: 15, y: 17, d: "M15 17 C 31 17, 22 40, 34 40" },
  { name: "Supabase", Icon: SupabaseIcon, color: "#3ECF8E", x: 8, y: 50, d: "M8 50 C 24 50, 22 50, 34 50" },
  { name: "n8n", Icon: N8nIcon, color: "#EA4B71", x: 15, y: 83, d: "M15 83 C 31 83, 22 60, 34 60" },
  { name: "React", Icon: ReactIcon, color: "#61DAFB", x: 85, y: 17, d: "M85 17 C 69 17, 78 40, 66 40" },
  { name: "WhatsApp", Icon: WhatsAppIcon, color: "#25D366", x: 92, y: 50, d: "M92 50 C 76 50, 78 50, 66 50" },
  { name: "Meta", Icon: MetaIcon, color: "#0866FF", x: 85, y: 83, d: "M85 83 C 69 83, 78 60, 66 60" },
];

export function ControlCore() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerMachine();
      const reduce = prefersReducedMotion();
      const wires = gsap.utils.toArray<SVGPathElement>(".cc-wire");
      const pulses = gsap.utils.toArray<SVGCircleElement>(".cc-pulse");
      const chips = gsap.utils.toArray<HTMLElement>(".cc-chip");

      if (reduce) {
        gsap.set(wires, { drawSVG: "100%" });
        gsap.set(pulses, { opacity: 0 });
        return;
      }

      // resting state: traces empty, modules dim, no current
      gsap.set(wires, { drawSVG: "0%" });
      gsap.set(pulses, { opacity: 0 });
      gsap.set(chips, { opacity: 0.35, scale: 0.92 });

      ScrollTrigger.create({
        trigger: root.current,
        start: "top 78%",
        once: true,
        onEnter: () => {
          // modules power on
          gsap.to(chips, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.08,
          });
          // traces draw from each module into the core
          gsap.to(wires, {
            drawSVG: "100%",
            duration: 0.9,
            ease: "power2.inOut",
            stagger: 0.08,
          });
          // current begins flowing toward the core, once traces exist
          pulses.forEach((p, i) => {
            const path = wires[i];
            if (!path) return;
            gsap.set(p, { opacity: 0 });
            gsap.to(p, {
              motionPath: { path, start: 0, end: 1 },
              duration: 2.1,
              ease: "none",
              repeat: -1,
              delay: 0.8 + i * 0.28,
              onStart: () => gsap.to(p, { opacity: 1, duration: 0.3 }),
            });
          });
        },
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative mx-auto aspect-square w-full max-w-[460px]">
      {/* core glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[44%] w-[44%] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[radial-gradient(circle,rgba(16,185,129,0.16),transparent_68%)] blur-[18px]" />

      {/* wire layer (square viewBox maps 1:1 to the container) */}
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        fill="none"
      >
        {SYSTEMS.map((s) => (
          <g key={s.name}>
            <path
              className="cc-wire"
              d={s.d}
              stroke={s.color}
              strokeWidth={0.5}
              strokeOpacity={0.4}
              strokeLinecap="round"
            />
            <circle className="cc-pulse" cx={0} cy={0} r={1.1} fill={s.color}>
            </circle>
          </g>
        ))}
      </svg>

      {/* module chips, fixed in place and wired in */}
      {SYSTEMS.map((s) => (
        <div
          key={s.name}
          className="cc-chip absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
        >
          <span
            className="grid h-11 w-11 place-items-center rounded-lg border bg-[#0a0d11]"
            style={{
              borderColor: `color-mix(in srgb, ${s.color} 38%, rgba(255,255,255,0.06))`,
              boxShadow: `0 0 14px -2px color-mix(in srgb, ${s.color} 45%, transparent)`,
            }}
          >
            <s.Icon size={19} style={{ color: s.color }} />
          </span>
          <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-v4-muted">
            {s.name}
          </span>
        </div>
      ))}

      {/* the operator core — a chrome housing, not a sun */}
      <div className="absolute left-1/2 top-1/2 z-20 aspect-[4/5] w-[32%] -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/15 shadow-[0_0_36px_-6px_rgba(16,185,129,0.35)]">
          <Image
            src="/images/founder.jpg"
            alt="Mohammed Hamdaan Dhaler, founder of alqode"
            fill
            sizes="180px"
            className="object-cover"
          />
          {/* readout strip across the bottom of the housing */}
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-black/85 to-transparent px-2 pb-1.5 pt-5">
            <span className="machine-dot" data-on="true" />
            <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-v4-ink">
              Operator
            </span>
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
        </div>
        {/* bracket corner furniture on the housing */}
        <span className="pointer-events-none absolute -left-1.5 -top-1.5 h-3 w-3 border-l border-t border-v4-accent/70" />
        <span className="pointer-events-none absolute -right-1.5 -top-1.5 h-3 w-3 border-r border-t border-v4-accent/70" />
        <span className="pointer-events-none absolute -bottom-1.5 -left-1.5 h-3 w-3 border-b border-l border-v4-accent/70" />
        <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 h-3 w-3 border-b border-r border-v4-accent/70" />
      </div>
    </div>
  );
}
