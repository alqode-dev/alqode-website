"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor for the v4 site: a small inertial dot that lerp-follows the
 * pointer, plus a ring that lags slightly behind and grows over interactive
 * elements. Desktop pointer devices only; touch is untouched. Single rAF.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("v4-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let hovering = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const t = e.target as HTMLElement;
      hovering = !!t.closest("a, button, [role=button], input, textarea, label");
    };
    window.addEventListener("pointermove", onMove);

    const tick = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (dot.current) dot.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      if (ring.current) {
        ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${hovering ? 1.9 : 1})`;
        ring.current.style.borderColor = hovering ? "rgba(16,185,129,0.9)" : "rgba(255,255,255,0.35)";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("v4-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-9 w-9 rounded-full border transition-[border-color] duration-200"
        style={{ willChange: "transform" }}
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-[#10b981]"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
