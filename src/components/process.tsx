"use client";

import { useRef, useEffect, useState } from "react";
import { useScrollReveal } from "@/lib/animations";
import { PROCESS } from "@/lib/constants";

const TOTAL = PROCESS.steps.length; // 4

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  useScrollReveal(sectionRef);

  // Desktop: discrete wheel-hijack state
  const [activeStep, setActiveStep] = useState(-1);
  const [highestRevealed, setHighestRevealed] = useState(-1);
  const lastWheel = useRef(0);

  // Mobile: continuous scroll-driven state
  const [mobileLineProgress, setMobileLineProgress] = useState(0);

  // Desktop line progress derived from highestRevealed
  const desktopLineProgress = ((highestRevealed + 1) / TOTAL) * 100;

  // Desktop: wheel-hijack to reveal steps one at a time
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mql = window.matchMedia("(min-width: 1024px)");
    let sectionInView = false;
    let wheelAttached = false;
    let currentActive = -1;
    let currentHighest = -1;

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

      // Boundary: at step -1 scrolling up, or at last step scrolling down → let page scroll
      if (scrollingUp && currentActive <= -1) return;
      if (scrollingDown && currentActive >= TOTAL - 1) return;

      // Block scroll while section is locked (even during debounce)
      e.preventDefault();

      const now = Date.now();
      if (now - lastWheel.current < 400) return;
      lastWheel.current = now;

      if (scrollingDown) {
        currentActive++;
      } else if (scrollingUp) {
        currentActive--;
      }

      // highestRevealed only increases
      if (currentActive > currentHighest) {
        currentHighest = currentActive;
      }

      setActiveStep(currentActive);
      setHighestRevealed(currentHighest);
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

    const handleBreakpoint = () => {
      if (mql.matches) {
        attachWheel();
      } else {
        detachWheel();
        // Reset desktop state when switching to mobile
        currentActive = -1;
        currentHighest = -1;
        setActiveStep(-1);
        setHighestRevealed(-1);
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

  // Mobile: continuous scroll-driven timeline
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mql = window.matchMedia("(min-width: 1024px)");
    let rafId: number | null = null;
    let scrollAttached = false;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const rect = section.getBoundingClientRect();
        const windowH = window.innerHeight;

        const start = windowH * 0.8;
        const end = windowH * 0.3;

        if (rect.top > start) {
          setMobileLineProgress(0);
        } else if (rect.bottom < end) {
          setMobileLineProgress(100);
        } else {
          const totalTravel = rect.height + start - end;
          const traveled = start - rect.top;
          const progress = Math.max(0, Math.min(100, (traveled / totalTravel) * 100));
          setMobileLineProgress(progress);
        }
      });
    };

    function attachScroll() {
      if (!scrollAttached) {
        window.addEventListener("scroll", handleScroll, { passive: true });
        scrollAttached = true;
        handleScroll();
      }
    }

    function detachScroll() {
      if (scrollAttached) {
        window.removeEventListener("scroll", handleScroll);
        scrollAttached = false;
      }
    }

    const handleBreakpoint = () => {
      if (!mql.matches) {
        attachScroll();
      } else {
        detachScroll();
      }
    };

    handleBreakpoint();
    mql.addEventListener("change", handleBreakpoint);

    return () => {
      detachScroll();
      mql.removeEventListener("change", handleBreakpoint);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Mobile step active helper (continuous scroll-driven)
  const getMobileStepActive = (i: number) => {
    const threshold = ((i + 0.5) / TOTAL) * 100;
    return mobileLineProgress >= threshold;
  };

  // Desktop step visibility: revealed if <= highestRevealed
  const isDesktopStepRevealed = (i: number) => i <= highestRevealed;
  // Desktop step highlight: activeStep is the current focus
  const isDesktopStepActive = (i: number) => i <= activeStep;

  return (
    <section
      ref={sectionRef}
      id="process"
      className="section-padding"
      aria-label="Process"
    >
      <div className="container-width">
        <h2 className="reveal-item text-[clamp(1.375rem,3vw,2rem)] font-bold mb-1">
          {PROCESS.heading}
        </h2>
        <p className="reveal-item text-sm text-muted mb-8 lg:mb-12">
          {PROCESS.subline}
        </p>

        {/* Desktop horizontal layout - wheel-hijack */}
        <div className="hidden lg:block" ref={timelineRef}>
          <div className="grid grid-cols-4 gap-6 relative">
            {/* Horizontal connecting line */}
            <div className="absolute top-[18px] left-[18px] right-[18px] h-px bg-border">
              <div
                className="h-full bg-gradient-to-r from-terminal to-terminal/40"
                style={{
                  width: `${desktopLineProgress}%`,
                  transition: "width 0.4s ease-out",
                }}
              />
            </div>

            {PROCESS.steps.map((step, i) => {
              const revealed = isDesktopStepRevealed(i);
              const active = isDesktopStepActive(i);
              return (
                <div key={step.num} className="relative">
                  {/* Number circle */}
                  <div
                    className="w-9 h-9 rounded-full border-2 border-terminal bg-void flex items-center justify-center text-xs font-bold text-terminal mb-4 relative z-10"
                    style={{
                      opacity: revealed ? 1 : 0.3,
                      transform: revealed ? "scale(1)" : "scale(0.8)",
                      transition: "opacity 0.4s ease, transform 0.4s ease",
                    }}
                  >
                    {step.num}
                  </div>

                  {/* Content */}
                  <div
                    style={{
                      opacity: revealed ? (active ? 1 : 0.6) : 0.2,
                      transform: revealed ? "translateY(0)" : "translateY(8px)",
                      transition: "opacity 0.4s ease, transform 0.4s ease",
                    }}
                  >
                    <h3 className="text-[15px] font-bold mb-1.5">{step.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile vertical layout - continuous scroll-driven */}
        <div className="lg:hidden space-y-0">
          {PROCESS.steps.map((step, i) => {
            const active = getMobileStepActive(i);
            return (
              <div key={step.num} className="flex gap-4 relative">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-9 h-9 rounded-full border-2 border-terminal flex items-center justify-center text-xs font-bold text-terminal flex-shrink-0"
                    style={{
                      opacity: active ? 1 : 0.3,
                      transform: active ? "scale(1)" : "scale(0.8)",
                      transition: "opacity 0.4s ease, transform 0.4s ease",
                    }}
                  >
                    {step.num}
                  </div>
                  {i < PROCESS.steps.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-1.5 overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-b from-terminal/60 to-terminal/10"
                        style={{
                          height: active ? "100%" : "0%",
                          transition: "height 0.4s ease-out",
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div
                  className="pt-1.5 pb-6"
                  style={{
                    opacity: active ? 1 : 0.4,
                    transform: active ? "translateY(0)" : "translateY(8px)",
                    transition: "opacity 0.4s ease, transform 0.4s ease",
                  }}
                >
                  <h3 className="text-[15px] font-bold mb-1">{step.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {step.description}
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
