"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/lib/animations";
import { PROCESS, RETAINER, waUrl } from "@/lib/constants";
import { Bracketed } from "@/components/primitives/bracketed";
import { LiveStatus } from "@/components/primitives/live-status";
import { MonoTag } from "@/components/primitives/mono-tag";

export function System() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="system"
      className="section-padding relative overflow-hidden"
      aria-label="System — Process and Retainer"
    >
      {/* Soft ambient glow for visual differentiation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-terminal/[0.04] blur-[140px]" />
      </div>

      <div className="container-width relative z-10">
        {/* Header */}
        <p className="reveal-item text-terminal text-xs md:text-sm font-mono font-semibold tracking-[1px] mb-3 md:mb-4">
          &gt; system.lifecycle
        </p>
        <h2 className="reveal-item font-display text-[clamp(2.25rem,6vw,4.5rem)] italic font-normal leading-[1.0] tracking-tight mb-4 max-w-4xl">
          Build. Stay. Compound.
        </h2>
        <p className="reveal-item text-sm md:text-base text-muted leading-relaxed mb-14 md:mb-20 max-w-2xl">
          From first message to live system — and every month after. The full lifecycle, on autopilot.
        </p>

        {/* ── BEAT A: PIPELINE (first weeks) ─────────────── */}
        <div className="reveal-item mb-6 md:mb-8 flex items-center gap-3">
          <MonoTag variant="terminal">▸ first weeks</MonoTag>
          <span className="text-muted font-mono text-[10px] md:text-xs tracking-wide">
            how we build
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-terminal/40 to-transparent ml-2" />
        </div>

        <div className="reveal-item relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-5 mb-20 md:mb-28">
          {/* Connecting line — desktop only */}
          <div
            className="hidden lg:block absolute top-[19px] left-[40px] right-[40px] h-px bg-gradient-to-r from-terminal/60 via-terminal/60 to-terminal/15 pointer-events-none"
            aria-hidden="true"
          />

          {PROCESS.steps.map((step, i) => (
            <div key={step.num} className="relative">
              {/* Node circle */}
              <div className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-terminal bg-void mb-5">
                <span className="text-xs font-mono font-bold text-terminal">
                  {step.num}
                </span>
                {i === 0 && (
                  <span
                    className="absolute inset-0 rounded-full bg-terminal/30 animate-live-pulse"
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Step content */}
              <h3 className="text-base md:text-[17px] font-bold leading-tight mb-2">
                {step.title}
              </h3>
              <p className="text-xs md:text-sm text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Transition marker between beats */}
        <div className="reveal-item flex items-center justify-center gap-3 mb-12 md:mb-16">
          <div className="h-px w-12 md:w-24 bg-gradient-to-l from-terminal/40 to-transparent" />
          <MonoTag variant="terminal">
            <Bracketed tight>ongoing · every month</Bracketed>
          </MonoTag>
          <div className="h-px w-12 md:w-24 bg-gradient-to-r from-terminal/40 to-transparent" />
        </div>

        {/* ── BEAT B: DASHBOARD (every month after) ──────── */}
        <div className="reveal-item mb-6 md:mb-8 flex items-center gap-3">
          <MonoTag variant="terminal">▸ every month after</MonoTag>
          <span className="text-muted font-mono text-[10px] md:text-xs tracking-wide">
            how we stay
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-terminal/40 to-transparent ml-2" />
        </div>

        {/* Subscription dashboard panel */}
        <div className="reveal-item relative rounded-2xl border border-border bg-card-bg/60 backdrop-blur-sm p-6 md:p-8 mb-14 md:mb-20 overflow-hidden">
          {/* Dashboard top bar */}
          <div className="flex items-center justify-between gap-3 pb-5 mb-6 border-b border-white/[0.06] flex-wrap">
            <div className="flex items-center gap-3">
              <LiveStatus variant="live" size="md">
                subscription · active
              </LiveStatus>
            </div>
            <MonoTag variant="muted">monthly · ongoing</MonoTag>
          </div>

          {/* 2x2 dashboard tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {RETAINER.pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="relative rounded-xl border border-white/[0.06] bg-void/40 p-5 md:p-6 hover:border-terminal/30 transition-colors duration-300 ease-snap"
              >
                {/* Pulse dot top-left */}
                <div className="flex items-center justify-between mb-4">
                  <LiveStatus variant="live" size="xs">
                    live
                  </LiveStatus>
                  <MonoTag variant="muted">/system</MonoTag>
                </div>
                <h3 className="font-display text-xl md:text-2xl italic font-normal leading-tight mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs md:text-sm text-muted leading-relaxed">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Closer punch + CTA */}
        <div className="reveal-item max-w-3xl">
          <p className="text-base md:text-xl text-muted leading-relaxed mb-2">
            {RETAINER.closer.line1}
          </p>
          <p className="font-display text-2xl md:text-4xl italic leading-tight mb-8 md:mb-10">
            Our job is to make you so successful,{" "}
            <span className="text-terminal">your competitors run out of business.</span>
          </p>
          <a
            href={waUrl("retainer")}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 bg-terminal text-void px-6 py-3 rounded-lg text-sm font-bold hover:gap-3 transition-all duration-200 ease-snap"
          >
            {RETAINER.cta}
            <ArrowRight size={16} className="transition-transform duration-200 ease-snap group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
