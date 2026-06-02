"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";

/* SYSTEM BOOT — the front door.
   The machine powers up: terminal boot lines print as the power level climbs
   0->100 while the WebGL hero preloads behind, then the panel ignites and
   slides away to reveal the hero. Keeps the proven timing model (time-floor
   blended with drei useProgress, hard cap) and the html.v4-loading ->
   v4-loaded class swap the hero headline keys its entrance off of. The boot
   lines are derived from the count, so they stay in lockstep and never stall. */

const BOOT_LINES = [
  { at: 3, text: "alqode.os" },
  { at: 28, text: "mounting studio modules" },
  { at: 55, text: "brand / web / commerce / motion / automation / software" },
  { at: 84, text: "core online :: igniting" },
];

export function IntroLoader() {
  const { active, progress } = useProgress();
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"loading" | "done" | "gone">("loading");

  const startRef = useRef<number | null>(null);
  const activeSeenRef = useRef(false);

  useEffect(() => {
    if (active) activeSeenRef.current = true;
  }, [active]);

  useEffect(() => {
    document.documentElement.classList.add("v4-loading");
    const MIN = 2400; // deliberate floor so the boot reads as designed, not a stall
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

  const handleEnd = () => {
    if (phase !== "done") return;
    const html = document.documentElement;
    html.classList.remove("v4-loading");
    html.classList.add("v4-loaded");
    setPhase("gone");
  };

  if (phase === "gone") return null;

  const lastVisible = BOOT_LINES.reduce(
    (acc, l, i) => (count >= l.at ? i : acc),
    -1
  );

  return (
    <div
      className={`v4-loader ${phase === "done" ? "v4-loader--done" : ""}`}
      aria-hidden={phase === "done"}
      onTransitionEnd={handleEnd}
    >
      <div className="v4-boot">
        <div className="v4-boot__head">
          <span className="v4-loader__mark">
            <span className="text-v4-accent">{"{"}</span>
            alqode
            <span className="text-v4-accent">{"}"}</span>
          </span>
          <span className="v4-boot__tag">system boot</span>
        </div>

        <div className="v4-boot__lines" aria-hidden>
          {BOOT_LINES.map((l, i) => {
            const visible = count >= l.at;
            const done = i < lastVisible || count >= 100;
            return (
              <div
                key={l.text}
                className="v4-boot__line"
                data-visible={visible ? "true" : "false"}
              >
                <span className="v4-boot__caret">{">"}</span>
                <span className="v4-boot__text">{l.text}</span>
                {visible && done ? (
                  <span className="v4-boot__ok">ok</span>
                ) : visible && i === lastVisible ? (
                  <span className="v4-boot__cursor" />
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="v4-boot__meter">
          <span className="v4-boot__power">power</span>
          <span className="v4-loader__count">{String(count).padStart(3, "0")}</span>
        </div>
      </div>

      <div className="v4-loader__bar">
        <span style={{ transform: `scaleX(${count / 100})` }} />
      </div>
    </div>
  );
}
