"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TESTIMONIALS } from "@/lib/constants";
import {
  registerMachine,
  prefersReducedMotion,
  gsap,
  useGSAP,
  SplitText,
} from "./machine";

/**
 * CLIENT PROOF — "the voices", cinematic.
 *
 * Client faces float as bubbles in a dark space with real depth (parallax,
 * depth-of-field, drifting motes). One is speaking: it sits forward and lit
 * while their words land LARGE below it, line by line, like film subtitles;
 * the others drift back, small and blurred. It auto-plays and the focus moving
 * person to person reads like a slow camera. Tap any face to bring it forward.
 * Built in the machine language, original to alqode.
 */

const VOICES = TESTIMONIALS.items;

// face slots as % of the constellation area — speaker centred, others drifting back
const CENTER = { left: 50, top: 52, scale: 1, opacity: 1, blur: 0 };
const BG = [
  { left: 12, top: 22, scale: 0.46, opacity: 0.38, blur: 3 },
  { left: 88, top: 18, scale: 0.46, opacity: 0.38, blur: 3 },
];

// ambient motes (fixed positions so render is deterministic)
const MOTES = [
  { x: 8, y: 30, s: 3, d: 0 }, { x: 22, y: 68, s: 2, d: 1.2 }, { x: 35, y: 18, s: 2, d: 0.6 },
  { x: 48, y: 80, s: 3, d: 1.8 }, { x: 62, y: 26, s: 2, d: 0.3 }, { x: 71, y: 72, s: 3, d: 1.1 },
  { x: 84, y: 40, s: 2, d: 1.5 }, { x: 92, y: 64, s: 2, d: 0.9 }, { x: 16, y: 50, s: 2, d: 2.1 },
  { x: 55, y: 12, s: 2, d: 0.7 }, { x: 78, y: 14, s: 2, d: 1.6 }, { x: 30, y: 88, s: 2, d: 0.4 },
];

function slotFor(i: number, active: number) {
  if (i === active) return CENTER;
  const others = VOICES.map((_, k) => k).filter((k) => k !== active);
  return BG[others.indexOf(i)] ?? BG[0];
}

export function ClientProof() {
  const root = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLDivElement>(null);
  const quoteEl = useRef<HTMLQuoteElement>(null);
  const meta = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitText | null>(null);
  const reduce = useRef(false);
  const paused = useRef(false);
  const [active, setActive] = useState(0);

  const focus = (i: number) => {
    setActive(i);
    paused.current = true;
    window.setTimeout(() => (paused.current = false), 10000);
  };

  useEffect(() => {
    reduce.current = prefersReducedMotion();
    if (reduce.current) return;
    const id = window.setInterval(() => {
      if (!paused.current) setActive((a) => (a + 1) % VOICES.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, []);

  // idle drift, parallax, drifting motes
  useGSAP(
    () => {
      registerMachine();
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".voice-float").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 ? 16 : -16,
          x: i % 2 ? -10 : 10,
          duration: 3.4 + i * 0.7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
      gsap.utils.toArray<HTMLElement>(".voice-mote").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 ? 22 : -22,
          opacity: 0.5,
          duration: 4 + (i % 5),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: (i % 6) * 0.4,
        });
      });
      const el = root.current;
      if (!el) return;
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(field.current, { x: dx * 34, y: dy * 22, duration: 0.8, ease: "power2.out" });
      };
      el.addEventListener("pointermove", onMove);
      return () => el.removeEventListener("pointermove", onMove);
    },
    { scope: root }
  );

  // focus change: faces glide to slots, words land line by line
  useGSAP(
    () => {
      const instant = reduce.current;
      gsap.utils.toArray<HTMLElement>(".voice-node").forEach((node) => {
        const i = Number(node.dataset.index);
        const s = slotFor(i, active);
        const scaleEl = node.querySelector<HTMLElement>(".voice-scale");
        node.style.zIndex = i === active ? "20" : "10";
        gsap.to(node, { left: `${s.left}%`, top: `${s.top}%`, duration: instant ? 0 : 1.05, ease: "power3.inOut" });
        if (scaleEl)
          gsap.to(scaleEl, {
            scale: s.scale,
            opacity: s.opacity,
            filter: `blur(${s.blur}px)`,
            duration: instant ? 0 : 1.05,
            ease: "power3.inOut",
          });
      });

      if (meta.current && !instant) {
        gsap.fromTo(meta.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.15 });
      }
      if (quoteEl.current && !instant) {
        splitRef.current?.revert();
        const st = new SplitText(quoteEl.current, { type: "lines" });
        splitRef.current = st;
        gsap.from(st.lines, {
          yPercent: 40,
          opacity: 0,
          duration: 0.75,
          stagger: 0.09,
          ease: "power3.out",
        });
      }
      return () => splitRef.current?.revert();
    },
    { scope: root, dependencies: [active] }
  );

  const cur = VOICES[active];
  const location = cur.role.split(" · ")[1] ?? cur.role;

  return (
    <div
      ref={root}
      className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[radial-gradient(140%_120%_at_50%_-10%,#0f141b_0%,#070809_72%)] px-5 pb-12 pt-8 md:px-10 md:pb-16 md:pt-12"
    >
      {/* atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_50%_22%,rgba(16,185,129,0.12),transparent_52%)]"
      />
      <div ref={field} className="relative">
        {/* drifting motes */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {MOTES.map((m, i) => (
            <span
              key={i}
              className="voice-mote absolute rounded-full bg-v4-accent/40"
              style={{ left: `${m.x}%`, top: `${m.y}%`, width: m.s, height: m.s, opacity: 0.2 }}
            />
          ))}
        </div>

        {/* the floating faces */}
        <div className="relative h-[17rem] sm:h-[19rem] md:h-[23rem]">
          {VOICES.map((c, i) => {
            const init = slotFor(i, 0);
            return (
              <button
                key={c.clientKey}
                data-index={i}
                type="button"
                onClick={() => focus(i)}
                aria-label={`Hear from ${c.client}`}
                className="voice-node absolute -translate-x-1/2 -translate-y-1/2 outline-none"
                style={{ left: `${init.left}%`, top: `${init.top}%`, zIndex: i === 0 ? 20 : 10 }}
              >
                <span
                  className="voice-scale block"
                  style={{ transform: `scale(${init.scale})`, opacity: init.opacity, filter: `blur(${init.blur}px)` }}
                >
                  <span className="voice-float relative block">
                    {/* halo on the speaker */}
                    {i === active && (
                      <span className="pointer-events-none absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.28),transparent_68%)] blur-md" />
                    )}
                    <span
                      className={`relative block h-32 w-32 overflow-hidden rounded-full ring-1 md:h-36 md:w-36 ${
                        i === active ? "ring-v4-accent/60" : "ring-white/15"
                      }`}
                    >
                      <Image src={c.photo} alt={`${c.client} owner`} fill sizes="144px" className="object-cover" />
                    </span>
                    {i === active && (
                      <span className="pointer-events-none absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full border-2 border-[#0a0d11] bg-v4-accent">
                        <span className="absolute inset-0 rounded-full bg-v4-accent opacity-70 [animation:ping_1.9s_cubic-bezier(0,0,0.2,1)_infinite]" />
                      </span>
                    )}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* the words, large and cinematic */}
        <div className="relative mx-auto mt-2 max-w-[46rem] text-center md:mt-4">
          <div ref={meta} className="flex items-center justify-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em]">
            <span className="machine-dot" data-on="true" />
            <span className="text-v4-accent">{cur.client}</span>
            <span className="text-v4-faint">· {location}</span>
          </div>

          <blockquote
            ref={quoteEl}
            className="mx-auto mt-5 max-w-[42rem] font-sans text-[clamp(1.45rem,3.4vw,2.6rem)] font-medium leading-[1.22] tracking-[-0.02em] text-v4-ink"
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

          {/* which voice */}
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
      </div>

      {/* readable fallback for SEO / screen readers / no-JS */}
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
