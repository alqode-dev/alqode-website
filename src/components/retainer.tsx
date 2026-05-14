"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/lib/animations";
import { RETAINER, SITE } from "@/lib/constants";

export function Retainer() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="retainer"
      className="section-padding relative overflow-hidden"
      aria-label="Retainer Model"
    >
      {/* Subtle terminal glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-terminal/[0.04] blur-[120px]" />
      </div>

      <div className="container-width relative z-10">
        {/* Tag */}
        <p className="reveal-item text-terminal text-xs font-semibold tracking-[2.5px] uppercase mb-3 md:mb-4">
          {RETAINER.tag}
        </p>

        {/* Heading */}
        <h2 className="reveal-item text-[clamp(1.5rem,3.5vw,2.5rem)] font-extrabold leading-[1.1] tracking-tight mb-4 md:mb-5 max-w-3xl">
          {RETAINER.heading}
        </h2>

        {/* Subline */}
        <p className="reveal-item text-sm md:text-base text-muted leading-relaxed mb-12 md:mb-16 max-w-2xl">
          {RETAINER.subline}
        </p>

        {/* Pillars 2x2 grid */}
        <div className="reveal-item grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 md:gap-y-12 mb-12 md:mb-16">
          {RETAINER.pillars.map((pillar) => (
            <div key={pillar.title} className="relative pl-5">
              <div className="absolute left-0 top-1 bottom-1 w-px bg-terminal" />
              <h3 className="text-base md:text-lg font-bold mb-2 text-white">
                {pillar.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>

        {/* Closer punch line */}
        <div className="reveal-item border-t border-border pt-8 md:pt-12 mb-8 md:mb-10 max-w-3xl">
          <p className="text-base md:text-xl text-muted leading-relaxed mb-2">
            {RETAINER.closer.line1}
          </p>
          <p className="text-lg md:text-2xl font-bold text-white leading-tight">
            {RETAINER.closer.line2}
          </p>
        </div>

        {/* CTA */}
        <div className="reveal-item">
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-terminal text-void px-6 py-3 rounded-lg text-sm font-bold hover:bg-terminal/90 transition-colors"
          >
            {RETAINER.cta}
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
