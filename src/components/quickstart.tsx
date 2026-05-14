"use client";

import { useRef } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { useScrollReveal } from "@/lib/animations";
import { QUICKSTART } from "@/lib/constants";

export function Quickstart() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="section-padding"
      aria-label="Get Started"
    >
      <div className="container-width">
        <p className="reveal-item text-terminal text-xs font-semibold tracking-[2.5px] uppercase mb-3 md:mb-4">
          {QUICKSTART.tag}
        </p>
        <h2 className="reveal-item text-[clamp(1.375rem,3vw,2rem)] font-extrabold leading-tight tracking-tight mb-3">
          {QUICKSTART.heading}
        </h2>
        <p className="reveal-item text-sm md:text-base text-muted leading-relaxed mb-10 md:mb-12 max-w-2xl">
          {QUICKSTART.subline}
        </p>
        <div className="grid gap-5 md:gap-6 md:grid-cols-2">
          {QUICKSTART.options.map((opt) => (
            <a
              key={opt.title}
              href={opt.href}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal-item group relative bg-card-bg border border-border rounded-2xl p-7 md:p-10 hover:border-terminal/40 transition-all duration-300 flex flex-col"
            >
              {/* Big ETA badge - top right */}
              <div className="absolute top-6 right-6 md:top-8 md:right-8 flex items-baseline gap-1 text-terminal">
                <Clock size={16} className="self-center" />
                <span className="text-3xl md:text-4xl font-extrabold leading-none tracking-tight">
                  {opt.eta}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold mb-3 pr-20 md:pr-24 tracking-tight">
                {opt.title}
              </h3>
              <p className="text-sm md:text-base text-muted leading-relaxed mb-6 md:mb-8 flex-1">
                {opt.description}
              </p>
              <span className="inline-flex items-center gap-2 text-sm md:text-base font-bold text-terminal group-hover:gap-3 transition-all">
                {opt.cta}
                <ArrowRight size={16} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
