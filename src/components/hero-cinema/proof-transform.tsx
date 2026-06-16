"use client";

import { useRef } from "react";
import Image from "next/image";
import { TESTIMONIALS } from "@/lib/constants";
import {
  registerMachine,
  prefersReducedMotion,
  gsap,
  useGSAP,
  ScrollTrigger,
  SplitText,
  SCRAMBLE_CHARS,
} from "./machine";

/**
 * THE TRANSFORM LINE — proof as monumental kinetic type.
 *
 * Each client is a screen where the PROBLEM word fractures into machine glyphs
 * and the RESULT word reassembles from them in green (ScrambleText decay→settle
 * between two real strings — crisp, on-brand, the mechanic the founder rated
 * highest). A chrome connector draws a green pulse between them; then the voice
 * and a chrome-housed headshot land. Vertical on mobile (eye descends problem →
 * solution), horizontal on desktop. Reduced-motion / no-JS rests on the result.
 */

const ITEMS = TESTIMONIALS.items;

function Floor({ c, i }: { c: (typeof ITEMS)[number]; i: number }) {
  const root = useRef<HTMLDivElement>(null);
  const before = useRef<HTMLSpanElement>(null);
  const after = useRef<HTMLSpanElement>(null);
  const solved = useRef<HTMLSpanElement>(null);
  const quote = useRef<HTMLQuoteElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const line = useRef<SVGPathElement>(null);
  const pulse = useRef<SVGCircleElement>(null);

  const [beforeWord, afterWord] = c.metric.split("→").map((s) => s.trim());
  const location = c.role.split(" · ")[1] ?? c.role;

  useGSAP(
    () => {
      registerMachine();
      const a = after.current;
      const b = before.current;
      if (!a || !b) return;

      if (prefersReducedMotion()) {
        a.textContent = afterWord;
        if (dot.current) dot.current.dataset.on = "true";
        return;
      }

      a.textContent = "";
      gsap.set(solved.current, { opacity: 0, y: 8 });
      gsap.set(line.current, { drawSVG: "0%" });
      gsap.set(pulse.current, { opacity: 0 });

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top 58%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          // before fractures, then ghosts back
          tl.to(b, { duration: 0.5, ease: "none", scrambleText: { text: beforeWord, chars: SCRAMBLE_CHARS, speed: 1 } }, 0);
          tl.to(b, { opacity: 0.4, duration: 0.5 }, 0.35);
          // connector draws + a green pulse runs across it
          tl.to(line.current, { drawSVG: "100%", duration: 0.5, ease: "power2.inOut" }, 0.2);
          if (pulse.current && line.current) {
            tl.set(pulse.current, { opacity: 1 }, 0.3);
            tl.to(pulse.current, { motionPath: { path: line.current, start: 0, end: 1 }, duration: 0.5, ease: "none" }, 0.3);
            tl.to(pulse.current, { opacity: 0, duration: 0.2 }, 0.78);
          }
          // result reassembles in green with a mechanical overshoot
          tl.to(a, { duration: 0.85, ease: "none", scrambleText: { text: afterWord, chars: SCRAMBLE_CHARS, speed: 0.7, revealDelay: 0.1 } }, 0.4);
          tl.fromTo(a, { scale: 1.09 }, { scale: 1, duration: 0.5, ease: "back.out(2)" }, 0.68);
          tl.add(() => { if (dot.current) dot.current.dataset.on = "true"; }, 0.7);
          // the solved clause + the voice
          tl.to(solved.current, { opacity: 1, y: 0, duration: 0.5 }, 1.0);
          if (quote.current) {
            const sp = new SplitText(quote.current, { type: "words" });
            gsap.set(sp.words, { opacity: 0, y: 8 });
            tl.to(sp.words, { opacity: 1, y: 0, duration: 0.5, stagger: 0.024, ease: "power2.out" }, 1.15);
          }
        },
      });
      return () => st.kill();
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-2 py-[10vh]"
    >
      {/* atmosphere only — no client screenshot here (the work gallery owns those) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_50%_42%,rgba(16,185,129,0.07),transparent_60%)]" />

      {/* control strip */}
      <div className="relative mb-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em]">
        <span ref={dot} className="machine-dot" aria-hidden />
        <span className="text-v4-faint">
          field report {String(i + 1).padStart(2, "0")} / 0{ITEMS.length}
        </span>
        <span className="text-v4-faint/60">::</span>
        <span className="text-v4-ink">{c.client} · {location}</span>
      </div>

      {/* THE TRANSFORM */}
      <div className="relative flex flex-col items-center gap-1 md:flex-row md:gap-8">
        <span ref={before} className="font-display text-[clamp(2.8rem,12vw,5.5rem)] italic leading-[0.95] text-v4-ember">
          {beforeWord}
        </span>
        <svg width="64" height="44" viewBox="0 0 64 44" className="rotate-90 md:rotate-0" aria-hidden>
          <path ref={line} d="M8 22 H56" stroke="#565d66" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <circle ref={pulse} r="3.2" fill="#10b981" />
        </svg>
        <span ref={after} className="font-display text-[clamp(2.8rem,12vw,5.5rem)] italic leading-[0.95] text-v4-accent">
          {afterWord}
        </span>
      </div>

      {/* supporting read */}
      <p className="relative mt-9 max-w-[40ch] text-balance text-center text-[0.98rem] leading-relaxed">
        <span className="text-v4-faint">{c.before} </span>
        <span ref={solved} className="inline-block text-v4-ink">{c.after}</span>
      </p>

      {/* the voice */}
      <blockquote
        ref={quote}
        className="relative mt-7 max-w-[46ch] text-balance text-center font-sans text-[clamp(1.05rem,2vw,1.45rem)] font-medium leading-snug text-v4-ink"
      >
        {`“${c.quote}”`}
      </blockquote>

      {/* source — chrome housing, not a circle */}
      <div className="relative mt-9 flex items-center gap-3">
        <span className="machine-ember-rim relative h-12 w-12 overflow-hidden rounded-lg ring-1 ring-white/15">
          <Image src={c.photo} alt={`${c.client} owner`} fill sizes="48px" className="object-cover" />
          <span className="pointer-events-none absolute -left-1 -top-1 h-2.5 w-2.5 border-l border-t border-v4-accent/70" />
          <span className="pointer-events-none absolute -bottom-1 -right-1 h-2.5 w-2.5 border-b border-r border-v4-accent/70" />
        </span>
        <span className="flex flex-col gap-0.5 leading-tight">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-v4-faint">// source · {c.name}</span>
          <a
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-v4-accent transition-opacity hover:opacity-70"
          >
            view live ↗
          </a>
        </span>
      </div>
    </div>
  );
}

export function ProofTransform() {
  return (
    <div>
      {ITEMS.map((c, i) => (
        <Floor key={c.clientKey} c={c} i={i} />
      ))}
    </div>
  );
}
