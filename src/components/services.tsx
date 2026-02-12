"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Braces, Zap, ShieldCheck } from "lucide-react";
import { SERVICES } from "@/lib/constants";

const ICONS = [Braces, Zap, ShieldCheck] as const;
const TOTAL = SERVICES.cards.length; // 3

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const lockTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastWheel = useRef(0);

  // Desktop: scroll-controlled card switching
  // Uses wheel event to switch cards while section is in viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mql = window.matchMedia("(min-width: 1024px)");
    let currentIndex = 0;
    let sectionInView = false;
    let wheelAttached = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          sectionInView = entry.isIntersecting;
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

      // Block scroll while section is locked (even during debounce)
      e.preventDefault();

      const now = Date.now();
      if (now - lastWheel.current < 400) return;
      lastWheel.current = now;

      if (scrollingDown && currentIndex < TOTAL - 1) {
        currentIndex++;
      } else if (scrollingUp && currentIndex > 0) {
        currentIndex--;
      }

      setActiveIndex(currentIndex);
      setIsLocked(true);

      if (lockTimeout.current) clearTimeout(lockTimeout.current);
      lockTimeout.current = setTimeout(() => setIsLocked(false), 500);
    };

    function attachWheel() {
      if (!wheelAttached) {
        window.addEventListener("wheel", handleWheel, { passive: false });
        wheelAttached = true;
      }
    }

    function detachWheel() {
      if (wheelAttached) {
        window.removeEventListener("wheel", handleWheel);
        wheelAttached = false;
      }
    }

    // Respond to breakpoint changes (desktop <-> mobile)
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
      if (lockTimeout.current) clearTimeout(lockTimeout.current);
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
                  <Icon size={64} className="text-terminal" strokeWidth={1.5} />
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
