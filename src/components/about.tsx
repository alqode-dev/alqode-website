"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useScrollRevealDramatic } from "@/lib/animations";
import { useDecryptOnHover } from "@/lib/decrypt";
import { ABOUT, waUrl } from "@/lib/constants";

function renderText(text: string) {
  const parts = text.split(/(\{alqode\})/g);
  return parts.map((part, i) =>
    part === "{alqode}" ? (
      <span key={i} className="text-terminal font-semibold">
        {"{alqode}"}
      </span>
    ) : (
      part
    )
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealedSet, setRevealedSet] = useState<Set<number>>(new Set());

  const handleReveal = useCallback((index: number) => {
    setRevealedSet((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  useScrollRevealDramatic(sectionRef, handleReveal);

  // Decrypt targets only revealed paragraphs
  useDecryptOnHover(sectionRef, "p[data-revealed]", {
    enabled: revealedSet.size > 0,
  });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-padding bg-light-bg text-void"
      aria-label="About"
    >
      <div className="container-width">
        <p className="reveal-item text-void/60 text-xs md:text-sm font-mono font-semibold tracking-[1px] mb-3 md:mb-4">
          &gt; founder.profile
        </p>
        <h2 className="reveal-item font-display text-[clamp(2.25rem,5.5vw,4rem)] font-normal italic leading-[1.02] tracking-tight mb-6 text-void">
          {ABOUT.heading}
        </h2>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Founder photo - 40% on desktop, full width mobile above text */}
          <div className="reveal-item w-full lg:w-[40%] flex-shrink-0">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-200">
              <Image
                src={ABOUT.founderImage}
                alt="Mohammed Hamdaan Dhaler, founder of alqode"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>

          {/* Text - 60% on desktop, staggers paragraph by paragraph */}
          <div className="flex-1 flex flex-col">
            <div className="space-y-4 flex-1">
              {ABOUT.paragraphs.map((p, i) => {
                const isBoldStandalone = p.bold && !p.highlight;
                const isIntro = p.bold && p.highlight;
                const isRevealed = revealedSet.has(i + 2);

                return (
                  <p
                    key={i}
                    {...(isRevealed ? { "data-revealed": true } : {})}
                    className={`reveal-item leading-relaxed ${
                      isBoldStandalone
                        ? "text-void font-bold text-xl md:text-[22px]"
                        : isIntro
                        ? "text-void font-semibold text-[15px] md:text-base"
                        : "text-light-muted text-sm md:text-[15px]"
                    }`}
                  >
                    {renderText(p.text)}
                  </p>
                );
              })}
            </div>

            {/* Credentials strip + CTA fills bottom of column */}
            <div className="reveal-item mt-8 lg:mt-10 pt-6 border-t border-void/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] md:text-xs text-light-muted font-medium tracking-wide uppercase">
                <span>Cape Town</span>
                <span className="text-terminal">·</span>
                <span>SA + UAE</span>
                <span className="text-terminal">·</span>
                <span>Booking now</span>
              </div>
              <a
                href={waUrl("about_cta")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-void text-light-bg px-5 py-3 rounded-lg text-sm font-bold hover:bg-void/85 transition-colors group/cta"
              >
                Work with us
                <ArrowRight size={14} className="group-hover/cta:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
