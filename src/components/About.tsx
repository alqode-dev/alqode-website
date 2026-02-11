"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useScrollRevealDramatic } from "@/lib/animations";
import { useDecryptOnHover } from "@/lib/decrypt";
import { ABOUT } from "@/lib/constants";

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
        <h2 className="reveal-item text-[clamp(1.375rem,3vw,2rem)] font-bold mb-6 text-void">
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
          <div className="flex-1 space-y-4">
            {ABOUT.paragraphs.map((p, i) => {
              // "So I built the systems." = standalone bold, slightly LARGER
              const isBoldStandalone = p.bold && !p.highlight;
              const isIntro = p.bold && p.highlight;
              // Offset by 2 because heading (0) and photo (1) are reveal-items before paragraphs
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
        </div>
      </div>
    </section>
  );
}
