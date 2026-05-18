"use client";

import { useEffect, useState } from "react";

/**
 * Thin scroll-progress bar fixed at top of viewport.
 * Tracks document scroll position; fills terminal-green left-to-right.
 * Subtle craft detail — gives the page a "loading bar" feel without being noisy.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        setProgress(Math.min(100, Math.max(0, pct)));
        rafId = null;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-terminal pointer-events-none origin-left"
      style={{
        transform: `scaleX(${progress / 100})`,
        transition: "transform 0.08s linear",
        boxShadow: "0 0 8px rgba(16, 185, 129, 0.6)",
      }}
      aria-hidden="true"
    />
  );
}
