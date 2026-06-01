"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";

/* Front-door intro: a 0->100 count over the brand mark while the WebGL hero
   preloads behind it, then a designed slide-away that reveals the hero. Adds
   html.v4-loading on mount and html.v4-loaded on exit so the hero headline can
   choreograph its own entrance off those classes (and stays visible without JS). */
export function IntroLoader() {
  const { active, progress } = useProgress();
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"loading" | "done" | "gone">("loading");

  const startRef = useRef<number | null>(null);
  const activeSeenRef = useRef(false);

  // remember whether the 3D actually registered any loads
  useEffect(() => {
    if (active) activeSeenRef.current = true;
  }, [active]);

  useEffect(() => {
    document.documentElement.classList.add("v4-loading");
    const MIN = 2200; // deliberate minimum so it reads as designed, not a stall
    const MAX = 5000; // never hang
    let raf = 0;

    const tick = (t: number) => {
      if (startRef.current == null) startRef.current = t;
      const elapsed = t - startRef.current;
      const ramp = Math.min(1, elapsed / MIN);
      const eased = 1 - Math.pow(1 - ramp, 3); // easeOutCubic
      const assetsReady = !activeSeenRef.current || !active || progress >= 100;
      const ready = elapsed >= MIN && (assetsReady || elapsed >= MAX);
      const shown = ready ? 100 : Math.min(99, Math.round(eased * 100));
      setCount(shown);
      if (shown >= 100) {
        setPhase("done");
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when the slide-away transition ends, flip the class and unmount
  const handleEnd = () => {
    if (phase !== "done") return;
    const html = document.documentElement;
    html.classList.remove("v4-loading");
    html.classList.add("v4-loaded");
    setPhase("gone");
  };

  if (phase === "gone") return null;

  return (
    <div
      className={`v4-loader ${phase === "done" ? "v4-loader--done" : ""}`}
      aria-hidden={phase === "done"}
      onTransitionEnd={handleEnd}
    >
      <div className="v4-loader__inner">
        <span className="v4-loader__mark">
          <span className="text-v4-accent">{"{"}</span>
          alqode
          <span className="text-v4-accent">{"}"}</span>
        </span>
        <span className="v4-loader__count">{String(count).padStart(3, "0")}</span>
      </div>
      <div className="v4-loader__bar">
        <span style={{ transform: `scaleX(${count / 100})` }} />
      </div>
    </div>
  );
}
