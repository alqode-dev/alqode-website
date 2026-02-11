"use client";

import { useEffect, RefObject } from "react";

/**
 * Scroll reveal animation using IntersectionObserver.
 * Elements with class "reveal-item" inside the ref will fade in + slide up on scroll.
 */
export function useScrollReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const items = section.querySelectorAll(".reveal-item");

    // Set initial state
    items.forEach((item) => {
      const el = item as HTMLElement;
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            // Find index among siblings for stagger
            const siblings = Array.from(items);
            const index = siblings.indexOf(el);
            el.style.transitionDelay = `${index * 0.15}s`;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [ref]);
}

/**
 * Dramatic scroll reveal variant with more travel, slower timing, and wider stagger.
 * Used for the About section where paragraph-by-paragraph cascade should be very visible.
 * Optional onReveal callback fires after each item's transition completes (stagger + duration).
 */
export function useScrollRevealDramatic(
  ref: RefObject<HTMLElement | null>,
  onReveal?: (index: number) => void
) {
  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const items = section.querySelectorAll(".reveal-item");

    items.forEach((item) => {
      const el = item as HTMLElement;
      el.style.opacity = "0";
      el.style.transform = "translateY(32px)";
      el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    });

    const timers: ReturnType<typeof setTimeout>[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const siblings = Array.from(items);
            const index = siblings.indexOf(el);
            el.style.transitionDelay = `${index * 0.25}s`;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            observer.unobserve(el);

            if (onReveal) {
              // Fire after stagger delay + transition duration
              const delay = index * 250 + 800;
              timers.push(setTimeout(() => onReveal(index), delay));
            }
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    items.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [ref, onReveal]);
}
