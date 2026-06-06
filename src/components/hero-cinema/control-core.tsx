"use client";

import { useEffect, useRef, useState } from "react";
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
  TypeScriptIcon,
  PythonIcon,
  NodeIcon,
  TailwindIcon,
  N8nIcon,
  SupabaseIcon,
  AirtableIcon,
  VercelIcon,
  GitHubIcon,
  WordPressIcon,
  WhatsAppIcon,
  MetaIcon,
  FigmaIcon,
  GsapIcon,
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
type Tech = { name: string; Icon: (p: IconProps) => JSX.Element; color: string };

// the six wiring positions feeding the core (fixed); the modules plugged into
// them cycle, so it reads as one operator running many tools.
const POSITIONS: { x: number; y: number; d: string }[] = [
  { x: 15, y: 17, d: "M15 17 C 31 17, 22 40, 34 40" },
  { x: 8, y: 50, d: "M8 50 C 24 50, 22 50, 34 50" },
  { x: 15, y: 83, d: "M15 83 C 31 83, 22 60, 34 60" },
  { x: 85, y: 17, d: "M85 17 C 69 17, 78 40, 66 40" },
  { x: 92, y: 50, d: "M92 50 C 76 50, 78 50, 66 50" },
  { x: 85, y: 83, d: "M85 83 C 69 83, 78 60, 66 60" },
];

// the pool of tools the operator works with — chips cycle through these
const POOL: Tech[] = [
  { name: "Next.js", Icon: NextjsIcon, color: "#ffffff" },
  { name: "React", Icon: ReactIcon, color: "#61DAFB" },
  { name: "TypeScript", Icon: TypeScriptIcon, color: "#3178C6" },
  { name: "Python", Icon: PythonIcon, color: "#3776AB" },
  { name: "Node.js", Icon: NodeIcon, color: "#339933" },
  { name: "Tailwind", Icon: TailwindIcon, color: "#06B6D4" },
  { name: "Supabase", Icon: SupabaseIcon, color: "#3ECF8E" },
  { name: "Airtable", Icon: AirtableIcon, color: "#18BFFF" },
  { name: "n8n", Icon: N8nIcon, color: "#EA4B71" },
  { name: "Vercel", Icon: VercelIcon, color: "#ffffff" },
  { name: "GitHub", Icon: GitHubIcon, color: "#ffffff" },
  { name: "WordPress", Icon: WordPressIcon, color: "#21759B" },
  { name: "Meta", Icon: MetaIcon, color: "#0866FF" },
  { name: "WhatsApp", Icon: WhatsAppIcon, color: "#25D366" },
  { name: "Figma", Icon: FigmaIcon, color: "#F24E1E" },
  { name: "GSAP", Icon: GsapIcon, color: "#88CE02" },
];

const INITIAL_SLOTS = [0, 6, 8, 1, 13, 12]; // Next.js, Supabase, n8n, React, WhatsApp, Meta

export function ControlCore() {
  const root = useRef<HTMLDivElement>(null);
  const [slots, setSlots] = useState<number[]>(INITIAL_SLOTS);
  const tickRef = useRef(0);

  // continuously swap one module at a time for a different tool (round-robin
  // over the six positions, each time picking a tool not currently shown).
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      setSlots((prev) => {
        const slot = tickRef.current % prev.length;
        tickRef.current += 1;
        const used = new Set(prev);
        let next = Math.floor(Math.random() * POOL.length);
        let guard = 0;
        while (used.has(next) && guard < 40) {
          next = (next + 1) % POOL.length;
          guard += 1;
        }
        const copy = [...prev];
        copy[slot] = next;
        return copy;
      });
    }, 1500);
    return () => window.clearInterval(id);
  }, []);

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
        {POSITIONS.map((pos, i) => (
          <g key={i}>
            <path
              className="cc-wire"
              d={pos.d}
              stroke="#3a434d"
              strokeWidth={0.5}
              strokeOpacity={0.6}
              strokeLinecap="round"
            />
            <circle className="cc-pulse" cx={0} cy={0} r={1.1} fill="#10b981" />
          </g>
        ))}
      </svg>

      {/* module chips — fixed positions, the plugged-in tool cycles */}
      {POSITIONS.map((pos, i) => {
        const tech = POOL[slots[i]];
        return (
          <div
            key={i}
            className="cc-chip absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <span
              className="grid h-11 w-11 place-items-center rounded-lg border bg-[#0a0d11] transition-[border-color,box-shadow] duration-500 ease-snap"
              style={{
                borderColor: `color-mix(in srgb, ${tech.color} 38%, rgba(255,255,255,0.06))`,
                boxShadow: `0 0 14px -2px color-mix(in srgb, ${tech.color} 45%, transparent)`,
              }}
            >
              <span key={tech.name} className="cc-swap grid place-items-center">
                <tech.Icon size={19} style={{ color: tech.color }} />
              </span>
            </span>
            <span
              key={`${tech.name}-l`}
              className="cc-swap font-mono text-[8.5px] uppercase tracking-[0.14em] text-v4-muted"
            >
              {tech.name}
            </span>
          </div>
        );
      })}

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
