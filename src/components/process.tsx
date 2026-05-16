"use client";

import { useRef } from "react";
import { useScrollReveal } from "@/lib/animations";
import { PROCESS } from "@/lib/constants";

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="section-padding"
      aria-label="Process"
    >
      <div className="container-width">
        <p className="reveal-item text-terminal text-xs font-semibold tracking-[2.5px] uppercase mb-3 md:mb-4">
          {PROCESS.tag}
        </p>
        <h2 className="reveal-item font-display text-[clamp(2rem,5vw,3.5rem)] font-normal italic leading-[1.05] tracking-tight mb-3">
          {PROCESS.heading}
        </h2>
        <p className="reveal-item text-sm md:text-base text-muted leading-relaxed mb-10 md:mb-14 max-w-2xl">
          {PROCESS.subline}
        </p>

        {/* 4-step grid: stacked mobile, 4-col desktop with connecting line */}
        <div className="grid gap-6 md:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative">
          {/* Horizontal connecting line — desktop only */}
          <div
            className="hidden lg:block absolute top-[19px] left-[20px] right-[20px] h-px bg-gradient-to-r from-terminal via-terminal/60 to-terminal/15"
            aria-hidden="true"
          />

          {PROCESS.steps.map((step) => (
            <div key={step.num} className="reveal-item relative">
              <div className="w-10 h-10 rounded-full border-2 border-terminal bg-void flex items-center justify-center text-xs font-bold text-terminal mb-5 relative z-10">
                {step.num}
              </div>
              <h3 className="text-base md:text-lg font-bold mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
