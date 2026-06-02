"use client";

import { useRef } from "react";
import {
  registerMachine,
  prefersReducedMotion,
  gsap,
  useGSAP,
  ScrollTrigger,
  SCRAMBLE_CHARS,
} from "./machine";

type Props = {
  /** module address, e.g. "module.work" */
  label: string;
  /** resting state text before the signal arrives */
  idle?: string;
  /** locked state once the module powers on */
  online?: string;
  /** optional trailing detail, e.g. "4 units" */
  detail?: string;
  className?: string;
};

/**
 * The machine's status primitive. Reads like a control-panel line:
 *
 *   ▸ module.work :: ■ ONLINE · 4 units
 *
 * On scroll into view the status dot ignites green and the status text
 * scrambles from IDLE to ONLINE (ScrambleText). Reduced motion → it simply
 * renders ONLINE, lit, no animation. Content is always present in the DOM, so
 * it never depends on JS to be readable.
 */
export function StatusReadout({
  label,
  idle = "IDLE",
  online = "ONLINE",
  detail,
  className = "",
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const status = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      registerMachine();
      const el = status.current;
      const d = dot.current;
      if (!el || !d) return;

      const ignite = () => {
        d.dataset.on = "true";
      };

      if (prefersReducedMotion()) {
        el.textContent = online;
        ignite();
        return;
      }

      el.textContent = idle;
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 82%",
        once: true,
        onEnter: () => {
          ignite();
          gsap.to(el, {
            duration: 0.9,
            ease: "none",
            scrambleText: {
              text: online,
              chars: SCRAMBLE_CHARS,
              speed: 0.6,
              revealDelay: 0.15,
            },
          });
        },
      });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className={`flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.22em] ${className}`}
    >
      <span className="text-v4-accent">▸</span>
      <span className="text-v4-faint">{label}</span>
      <span className="text-v4-faint/60">::</span>
      <span ref={dot} className="machine-dot" aria-hidden />
      <span ref={status} className="text-v4-ink">
        {online}
      </span>
      {detail && <span className="text-v4-faint">· {detail}</span>}
    </div>
  );
}
