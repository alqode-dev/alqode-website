"use client";

import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useScrollReveal } from "@/lib/animations";
import { FAQ } from "@/lib/constants";

export function Faq() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="section-padding"
      aria-label="Frequently Asked Questions"
    >
      <div className="container-width max-w-3xl">
        <p className="reveal-item text-terminal text-xs font-semibold tracking-[2.5px] uppercase mb-3 md:mb-4">
          {FAQ.tag}
        </p>
        <h2 className="reveal-item font-display text-[clamp(2rem,5vw,3.5rem)] font-normal italic leading-[1.05] tracking-tight mb-10 md:mb-12">
          {FAQ.heading}
        </h2>

        <div className="reveal-item divide-y divide-border border-y border-border">
          {FAQ.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full py-5 md:py-6 flex items-start justify-between gap-4 text-left group"
                >
                  <span
                    className={`text-base md:text-lg font-semibold transition-colors ${
                      isOpen ? "text-white" : "text-white/85 group-hover:text-white"
                    }`}
                  >
                    {item.q}
                  </span>
                  <span className="flex-shrink-0 mt-1 text-terminal transition-transform">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 ease-out"
                  style={{
                    maxHeight: isOpen ? "500px" : "0px",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p className="text-sm md:text-[15px] text-muted leading-relaxed pb-5 md:pb-6 pr-8">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
