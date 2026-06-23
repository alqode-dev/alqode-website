"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/constants";

/**
 * CLIENT PROOF — "THE TRANSFORMATION".
 *
 * Proof as the machine's core move: each client's system powering on. We show
 * the BEFORE (the problem they walked in on, as a fault state) resolving into
 * NOW RUNNING (the system the build deployed), inside one richly-built chrome
 * unit that ignites as you watch. This is the transformation made immersive —
 * what actually converts — not a quoted compliment and not a static card. The
 * founder rides along as the operator. Auto-advances through the three clients;
 * each switch re-runs the power-on. Reduced motion / no-JS rests on the running
 * state with all three legible in the sr-only list.
 */

const VOICES = TESTIMONIALS.items;

export function ClientProof() {
  const [active, setActive] = useState(0);
  const [online, setOnline] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  const cur = VOICES[active];
  const location = cur.role.split(" · ")[1] ?? cur.role;
  const [mBefore, mAfter] = cur.metric.split("→").map((s) => s.trim());

  // power-on sequence: show the fault briefly, then ignite to ONLINE
  useEffect(() => {
    if (reduce) {
      setOnline(true);
      return;
    }
    setOnline(false);
    const t = setTimeout(() => setOnline(true), 950);
    return () => clearTimeout(t);
  }, [active, reduce]);

  // auto-advance
  useEffect(() => {
    if (reduce || paused) return;
    const t = setInterval(() => setActive((p) => (p + 1) % VOICES.length), 5600);
    return () => clearInterval(t);
  }, [reduce, paused]);

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12">
        {/* ── the unit ──────────────────────────────────────────────── */}
        <div className="machine-panel machine-edge machine-ember-rim relative min-w-0 overflow-hidden rounded-xl border border-white/[0.08] p-5 sm:p-8 md:p-10">
          {/* corner brackets */}
          <span aria-hidden className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l border-t border-white/20" />
          <span aria-hidden className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r border-t border-white/20" />
          <span aria-hidden className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l border-white/20" />
          <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b border-r border-white/20" />

          {/* unit header: client + igniting status */}
          <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em]">
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="machine-dot" data-on={online ? "true" : undefined} aria-hidden />
              <span className="truncate text-v4-ink">{cur.client}</span>
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={`${active}-${online}`}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className={online ? "text-v4-accent" : "text-v4-ember"}
              >
                {online ? "▣ online" : "◇ fault"}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* before → now */}
          <div className="mt-8 md:mt-10">
            {/* before (the problem) — reads as a stalled fault */}
            <div className="flex items-start gap-3.5">
              <span className="mt-[0.45rem] h-px w-7 shrink-0 bg-v4-ember/50" aria-hidden />
              <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-v4-faint">
                  before
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`b-${active}`}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: online ? 0.45 : 0.8, y: 0 }}
                    transition={{ duration: 0.5, ease }}
                    className="mt-1.5 max-w-[34ch] text-[0.98rem] leading-snug text-v4-muted"
                  >
                    {cur.before}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* ignition seam — the pulse travels as it powers on */}
            <div className="relative my-6 ml-[2.6rem] h-px max-w-[36ch] overflow-hidden bg-white/[0.08]">
              <motion.span
                aria-hidden
                className="absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-transparent via-v4-accent to-transparent"
                initial={reduce ? false : { scaleX: 0, opacity: 0 }}
                animate={online ? { scaleX: 1, opacity: [0, 1, 0.25] } : { scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.7, ease }}
              />
            </div>

            {/* now running (what the system does) — the lit state */}
            <div className="flex items-start gap-3.5">
              <span
                className={`mt-[0.55rem] h-px w-7 shrink-0 transition-colors duration-500 ${
                  online ? "bg-v4-accent" : "bg-white/15"
                }`}
                aria-hidden
              />
              <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-v4-accent/80">
                  now running
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`a-${active}`}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: online ? 1 : 0.25, y: 0 }}
                    transition={{ duration: 0.6, delay: reduce ? 0 : 0.1, ease }}
                    className="mt-1.5 max-w-[28ch] font-display text-[clamp(1.5rem,3vw,2.4rem)] italic leading-[1.12] text-v4-ink"
                  >
                    {cur.after}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* footer: metric + operator */}
          <div className="mt-9 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-white/[0.07] pt-6">
            <a
              href={cur.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-w-0 items-center gap-3.5 transition-opacity hover:opacity-80"
            >
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md ring-1 ring-white/15">
                <Image src={cur.photo} alt={`${cur.client} founder`} fill sizes="40px" className="object-cover" />
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-[0.9rem] text-v4-ink">Founder, {cur.client}</span>
                <span className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-v4-accent">
                  {location} · visit ↗
                </span>
              </span>
            </a>
            <span className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-v4-muted">
              <span className="text-v4-ember">{mBefore}</span>
              <span className="text-v4-faint">→</span>
              <span className="text-v4-accent">{mAfter}</span>
            </span>
          </div>
        </div>

        {/* ── the switch rail ───────────────────────────────────────── */}
        <nav
          aria-label="Clients"
          className="flex min-w-0 flex-row gap-3 lg:flex-col lg:gap-4 lg:pt-2"
        >
          {VOICES.map((v, i) => {
            const on = i === active;
            return (
              <button
                key={v.clientKey}
                type="button"
                onClick={() => setActive(i)}
                aria-current={on}
                className={`group relative flex-1 overflow-hidden rounded-lg border px-4 py-3 text-left transition-colors lg:flex-none ${
                  on
                    ? "border-v4-accent/40 bg-white/[0.03]"
                    : "border-white/[0.07] hover:border-white/15"
                }`}
              >
                <span
                  className={`block truncate text-[0.92rem] tracking-tight transition-colors ${
                    on ? "text-v4-ink" : "text-v4-faint group-hover:text-v4-muted"
                  }`}
                >
                  {v.client}
                </span>
                <span className="mt-0.5 block truncate font-mono text-[10px] uppercase tracking-[0.14em] text-v4-faint">
                  {v.metric}
                </span>
                {/* active progress sweep */}
                {on && !reduce && (
                  <motion.span
                    key={active}
                    aria-hidden
                    className="absolute bottom-0 left-0 h-px bg-v4-accent"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: paused ? 0.3 : 5.6, ease: "linear" }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* SEO / screen-reader / no-JS fallback — full quotes */}
      <ul className="sr-only">
        {VOICES.map((c) => (
          <li key={c.clientKey}>
            {c.client}, {c.role}: before, {c.before} Now, {c.after} {c.quote}
          </li>
        ))}
      </ul>
    </div>
  );
}
