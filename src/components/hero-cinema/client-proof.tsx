"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { TESTIMONIALS } from "@/lib/constants";

/**
 * CLIENT PROOF — reskinned from a premium 21st.dev editorial-testimonial pattern
 * into the alqode machine language. One compact, sophisticated composition that
 * cycles the three clients: an oversized ghosted case number with magnetic
 * parallax, a vertical FIELD REPORT rail + progress line, the metric as a mono
 * readout, a punchy pull-quote that lands word-by-word with a 3D flip, a
 * chrome-housed operator plate, and a faint client ticker. No client screenshots
 * (the work gallery owns those). The active content re-enters on change (no
 * blanking exit). Full quotes + reduced-motion fallback stay in the DOM.
 */

const VOICES = TESTIMONIALS.items;

export function ClientProof() {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { damping: 25, stiffness: 200 });
  const y = useSpring(mouseY, { damping: 25, stiffness: 200 });
  const numX = useTransform(x, [-300, 300], [-26, 26]);
  const numY = useTransform(y, [-200, 200], [-14, 14]);

  const onMove = (e: React.MouseEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseX.set(e.clientX - (r.left + r.width / 2));
    mouseY.set(e.clientY - (r.top + r.height / 2));
  };

  const go = (i: number) => setActive((i + VOICES.length) % VOICES.length);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setActive((p) => (p + 1) % VOICES.length), 7000);
    return () => clearInterval(t);
  }, [reduce]);

  const cur = VOICES[active];
  const location = cur.role.split(" · ")[1] ?? cur.role;
  const [beforeWord, afterWord] = cur.metric.split("→").map((s) => s.trim());

  const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };
  const word = {
    hidden: { opacity: 0, y: 14, rotateX: reduce ? 0 : 80 },
    visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div ref={containerRef} onMouseMove={onMove} className="relative">
      {/* oversized ghost case number, magnetic parallax */}
      <motion.div
        aria-hidden
        style={{ x: reduce ? 0 : numX, y: reduce ? 0 : numY }}
        className="pointer-events-none absolute -top-10 left-[-2vw] select-none text-[34vw] font-bold leading-none tracking-tighter text-white/[0.05] md:-top-24 md:text-[22rem]"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={active}
            initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(12px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            {String(active + 1).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      <div className="relative flex gap-7 md:gap-14">
        {/* vertical rail */}
        <div className="flex shrink-0 flex-col items-center">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-v4-faint"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            field report
          </span>
          <div className="relative mt-6 h-28 w-px bg-white/10 md:h-40">
            <motion.div
              className="absolute left-0 top-0 w-full origin-top bg-v4-accent shadow-[0_0_8px_rgba(16,185,129,0.7)]"
              animate={{ height: `${((active + 1) / VOICES.length) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <span className="mt-6 font-mono text-[10px] text-v4-faint">
            0{active + 1}/0{VOICES.length}
          </span>
        </div>

        {/* main */}
        <div className="min-w-0 flex-1 py-2 md:py-6">
          {/* the changing voice — one keyed block, re-enters on change (never blanks out) */}
          <motion.div
            key={active}
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } } }}
          >
            {/* client + metric readout */}
            <motion.div
              variants={fadeUp}
              className="mb-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em]"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] px-3 py-1">
                <span className="machine-dot" data-on="true" aria-hidden />
                <span className="text-v4-ink">{cur.client}</span>
                <span className="text-v4-faint">· {location}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-v4-accent/30 px-2 py-1 text-v4-accent">
                {beforeWord} <span className="text-v4-faint">→</span> {afterWord}
              </span>
            </motion.div>

            {/* the punchy pull-quote — word by word, 3D flip */}
            <blockquote className="mb-9 max-w-[26ch] font-sans text-[clamp(1.7rem,3.8vw,3rem)] font-light leading-[1.16] tracking-[-0.02em] text-v4-ink [perspective:900px]">
              {cur.pull.split(" ").map((w, i) => (
                <motion.span key={i} variants={word} className="mr-[0.26em] inline-block">
                  {w}
                </motion.span>
              ))}
            </blockquote>

            {/* operator */}
            <motion.a
              variants={fadeUp}
              href={cur.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3.5 transition-opacity hover:opacity-80"
            >
              <span className="machine-ember-rim relative h-12 w-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/15">
                <Image src={cur.photo} alt={`${cur.client} owner`} fill sizes="48px" className="object-cover" />
                <span className="pointer-events-none absolute -left-1 -top-1 h-2.5 w-2.5 border-l border-t border-v4-accent/70" />
                <span className="pointer-events-none absolute -bottom-1 -right-1 h-2.5 w-2.5 border-b border-r border-v4-accent/70" />
              </span>
              <span className="flex flex-col gap-0.5 leading-tight">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-v4-faint">// operator · {cur.name}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-v4-accent">view live ↗</span>
              </span>
            </motion.a>
          </motion.div>

          {/* persistent nav */}
          <div className="mt-9 flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Previous"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-v4-ink transition-colors hover:border-v4-accent hover:text-v4-accent"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Next"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-v4-ink transition-colors hover:border-v4-accent hover:text-v4-accent"
            >
              →
            </button>
            <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.18em] text-v4-faint">
              {VOICES.length} field reports · 2 countries
            </span>
          </div>
        </div>
      </div>

      {/* faint client ticker */}
      <div aria-hidden className="pointer-events-none mt-12 overflow-hidden opacity-[0.06] [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <motion.div
          className="flex whitespace-nowrap font-display text-5xl italic md:text-7xl"
          animate={reduce ? {} : { x: [0, -1200] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(8)].map((_, i) => (
            <span key={i} className="mx-6">
              {VOICES.map((v) => v.client).join("  ·  ")}  ·
            </span>
          ))}
        </motion.div>
      </div>

      {/* SEO / screen-reader / no-JS fallback — full quotes */}
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
