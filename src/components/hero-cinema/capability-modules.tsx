"use client";

import { useRef } from "react";
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
 * CAPABILITIES — "every layer", as ONE living line. Not a list, grid, stack,
 * or set of cards (all rejected). The approved sentence "from your logo to
 * your last automation" is kept whole, but its final word becomes a single
 * giant slot that scrambles through the six layers — brand · web · commerce ·
 * motion · automation · software — each in its own accent, charging a heat-bar
 * and flipping the layer readout as it lands. There is nothing to scan in
 * parallel: it reads as one confident claim that keeps re-completing itself.
 *
 * Content-first: with no JS / reduced motion it renders the full approved
 * sentence resting on "automation", so it never depends on the animation to
 * be readable.
 */

type Cap = { word: string; tag: string; color: string };

// order is the cycle order; "automation" sits last so the line resolves into
// the exact approved heading and that is also the no-JS resting frame.
const CAPS: Cap[] = [
  { word: "brand", tag: "identity", color: "#b48ef7" },
  { word: "web", tag: "next.js", color: "#5b9df9" },
  { word: "commerce", tag: "woocommerce", color: "#10b981" },
  { word: "motion", tag: "webgl", color: "#ff9742" },
  { word: "software", tag: "custom", color: "#2dd4bf" },
  { word: "automation", tag: "n8n", color: "#ec5a8d" },
];

const REST = CAPS.length - 1; // automation

export function CapabilityModules() {
  const root = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const glow = useRef<HTMLSpanElement>(null);
  const idx = useRef<HTMLSpanElement>(null);
  const tag = useRef<HTMLSpanElement>(null);
  const lead = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      registerMachine();
      const w = word.current;
      const b = bar.current;
      const g = glow.current;
      const ix = idx.current;
      const tg = tag.current;
      if (!w || !b || !g || !ix || !tg) return;

      const paint = (c: Cap, i: number) => {
        w.style.color = c.color;
        ix.textContent = `L${String(i + 1).padStart(2, "0")} / 06`;
        ix.style.color = c.color;
        tg.textContent = c.tag;
      };

      if (prefersReducedMotion()) {
        paint(CAPS[REST], REST);
        gsap.set(b, { scaleX: 1 });
        gsap.set(g, { backgroundColor: CAPS[REST].color, opacity: 0.16 });
        return;
      }

      // lead-in prints in, char by char, like the rest of the machine
      let split: SplitText | null = null;
      if (lead.current) {
        split = new SplitText(lead.current, { type: "chars" });
        gsap.set(split.chars, { opacity: 0, y: 10 });
      }

      // start resting on automation, bar empty, glow off
      paint(CAPS[REST], REST);
      gsap.set(b, { transformOrigin: "left center", scaleX: 0 });
      gsap.set(g, { backgroundColor: CAPS[REST].color, opacity: 0 });

      let timer = 0;
      let cur = REST;

      const advance = () => {
        const next = (cur + 1) % CAPS.length;
        const c = CAPS[next];
        cur = next;

        // recolour the word + glow + readout while the letters scramble over
        gsap.to(w, {
          duration: 0.7,
          ease: "none",
          scrambleText: { text: c.word, chars: SCRAMBLE_CHARS, speed: 0.5 },
        });
        gsap.to(w, { color: c.color, duration: 0.4, ease: "power2.out" });
        gsap.to(g, {
          backgroundColor: c.color,
          opacity: 0.18,
          duration: 0.5,
          ease: "power2.out",
        });
        // heat-bar discharges then charges across the dwell — the layer powering up
        gsap.fromTo(
          b,
          { scaleX: 0, backgroundColor: c.color },
          { scaleX: 1, duration: 2.0, ease: "power1.inOut" }
        );
        // readout flips at the midpoint of the scramble
        gsap.delayedCall(0.32, () => paint(c, next));
      };

      const start = () => {
        if (split) {
          gsap.to(split.chars, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.018,
          });
        }
        gsap.to(g, { opacity: 0.18, duration: 0.6 });
        gsap.fromTo(
          b,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.6, ease: "power1.inOut" }
        );
        timer = window.setInterval(advance, 2400);
      };

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top 72%",
        once: true,
        onEnter: start,
      });

      return () => {
        window.clearInterval(timer);
        st.kill();
        split?.revert();
      };
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative mt-10 md:mt-14">
      {/* accent wash that recolours with the active layer */}
      <span
        ref={glow}
        aria-hidden
        className="pointer-events-none absolute -left-[6%] top-1/2 h-[120%] w-[70%] -translate-y-1/2 rounded-full opacity-0 blur-[90px]"
      />

      <div className="relative" aria-hidden>
        <p
          ref={lead}
          className="font-sans text-[clamp(1.05rem,2.4vw,1.9rem)] font-medium leading-tight text-v4-muted"
        >
          From your logo, to your last
        </p>

        <div className="mt-1 font-sans text-[clamp(3rem,11vw,9rem)] font-bold leading-[0.92] tracking-[-0.035em]">
          <span ref={word} style={{ color: CAPS[REST].color }}>
            {CAPS[REST].word}
          </span>
          <span className="text-v4-ink">.</span>
        </div>

        {/* heat-bar + layer readout */}
        <div className="mt-5 flex flex-col items-start gap-3 md:mt-7 md:flex-row md:items-center md:gap-4">
          <span className="relative block h-[2px] w-[min(70vw,420px)] overflow-hidden rounded-full bg-white/10">
            <span ref={bar} className="absolute inset-0 origin-left rounded-full bg-v4-accent" />
          </span>
          <span className="flex shrink-0 items-baseline gap-2 font-mono text-[11px] uppercase tracking-[0.2em]">
            <span ref={idx} style={{ color: CAPS[REST].color }}>
              L06 / 06
            </span>
            <span className="text-v4-faint/70">·</span>
            <span ref={tag} className="text-v4-faint">
              {CAPS[REST].tag}
            </span>
          </span>
        </div>
      </div>

      <p className="mt-9 max-w-[46ch] text-[0.98rem] leading-relaxed text-v4-muted md:mt-12">
        Take one layer or hand us the whole machine. Every part powers the next.
      </p>
    </div>
  );
}
