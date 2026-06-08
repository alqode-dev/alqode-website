"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TESTIMONIALS } from "@/lib/constants";
import { registerMachine, prefersReducedMotion, gsap, useGSAP } from "./machine";

/**
 * FIELD SIGNAL — client proof as the machine's own output.
 *
 * NOT a testimonial card with a headshot and a quote (that's the slop format).
 * Each deployed unit sends a RETURN SIGNAL back from the field: the outcome is
 * stated as a machine transformation (input → output), a live signal trace runs
 * underneath, and the client's words "decode in" as the received transmission.
 * One signal is locked at a time; the console auto-advances through the units
 * and pauses when you're reading it. Reduced motion rests on the first signal.
 */

const SIGNALS = TESTIMONIALS.items;

// a seamless signal trace (periodic over its width so it can loop without a seam)
const WAVE_D = (() => {
  const W = 1200;
  const mid = 22;
  const amp = 13;
  let d = `M0 ${mid}`;
  for (let x = 6; x <= W; x += 6) {
    const env = 0.5 + 0.5 * Math.sin((x / W) * Math.PI * 2 * 2);
    const y = mid + Math.sin((x / W) * Math.PI * 2 * 8) * amp * env;
    d += ` L${x} ${Math.round(y * 10) / 10}`;
  }
  return d;
})();

export function FieldSignal() {
  const root = useRef<HTMLDivElement>(null);
  const metric = useRef<HTMLDivElement>(null);
  const quote = useRef<HTMLQuoteElement>(null);
  const source = useRef<HTMLDivElement>(null);
  const origin = useRef<HTMLSpanElement>(null);
  const wave = useRef<SVGGElement>(null);
  const reduce = useRef(false);
  const [i, setI] = useState(0);

  // auto-advance, paused while the visitor is reading (hover)
  useEffect(() => {
    reduce.current = prefersReducedMotion();
    if (reduce.current) return;
    const el = root.current;
    let paused = false;
    const enter = () => (paused = true);
    const leave = () => (paused = false);
    el?.addEventListener("mouseenter", enter);
    el?.addEventListener("mouseleave", leave);
    const id = window.setInterval(() => {
      if (!paused) setI((p) => (p + 1) % SIGNALS.length);
    }, 5200);
    return () => {
      window.clearInterval(id);
      el?.removeEventListener("mouseenter", enter);
      el?.removeEventListener("mouseleave", leave);
    };
  }, []);

  // the trace runs continuously (loops by translating one full period)
  useGSAP(
    () => {
      registerMachine();
      if (prefersReducedMotion() || !wave.current) return;
      gsap.fromTo(
        wave.current,
        { x: 0 },
        { x: -600, duration: 7, ease: "none", repeat: -1 }
      );
    },
    { scope: root }
  );

  // each new signal "comes in": metric reveals, quote decodes, trace spikes
  useGSAP(
    () => {
      const m = metric.current;
      const q = quote.current;
      const s = source.current;
      const o = origin.current;
      if (!m || !q || !s || !o) return;
      if (reduce.current) return;
      gsap.fromTo(o, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "none" });
      gsap.fromTo(
        m,
        { opacity: 0, y: 14, clipPath: "inset(0 100% 0 0)" },
        { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "power3.out" }
      );
      gsap.fromTo(
        q,
        { opacity: 0, y: 14, filter: "blur(5px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power3.out", delay: 0.08 }
      );
      gsap.fromTo(
        s,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "none", delay: 0.12 }
      );
      if (wave.current) {
        gsap.fromTo(
          wave.current,
          { scaleY: 1.9 },
          { scaleY: 1, duration: 0.9, ease: "power2.out", transformOrigin: "center" }
        );
      }
    },
    { scope: root, dependencies: [i] }
  );

  const sig = SIGNALS[i];
  const [from, to] = sig.metric.split("→");

  return (
    <div
      ref={root}
      className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[linear-gradient(150deg,#0d1116_0%,#080a0e_72%)] shadow-[0_40px_90px_-55px_rgba(0,0,0,0.95)]"
    >
      {/* console header: origin + status */}
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] bg-[#080b0f] px-4 py-3 md:px-6">
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] md:text-[11px]">
          <span className="machine-dot" data-on="true" />
          <span className="text-v4-accent">signal in</span>
          <span ref={origin} className="text-v4-faint">
            :: {sig.role}
          </span>
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-v4-faint">
          decoded
        </span>
      </div>

      {/* live signal trace */}
      <svg
        aria-hidden
        viewBox="0 0 600 44"
        preserveAspectRatio="none"
        className="h-9 w-full text-v4-accent"
      >
        <g ref={wave}>
          <path d={WAVE_D} fill="none" stroke="currentColor" strokeWidth={1.2} strokeOpacity={0.5} />
          <path
            d={WAVE_D}
            transform="translate(1200 0)"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.2}
            strokeOpacity={0.5}
          />
        </g>
      </svg>

      {/* body */}
      <div className="px-6 pb-7 pt-6 md:px-10 md:pb-9 md:pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-v4-faint">
          / return signal
        </p>

        {/* the outcome, stated as a machine transformation */}
        <div
          ref={metric}
          className="mt-3 flex flex-wrap items-baseline gap-x-3 font-sans text-[clamp(2rem,6vw,3.6rem)] font-bold tracking-[-0.03em] text-v4-ink"
        >
          <span>{from.trim()}</span>
          <span className="text-v4-accent">→</span>
          <span>{to.trim()}</span>
        </div>

        {/* the received transmission */}
        <blockquote
          ref={quote}
          className="mt-5 max-w-[60ch] text-[clamp(1rem,1.5vw,1.18rem)] leading-relaxed text-v4-muted"
        >
          {`“${sig.quote}”`}
        </blockquote>

        {/* source node + signal selector */}
        <div className="mt-7 flex items-center justify-between gap-4">
          <div ref={source} className="flex items-center gap-3">
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/15">
              <Image src={sig.photo} alt={`${sig.client} owner`} fill sizes="44px" className="object-cover" />
              <span className="pointer-events-none absolute -left-1 -top-1 h-2.5 w-2.5 border-l border-t border-v4-accent/70" />
              <span className="pointer-events-none absolute -bottom-1 -right-1 h-2.5 w-2.5 border-b border-r border-v4-accent/70" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-v4-ink">
                {sig.client}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-v4-faint">
                {sig.name}
              </span>
            </span>
          </div>

          {/* which unit is transmitting */}
          <div className="flex items-center gap-2">
            {SIGNALS.map((s, idx) => (
              <button
                key={s.clientKey}
                type="button"
                aria-label={`Show signal from ${s.client}`}
                aria-pressed={idx === i}
                onClick={() => setI(idx)}
                className="group/dot grid h-6 place-items-center"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ease-snap ${
                    idx === i ? "w-7 bg-v4-accent" : "w-1.5 bg-white/25 group-hover/dot:bg-white/50"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
