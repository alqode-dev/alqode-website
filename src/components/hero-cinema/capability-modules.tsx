"use client";

import { useEffect, useRef, useState } from "react";
import { Palette, Globe, ShoppingBag, Clapperboard, Workflow, Code2, type LucideIcon } from "lucide-react";
import { prefersReducedMotion } from "./machine";

/**
 * CAPABILITIES — an interactive module console.
 *
 * Not a list, not a card grid (both read as generic). It is a single control
 * console: a selector of the six modules on one side and one big detail bay
 * that swaps to whichever module is live. It AUTO-CYCLES through the modules
 * like a running machine, and you can drive it by hovering (desktop) or
 * tapping (mobile). One panel instead of six stacked cards, so mobile barely
 * scrolls. Content is always in the DOM; reduced motion just stops the cycle.
 */

const MODULES: { k: string; tag: string; d: string; Icon: LucideIcon }[] = [
  { k: "Brand", tag: "identity", d: "Identity, logo, and the system that makes you recognisable anywhere. The look people remember and trust.", Icon: Palette },
  { k: "Web", tag: "next.js", d: "Sites and web apps on modern frameworks. Fast, custom, and built to scale with your business, not break under it.", Icon: Globe },
  { k: "Commerce", tag: "woocommerce", d: "Stores that sell while you sleep. Payments, catalogue, and the full retail engine, wired to convert.", Icon: ShoppingBag },
  { k: "Motion", tag: "webgl", d: "Real-time WebGL, animation, and the moments that make a brand stick in someone's head after they leave.", Icon: Clapperboard },
  { k: "Automation", tag: "n8n", d: "n8n and WhatsApp pipelines that capture, book, and follow up. The work that should run itself, running itself.", Icon: Workflow },
  { k: "Software", tag: "custom", d: "Custom tools and platforms when off-the-shelf will not cut it. Built exactly around how your business actually works.", Icon: Code2 },
];

const CYCLE_MS = 3600;

export function CapabilityModules() {
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) setActive((a) => (a + 1) % MODULES.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, []);

  const m = MODULES[active];
  const ActiveIcon = m.Icon;

  return (
    <div
      className="mt-10 grid gap-4 md:mt-12 md:grid-cols-[minmax(0,17rem)_1fr] md:gap-6"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      {/* selector — vertical rail on desktop, horizontal scroll chips on mobile */}
      <div
        role="tablist"
        aria-label="Capabilities"
        className="scrollbar-hide -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:flex-col md:gap-1.5 md:overflow-visible md:px-0"
      >
        {MODULES.map((mod, i) => {
          const on = i === active;
          const Icon = mod.Icon;
          return (
            <button
              key={mod.k}
              role="tab"
              aria-selected={on}
              type="button"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className={`group flex shrink-0 items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors duration-300 ease-snap md:rounded-lg md:border-0 md:border-l-2 md:px-3 ${
                on
                  ? "border-v4-accent/50 bg-v4-accent/[0.06] md:border-l-v4-accent md:bg-white/[0.02]"
                  : "border-white/10 md:border-l-white/10 hover:border-white/25 md:hover:border-l-white/30"
              }`}
            >
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-md transition-colors duration-300 ${
                  on ? "bg-v4-accent/15 text-v4-accent" : "bg-white/[0.04] text-v4-muted"
                }`}
              >
                <Icon size={16} strokeWidth={1.7} />
              </span>
              <span
                className={`font-sans text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-300 md:text-base ${
                  on ? "text-v4-ink" : "text-v4-muted group-hover:text-v4-ink"
                }`}
              >
                {mod.k}
              </span>
            </button>
          );
        })}
      </div>

      {/* detail bay */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[linear-gradient(160deg,#0e1116_0%,#08090d_100%)] p-7 md:p-10">
        {/* huge ghost glyph */}
        <ActiveIcon
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-6 text-white/[0.04] md:-right-8 md:-top-8"
          size={190}
          strokeWidth={1}
        />
        {/* charge bar keyed to the cycle */}
        <span
          key={`bar-${active}`}
          className="absolute left-0 top-0 h-[2px] w-full origin-left bg-gradient-to-r from-v4-accent to-v4-accent/50"
          style={{ animation: prefersReducedMotion() ? "none" : `capCharge ${CYCLE_MS}ms linear forwards` }}
        />

        <div key={active} className="relative animate-fade-up">
          <div className="flex items-center justify-between">
            <span className="grid h-14 w-14 place-items-center rounded-xl border border-v4-accent/40 bg-v4-accent/10 text-v4-accent">
              <ActiveIcon size={26} strokeWidth={1.6} />
            </span>
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]">
              <span className="machine-dot" data-on="true" aria-hidden />
              <span className="text-v4-accent">online</span>
            </span>
          </div>

          <h3 className="mt-6 font-sans text-[clamp(1.9rem,3.4vw,2.8rem)] font-bold tracking-[-0.025em] text-v4-ink">
            {m.k}
          </h3>
          <p className="mt-3 max-w-[52ch] text-[1.02rem] leading-relaxed text-v4-muted">{m.d}</p>

          <div className="mt-8 flex items-center justify-between border-t border-white/[0.07] pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-v4-faint">
            <span>
              module {String(active + 1).padStart(2, "0")} / {String(MODULES.length).padStart(2, "0")}
            </span>
            <span className="text-v4-accent/80">{m.tag}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
