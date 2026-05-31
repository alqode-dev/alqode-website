"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { waUrl } from "@/lib/constants";

/**
 * Interactive budget explorer. Drag from R0 upward and the tier reveals what
 * that money builds — getting the visitor to picture the system, not the price.
 * Deliberately NOT anchored at a single number; it shows the range of what is
 * possible. React state is fine here (user-driven, not per-frame).
 */
const MAX = 30000;
const STEP = 500;

const TIERS = [
  {
    min: 0,
    tag: "Free",
    title: "See it before you spend.",
    desc: "Send me your idea. Within 24 hours you get a real visual mockup. No cost, no obligation.",
    cta: "Get a free mockup",
    src: "v4_budget_free",
  },
  {
    min: 1500,
    tag: "Landing page",
    title: "A page that earns its place.",
    desc: "One sharp, custom page, live in days. The fastest way to stop looking like everyone else.",
    cta: "Start a landing page",
    src: "v4_budget_landing",
  },
  {
    min: 4000,
    tag: "Brand + site",
    title: "A brand and a website to carry it.",
    desc: "Identity and a multi-page site built as one system, designed to grow with you.",
    cta: "Build my brand and site",
    src: "v4_budget_brand",
  },
  {
    min: 7000,
    tag: "Commerce",
    title: "A store that sells while you sleep.",
    desc: "Full e-commerce, payments wired in, the retail engine. Every visit a chance to buy.",
    cta: "Build my store",
    src: "v4_budget_commerce",
  },
  {
    min: 12000,
    tag: "Automation",
    title: "Work that does itself.",
    desc: "WhatsApp and n8n pipelines: leads captured, booked, and followed up with no hands on deck.",
    cta: "Automate my business",
    src: "v4_budget_automation",
  },
  {
    min: 20000,
    tag: "The full machine",
    title: "Brand, site, store, automation.",
    desc: "The complete system, every layer under one roof, engineered so the parts compound.",
    cta: "Build the full machine",
    src: "v4_budget_full",
  },
];

const fmt = (n: number) => "R" + n.toLocaleString("en-ZA");

export function BudgetSlider() {
  const [value, setValue] = useState(4000);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const tier = useMemo(() => {
    let t = TIERS[0];
    for (const candidate of TIERS) if (value >= candidate.min) t = candidate;
    return t;
  }, [value]);

  const pct = (value / MAX) * 100;

  const setFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const raw = ((clientX - r.left) / r.width) * MAX;
    const snapped = Math.round(raw / STEP) * STEP;
    setValue(Math.max(0, Math.min(MAX, snapped)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) setFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") setValue((v) => Math.min(MAX, v + STEP));
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") setValue((v) => Math.max(0, v - STEP));
  };

  return (
    <div className="mt-14 max-w-[760px]">
      {/* live figure */}
      <div className="flex items-end justify-between gap-6">
        <span
          aria-live="polite"
          className="font-sans text-[clamp(2.6rem,7vw,5.5rem)] font-bold leading-none tracking-[-0.04em] text-white tabular-nums"
        >
          {fmt(value)}
          {value >= MAX && <span className="text-v4-ember">+</span>}
        </span>
        <span className="mb-2 font-mono text-[11px] uppercase tracking-[0.26em] text-v4-ember">
          {tier.tag}
        </span>
      </div>

      {/* track */}
      <div
        ref={trackRef}
        role="slider"
        aria-label="Project budget"
        aria-valuemin={0}
        aria-valuemax={MAX}
        aria-valuenow={value}
        aria-valuetext={`${fmt(value)}, ${tier.tag}`}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
        className="group relative mt-7 h-10 cursor-pointer touch-none select-none outline-none"
      >
        {/* rail */}
        <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/12" />
        {/* fill */}
        <div
          className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-v4-accent to-v4-ember"
          style={{ width: `${pct}%` }}
        />
        {/* tier ticks */}
        {TIERS.map((t) => (
          <span
            key={t.min}
            className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-white/20"
            style={{ left: `${(t.min / MAX) * 100}%` }}
          />
        ))}
        {/* handle */}
        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-v4-bg shadow-[0_0_0_4px_rgba(16,185,129,0.18)] transition-transform duration-150 group-focus-visible:ring-2 group-focus-visible:ring-v4-accent"
          style={{ left: `${pct}%` }}
        >
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-v4-ember" />
        </div>
      </div>
      <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-v4-faint">
        <span>R0</span>
        <span>Drag</span>
        <span>R30k+</span>
      </div>

      {/* tier reveal */}
      <div key={tier.tag} className="mt-10 animate-fade-up">
        <h3 className="max-w-[20ch] text-balance font-sans text-[clamp(1.5rem,3.4vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.025em] text-v4-ink">
          {tier.title}
        </h3>
        <p className="mt-4 max-w-[48ch] text-[clamp(1rem,1.5vw,1.2rem)] leading-relaxed text-v4-muted">
          {tier.desc}
        </p>
        <a
          href={waUrl(tier.src, `Hi, I'm thinking around ${fmt(value)} for a project. ${tier.title}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-v4-accent px-8 py-4 font-sans text-sm font-semibold text-v4-bg transition-transform duration-300 ease-out hover:scale-[1.04]"
        >
          {tier.cta}
          <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}
