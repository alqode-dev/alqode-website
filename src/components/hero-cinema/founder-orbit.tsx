"use client";

import { useRef } from "react";
import Image from "next/image";
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
  TECH_COLORS,
} from "../tech-icons";

gsap.registerPlugin(useGSAP);

type IconProps = { size?: number; style?: React.CSSProperties; className?: string };
type Ring = {
  rf: number; // radius as a fraction of the square's half-size
  speed: number; // radians / second
  dir: 1 | -1;
  techs: { name: string; Icon: (p: IconProps) => JSX.Element }[];
};

/* Three orbits of the systems we build with, circling the founder. */
const RINGS: Ring[] = [
  {
    rf: 0.56,
    speed: 0.13,
    dir: 1,
    techs: [
      { name: "Next.js", Icon: NextjsIcon },
      { name: "React", Icon: ReactIcon },
      { name: "TypeScript", Icon: TypeScriptIcon },
      { name: "Python", Icon: PythonIcon },
    ],
  },
  {
    rf: 0.76,
    speed: 0.09,
    dir: -1,
    techs: [
      { name: "Node.js", Icon: NodeIcon },
      { name: "Tailwind", Icon: TailwindIcon },
      { name: "Supabase", Icon: SupabaseIcon },
      { name: "n8n", Icon: N8nIcon },
      { name: "Airtable", Icon: AirtableIcon },
    ],
  },
  {
    rf: 0.95,
    speed: 0.066,
    dir: 1,
    techs: [
      { name: "Vercel", Icon: VercelIcon },
      { name: "GitHub", Icon: GitHubIcon },
      { name: "WordPress", Icon: WordPressIcon },
      { name: "WooCommerce", Icon: WooCommerceIcon },
      { name: "Meta", Icon: MetaIcon },
      { name: "WhatsApp", Icon: WhatsAppIcon },
    ],
  },
];

type Item = {
  name: string;
  Icon: (p: IconProps) => JSX.Element;
  rf: number;
  base: number;
  speed: number;
  dir: 1 | -1;
};

const ITEMS: Item[] = RINGS.flatMap((ring) =>
  ring.techs.map((t, i) => ({
    name: t.name,
    Icon: t.Icon,
    rf: ring.rf,
    base: (i / ring.techs.length) * Math.PI * 2,
    speed: ring.speed,
    dir: ring.dir,
  }))
);

export function FounderOrbit() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const place = (t: number) => {
        for (let i = 0; i < ITEMS.length; i++) {
          const el = dotRefs.current[i];
          if (!el) continue;
          const it = ITEMS[i];
          const a = it.base + it.dir * it.speed * t;
          // half-size of the box is 50%; rf is the fraction of that half used
          const x = 50 + Math.cos(a) * it.rf * 50;
          const y = 50 + Math.sin(a) * it.rf * 50;
          el.style.left = `${x}%`;
          el.style.top = `${y}%`;
          // slight depth: dim + shrink the ones on the far side (top half)
          const depth = (Math.sin(a) + 1) / 2; // 0 back .. 1 front
          el.style.opacity = `${0.45 + depth * 0.55}`;
          el.style.transform = `translate(-50%, -50%) scale(${0.86 + depth * 0.22})`;
          el.style.zIndex = `${Math.round(depth * 10)}`;
        }
      };

      if (reduce) {
        place(0);
        return;
      }
      const tick = (time: number) => place(time);
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className="relative mx-auto aspect-square w-full max-w-[440px]"
    >
      {/* universe glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.12),transparent_62%)] blur-[14px]" />

      {/* orbit guide rings */}
      {RINGS.map((r) => (
        <div
          key={r.rf}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.07]"
          style={{ width: `${r.rf * 100}%`, height: `${r.rf * 100}%` }}
        />
      ))}

      {/* the sun — founder */}
      <div className="absolute left-1/2 top-1/2 z-20 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-white/15 shadow-[0_0_40px_rgba(16,185,129,0.18)]">
        <Image
          src="/images/founder.jpg"
          alt="Mohammed Hamdaan Dhaler, founder of alqode"
          fill
          sizes="160px"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" />
      </div>

      {/* orbiting systems */}
      {ITEMS.map((it, i) => {
        const brand = TECH_COLORS[it.name] ?? "#ECEEF2";
        return (
          <div
            key={`${it.name}-${i}`}
            ref={(el) => {
              if (el) dotRefs.current[i] = el;
            }}
            className="snake-node absolute"
            style={{ left: "-100%", top: "-100%", ["--brand" as string]: brand }}
          >
            <span className="snake-node__ring" />
            <it.Icon size={19} className="snake-node__icon" />
          </div>
        );
      })}
    </div>
  );
}
