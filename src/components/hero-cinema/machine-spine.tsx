"use client";

import { useRef } from "react";
import {
  registerMachine,
  prefersReducedMotion,
  gsap,
  useGSAP,
  ScrollTrigger,
  DrawSVGPlugin,
} from "./machine";

/**
 * THE SPINE — the machine's signal bus.
 *
 * One vertical line runs down the left rail of the whole page. It DRAWS as you
 * scroll (DrawSVG scrubbed to the page's scroll), so the machine reads as
 * powering up top-to-bottom. A bright energy pulse travels down the drawn
 * portion continuously, like current on a wire. Branch ticks mark where each
 * module taps the bus.
 *
 * It sits in the left padding gutter (z above the opaque section backgrounds,
 * below the text), so it never collides with copy. Reduced motion → fully
 * drawn, static, no pulse.
 */

// viewBox is stretched to the gutter's real pixel height via
// preserveAspectRatio="none"; coords are arbitrary design units.
const VB_W = 40;
const VB_H = 1000;
const X = 20; // the line sits centred in the gutter

export function MachineSpine() {
  const wrap = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const glow = useRef<SVGPathElement>(null);
  const pulse = useRef<SVGCircleElement>(null);
  const pulseGlow = useRef<SVGCircleElement>(null);

  useGSAP(
    () => {
      registerMachine();
      const path = line.current;
      const gl = glow.current;
      if (!path || !gl) return;

      const main = wrap.current?.parentElement ?? undefined;

      if (prefersReducedMotion()) {
        gsap.set([path, gl], { drawSVG: "100%" });
        if (pulse.current) gsap.set(pulse.current, { opacity: 0 });
        if (pulseGlow.current) gsap.set(pulseGlow.current, { opacity: 0 });
        return;
      }

      gsap.set([path, gl], { drawSVG: "0%" });

      // draw the bus as the page scrolls
      let progress = 0;
      const draw = gsap.to([path, gl], {
        drawSVG: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: main,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            progress = self.progress;
          },
        },
      });

      // current travelling down the wire — only visible within the drawn region
      const pos = { y: 0 };
      const flow = gsap.to(pos, {
        y: VB_H,
        duration: 4.2,
        ease: "none",
        repeat: -1,
        onUpdate: () => {
          const drawn = progress * VB_H;
          const visible = pos.y <= drawn && drawn > 4 ? 1 : 0;
          const fade = gsap.utils.clamp(0, 1, (drawn - pos.y) / 90); // dim near the leading edge
          if (pulse.current)
            gsap.set(pulse.current, { attr: { cy: pos.y }, opacity: visible ? fade : 0 });
          if (pulseGlow.current)
            gsap.set(pulseGlow.current, {
              attr: { cy: pos.y },
              opacity: visible ? fade * 0.6 : 0,
            });
        },
      });

      return () => {
        draw.scrollTrigger?.kill();
        draw.kill();
        flow.kill();
      };
    },
    { scope: wrap }
  );

  return (
    <div
      ref={wrap}
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-[clamp(20px,4.5vw,60px)]"
    >
      <svg
        className="h-full w-full overflow-visible"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        fill="none"
      >
        {/* soft halo under the line */}
        <path
          ref={glow}
          d={`M${X} 0 V${VB_H}`}
          stroke="#10b981"
          strokeWidth={5}
          strokeLinecap="round"
          strokeOpacity={0.22}
          style={{ filter: "blur(3px)" }}
        />
        {/* the wire itself */}
        <path
          ref={line}
          d={`M${X} 0 V${VB_H}`}
          stroke="#10b981"
          strokeWidth={1.4}
          strokeOpacity={0.85}
          strokeLinecap="round"
        />
        {/* travelling current */}
        <circle ref={pulseGlow} cx={X} cy={0} r={9} fill="#10b981" opacity={0} style={{ filter: "blur(4px)" }} />
        <circle ref={pulse} cx={X} cy={0} r={3} fill="#aef5d8" opacity={0} />
      </svg>
    </div>
  );
}
