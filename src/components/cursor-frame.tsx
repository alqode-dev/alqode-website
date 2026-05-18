"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CursorFrame — custom desktop cursor: a { · } bracket pair following the pointer.
 * Hides the native cursor (via html.cursor-frame-active class set on mount).
 * Mobile / touch / no-hover devices: component renders nothing.
 *
 * On hover over interactive elements (a, button), the frame brackets expand
 * to indicate clickable state.
 */
export function CursorFrame() {
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // Detect desktop with hover pointer; enable only there.
  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // Set html class so CSS can hide native cursor.
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("cursor-frame-active");
    return () => document.documentElement.classList.remove("cursor-frame-active");
  }, [enabled]);

  // Follow pointer using requestAnimationFrame for smoothness.
  useEffect(() => {
    if (!enabled) return;
    let rafId: number | null = null;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (frameRef.current) {
        // direct positioning — let CSS transition handle smoothing
        frameRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
    };

    const handleEnterInteractive = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, label")) {
        setHovered(true);
      }
    };
    const handleLeaveInteractive = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, label")) {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleEnterInteractive);
    document.addEventListener("mouseout", handleLeaveInteractive);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleEnterInteractive);
      document.removeEventListener("mouseout", handleLeaveInteractive);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={frameRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100] -translate-x-1/2 -translate-y-1/2"
      style={{ willChange: "transform" }}
    >
      <div
        className={`relative flex items-center justify-center font-mono font-bold text-terminal transition-all duration-200 ease-snap ${
          hovered ? "gap-3 scale-110" : "gap-1.5 scale-100"
        }`}
        style={{ fontSize: hovered ? "16px" : "13px" }}
      >
        <span>{"{"}</span>
        <span
          className={`block rounded-full bg-terminal transition-all duration-200 ease-snap ${
            hovered ? "h-1.5 w-1.5 opacity-100" : "h-1 w-1 opacity-80"
          }`}
        />
        <span>{"}"}</span>
      </div>
    </div>
  );
}
