"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Braces, Zap, ShieldCheck } from "lucide-react";
import { SERVICES } from "@/lib/constants";

const ICONS = [Braces, Zap, ShieldCheck] as const;
const TOTAL = SERVICES.cards.length; // 3
const DEBOUNCE = 250; // ms between card switches

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const lastWheel = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mql = window.matchMedia("(min-width: 1024px)");
    let currentIndex = 0;
    let sectionInView = false;
    let wheelAttached = false;
    let hasScrolledInto = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          sectionInView = entry.isIntersecting;
          // Reset scroll-into flag when section leaves view
          if (!entry.isIntersecting) hasScrolledInto = false;
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(section);

    const handleWheel = (e: WheelEvent) => {
      if (!sectionInView) return;

      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      // At boundaries: let page scroll naturally
      if (scrollingUp && currentIndex === 0) return;
      if (scrollingDown && currentIndex === TOTAL - 1) return;

      // Kill the event — capture phase + stopPropagation ensures Lenis never sees it
      e.preventDefault();
      e.stopPropagation();

      // Scroll section into center view on first lock engagement
      if (!hasScrolledInto) {
        hasScrolledInto = true;
        section.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // Debounce the actual card switch
      const now = Date.now();
      if (now - lastWheel.current < DEBOUNCE) return;
      lastWheel.current = now;

      if (scrollingDown && currentIndex < TOTAL - 1) {
        currentIndex++;
      } else if (scrollingUp && currentIndex > 0) {
        currentIndex--;
      }

      setActiveIndex(currentIndex);
    };

    function attachWheel() {
      if (!wheelAttached) {
        window.addEventListener("wheel", handleWheel, { capture: true, passive: false });
        wheelAttached = true;
      }
    }

    function detachWheel() {
      if (wheelAttached) {
        window.removeEventListener("wheel", handleWheel, { capture: true });
        wheelAttached = false;
      }
    }

    const handleBreakpoint = () => {
      if (mql.matches) {
        attachWheel();
      } else {
        detachWheel();
        currentIndex = 0;
        setActiveIndex(0);
      }
    };

    handleBreakpoint();
    mql.addEventListener("change", handleBreakpoint);

    return () => {
      detachWheel();
      mql.removeEventListener("change", handleBreakpoint);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="section-padding"
      aria-label="Services"
    >
      <div className="container-width">
        <h2 className="text-[clamp(1.375rem,3vw,2rem)] font-bold mb-1">
          {SERVICES.heading}
        </h2>
        <p className="text-sm text-muted mb-8 md:mb-12">
          {SERVICES.subline}
        </p>

        {/* Desktop: scroll-controlled slideshow with horizontal layout */}
        <div className="hidden lg:block py-8">
          <div className="flex items-center gap-16">
            {/* Left: Icon morph area */}
            <div className="relative w-[160px] h-[160px] flex-shrink-0">
              {ICONS.map((Icon, i) => (
                <div
                  key={i}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    opacity: activeIndex === i ? 1 : 0,
                    transform: activeIndex === i ? "scale(1)" : "scale(0.7)",
                    filter: activeIndex === i ? "blur(0px)" : "blur(8px)",
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <Icon size={72} className="text-terminal" strokeWidth={1.5} />
                </div>
              ))}
            </div>

            {/* Right: Card content area */}
            <div className="relative flex-1 min-h-[220px]">
              {SERVICES.cards.map((card, i) => (
                <div
                  key={card.title}
                  className="absolute inset-0 flex flex-col"
                  style={{
                    opacity: activeIndex === i ? 1 : 0,
                    transform: activeIndex === i
                      ? "translateY(0)"
                      : activeIndex > i
                        ? "translateY(-20px)"
                        : "translateY(20px)",
                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    pointerEvents: activeIndex === i ? "auto" : "none",
                  }}
                >
                  <span className="text-[11px] font-mono text-terminal/60 mb-2">
                    0{i + 1}
                  </span>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed max-w-lg">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress dots - aligned under text column */}
          <div className="flex gap-2 mt-10 pl-[224px]">
            {SERVICES.cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor:
                    activeIndex === i
                      ? "rgb(16, 185, 129)"
                      : "rgba(255, 255, 255, 0.2)",
                  transform: activeIndex === i ? "scale(1.3)" : "scale(1)",
                }}
                aria-label={`Go to ${SERVICES.cards[i].title}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile: stacked cards with inline icons */}
        <div className="lg:hidden grid gap-3">
          {SERVICES.cards.map((card, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-xl border bg-card-bg border-border transition-all duration-500"
              >
                <div className="relative p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-terminal/[0.15]">
                      <Icon size={20} className="text-terminal/70" />
                    </div>
                    <span className="text-[11px] font-mono text-border font-bold">
                      0{i + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-bold mb-1.5 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-[13px] text-muted leading-relaxed">
                    {card.body}
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
