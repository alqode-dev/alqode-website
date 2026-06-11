"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TESTIMONIALS } from "@/lib/constants";
import { registerMachine, prefersReducedMotion, gsap, useGSAP } from "./machine";

/**
 * CLIENT PROOF — "the voices": client faces float as bubbles in a dark
 * cinematic space. The active one comes FORWARD (large, lit, close) and a
 * speech bubble unfurls with their words; the others drift BACK (small, dim,
 * deep). Tap any face to bring it forward; it also auto-plays. The focus moving
 * between them reads like a camera pulling from one person to the next. Built
 * in the machine language (chrome-ringed nodes, accent glow), original to
 * alqode, not a copy.
 */

const VOICES = TESTIMONIALS.items;

// slot geometry as % of the stage — speaker centred, the others drifting back
// in the top corners (kept clear of the speech bubble below)
const CENTER = { left: 50, top: 33, scale: 1, opacity: 1, blur: 0 };
const BG = [
  { left: 13, top: 18, scale: 0.5, opacity: 0.4, blur: 2.5 },
  { left: 87, top: 16, scale: 0.5, opacity: 0.4, blur: 2.5 },
];

function slotFor(i: number, active: number) {
  if (i === active) return CENTER;
  const others = VOICES.map((_, k) => k).filter((k) => k !== active);
  return BG[others.indexOf(i)] ?? BG[0];
}

export function ClientProof() {
  const root = useRef<HTMLDivElement>(null);
  const stageInner = useRef<HTMLDivElement>(null);
  const speech = useRef<HTMLDivElement>(null);
  const reduce = useRef(false);
  const paused = useRef(false);
  const [active, setActive] = useState(0);

  const focus = (i: number) => {
    setActive(i);
    paused.current = true;
    window.setTimeout(() => (paused.current = false), 9000);
  };

  // auto-advance through the voices
  useEffect(() => {
    reduce.current = prefersReducedMotion();
    if (reduce.current) return;
    const id = window.setInterval(() => {
      if (!paused.current) setActive((a) => (a + 1) % VOICES.length);
    }, 4400);
    return () => window.clearInterval(id);
  }, []);

  // idle drift + cursor parallax (cinematic depth)
  useGSAP(
    () => {
      registerMachine();
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".voice-float").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 ? 14 : -14,
          x: i % 2 ? -8 : 8,
          duration: 3 + i * 0.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
      const el = root.current;
      if (!el) return;
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(stageInner.current, { x: dx * 26, y: dy * 18, duration: 0.7, ease: "power2.out" });
      };
      el.addEventListener("pointermove", onMove);
      return () => el.removeEventListener("pointermove", onMove);
    },
    { scope: root }
  );

  // move each face to its slot when focus changes; unfurl the speech bubble
  useGSAP(
    () => {
      const nodes = gsap.utils.toArray<HTMLElement>(".voice-node");
      const instant = reduce.current;
      nodes.forEach((node) => {
        const i = Number(node.dataset.index);
        const s = slotFor(i, active);
        const scaleEl = node.querySelector<HTMLElement>(".voice-scale");
        node.style.zIndex = i === active ? "20" : "10";
        const to = { left: `${s.left}%`, top: `${s.top}%`, duration: instant ? 0 : 0.95, ease: "power3.inOut" };
        gsap.to(node, to);
        if (scaleEl)
          gsap.to(scaleEl, {
            scale: s.scale,
            opacity: s.opacity,
            filter: `blur(${s.blur}px)`,
            duration: instant ? 0 : 0.95,
            ease: "power3.inOut",
          });
      });
      if (speech.current && !instant) {
        gsap.fromTo(
          speech.current,
          { opacity: 0, scale: 0.92, y: 10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );
      }
    },
    { scope: root, dependencies: [active] }
  );

  const cur = VOICES[active];
  const location = cur.role.split(" · ")[1] ?? cur.role;

  return (
    <div
      ref={root}
      className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[radial-gradient(130%_100%_at_50%_0%,#0e1218_0%,#070809_70%)]"
    >
      {/* faint depth field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4] [background:radial-gradient(circle_at_50%_30%,rgba(16,185,129,0.10),transparent_55%)]"
      />

      <div ref={stageInner} className="relative h-[33rem] sm:h-[35rem] md:h-[40rem]">
        {/* the floating faces */}
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
                  <span
                    className={`relative block h-28 w-28 overflow-hidden rounded-full ring-1 transition-[box-shadow] duration-500 ${
                      i === active
                        ? "ring-v4-accent/60 shadow-[0_0_50px_-6px_rgba(16,185,129,0.5)]"
                        : "ring-white/15"
                    }`}
                  >
                    <Image src={c.photo} alt={`${c.client} owner`} fill sizes="112px" className="object-cover" />
                  </span>
                  {/* speaking pulse on the active face */}
                  {i === active && (
                    <span className="pointer-events-none absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full border-2 border-[#0a0d11] bg-v4-accent">
                      <span className="absolute inset-0 rounded-full bg-v4-accent opacity-70 [animation:ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite]" />
                    </span>
                  )}
                  <span className="mt-3 block whitespace-nowrap text-center font-mono text-[11px] uppercase tracking-[0.16em] text-v4-faint">
                    {c.client}
                  </span>
                </span>
              </span>
            </button>
          );
        })}

        {/* the speech bubble for the active voice */}
        <div
          ref={speech}
          className="absolute left-1/2 top-[52%] w-[min(90%,560px)] -translate-x-1/2"
        >
          {/* tail pointing up to the active face */}
          <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-v4-accent/30 bg-[#0c1014]" />
          <div className="relative rounded-2xl border border-v4-accent/25 bg-[#0c1014]/95 p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.95)] backdrop-blur-sm md:p-8">
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-v4-accent">
              <span className="machine-dot" data-on="true" /> speaking · {location}
            </span>
            <blockquote className="mt-3 font-display text-[clamp(1.15rem,2vw,1.6rem)] italic leading-relaxed text-v4-ink">
              {`“${cur.quote}”`}
            </blockquote>
            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-v4-muted">
                {cur.metric}
              </span>
              <a
                href={cur.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-v4-accent transition-opacity hover:opacity-70"
              >
                view live ↗
              </a>
            </div>
          </div>
        </div>

        {/* progress dots */}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
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
                  i === active ? "w-7 bg-v4-accent" : "w-1.5 bg-white/25 hover:bg-white/50"
                }`}
              />
            </button>
          ))}
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
