"use client";

import { useRef } from "react";
import Image from "next/image";
import { Quote, ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/lib/animations";
import { TESTIMONIALS } from "@/lib/constants";
import { ClientMiniLogo } from "@/components/client-logos-svg";

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="section-padding"
      aria-label="Testimonials"
    >
      <div className="container-width">
        <p className="reveal-item text-terminal text-xs font-semibold tracking-[2.5px] uppercase mb-3 md:mb-4">
          {TESTIMONIALS.tag}
        </p>
        <h2 className="reveal-item font-display text-[clamp(2rem,5vw,3.5rem)] font-normal italic leading-[1.05] tracking-tight mb-3">
          {TESTIMONIALS.heading}
        </h2>
        <p className="reveal-item text-sm md:text-base text-muted leading-relaxed mb-10 md:mb-14 max-w-2xl">
          {TESTIMONIALS.subline}
        </p>
        <div className="grid gap-5 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.items.map((t) => (
            <article
              key={t.client}
              className="reveal-item bg-card-bg border border-border rounded-2xl p-6 md:p-7 flex flex-col hover:border-terminal/30 transition-all duration-300"
            >
              <Quote size={22} className="text-terminal mb-4" aria-hidden="true" />
              <p className="text-sm md:text-[15px] leading-relaxed text-white/85 mb-6 flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-dim-bg">
                  <Image
                    src={t.photo}
                    alt={`${t.name} at ${t.client}`}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted mt-0.5">{t.role}</div>
                </div>
              </div>

              {/* Visit client */}
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${t.client}`}
                className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between gap-2 group/visit"
              >
                <ClientMiniLogo clientKey={t.clientKey} />
                <span className="inline-flex items-center gap-1 text-xs font-bold text-terminal group-hover/visit:gap-2 transition-all">
                  Visit
                  <ExternalLink size={11} />
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
