"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { TESTIMONIALS } from "@/lib/constants";
import { registerMachine, prefersReducedMotion, gsap, useGSAP, SplitText } from "./machine";

/**
 * CLIENT PROOF — "the voices", cinematic 3D.
 *
 * The client faces are real bubbles floating in WebGL space (voices-scene.tsx):
 * the active speaker pushes forward and lit, the others drift back into soft,
 * fogged depth. Their words land LARGE below as crisp DOM text, line by line.
 * Auto-plays; tap a face (or a dot) to bring that person forward. Reduced motion
 * / no-WebGL falls back to static floating faces. Built on the same R3F engine
 * as the hero.
 */

const VoicesScene = dynamic(() => import("./voices-scene"), { ssr: false });
const VOICES = TESTIMONIALS.items;

function DomFaces({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <div className="absolute inset-0">
      {VOICES.map((c, i) => {
        const slot =
          i === active
            ? "left-1/2 top-[42%] h-32 w-32 md:h-40 md:w-40"
            : i === (active + 1) % 3
            ? "left-[16%] top-[26%] h-16 w-16 opacity-40 blur-[2px]"
            : "left-[84%] top-[24%] h-16 w-16 opacity-40 blur-[2px]";
        return (
          <button
            key={c.clientKey}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Show ${c.client}`}
            className={`absolute -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-1 transition-all duration-700 ${slot} ${
              i === active ? "ring-v4-accent/60 shadow-[0_0_50px_-6px_rgba(16,185,129,0.5)]" : "ring-white/15"
            }`}
          >
            <Image src={c.photo} alt={`${c.client} owner`} fill sizes="160px" className="object-cover" />
          </button>
        );
      })}
    </div>
  );
}

export function ClientProof() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const quoteEl = useRef<HTMLQuoteElement>(null);
  const splitRef = useRef<SplitText | null>(null);
  const reduce = useRef(false);
  const paused = useRef(false);
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [inView, setInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const focus = (i: number) => {
    setActive(i);
    paused.current = true;
    window.setTimeout(() => (paused.current = false), 10000);
  };

  useEffect(() => {
    reduce.current = prefersReducedMotion();
    const webgl = (() => {
      try {
        const c = document.createElement("canvas");
        return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
      } catch {
        return false;
      }
    })();
    setEnhanced(!reduce.current && webgl);
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.1 });
    if (stage.current) io.observe(stage.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce.current) return;
    const id = window.setInterval(() => {
      if (!paused.current) setActive((a) => (a + 1) % VOICES.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, []);

  // words land line by line on each focus change
  useGSAP(
    () => {
      registerMachine();
      if (reduce.current || !quoteEl.current) return;
      splitRef.current?.revert();
      const st = new SplitText(quoteEl.current, { type: "lines" });
      splitRef.current = st;
      gsap.from(st.lines, { yPercent: 40, opacity: 0, duration: 0.7, stagger: 0.09, ease: "power3.out" });
      return () => splitRef.current?.revert();
    },
    { scope: root, dependencies: [active] }
  );

  const cur = VOICES[active];
  const location = cur.role.split(" · ")[1] ?? cur.role;

  return (
    <div
      ref={root}
      className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[radial-gradient(140%_120%_at_50%_-10%,#0f141b_0%,#070809_72%)] px-5 pb-12 pt-6 md:px-10 md:pb-16 md:pt-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 [background:radial-gradient(circle_at_50%_16%,rgba(16,185,129,0.10),transparent_55%)]"
      />

      {/* cinematic 3D stage */}
      <div ref={stage} className="relative h-[23rem] sm:h-[26rem] md:h-[31rem]">
        {enhanced ? (
          <VoicesScene active={active} onSelect={focus} dpr={[1, isMobile ? 1.2 : 1.7]} paused={!inView} />
        ) : (
          <DomFaces active={active} onSelect={focus} />
        )}
      </div>

      {/* the words */}
      <div className="relative z-20 mx-auto -mt-2 max-w-[46rem] text-center md:-mt-6">
        <div className="flex items-center justify-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em]">
          <span className="machine-dot" data-on="true" />
          <span className="text-v4-accent">{cur.client}</span>
          <span className="text-v4-faint">· {location}</span>
        </div>

        <blockquote
          ref={quoteEl}
          className="mx-auto mt-5 max-w-[42rem] font-sans text-[clamp(1.4rem,3.2vw,2.5rem)] font-medium leading-[1.22] tracking-[-0.02em] text-v4-ink"
        >
          {cur.quote}
        </blockquote>

        <div className="mt-7 flex items-center justify-center gap-4 font-mono text-[11px] uppercase tracking-[0.18em]">
          <span className="rounded-md border border-v4-accent/30 px-2.5 py-1 text-v4-accent">{cur.metric}</span>
          <a
            href={cur.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-v4-faint transition-colors hover:text-v4-ink"
          >
            view live ↗
          </a>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {VOICES.map((c, i) => (
            <button
              key={c.clientKey}
              type="button"
              onClick={() => focus(i)}
              aria-label={`Show ${c.client}`}
              aria-pressed={i === active}
              className="grid h-6 place-items-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-500 ${
                  i === active ? "w-8 bg-v4-accent" : "w-1.5 bg-white/25 hover:bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <ul className="sr-only">
        {VOICES.map((c) => (
          <li key={c.clientKey}>
            {c.client}, {c.role}: {c.quote}
          </li>
        ))}
      </ul>
    </div>
  );
}
