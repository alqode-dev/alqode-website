"use client";

import { useRef } from "react";
import { Palette, Globe, ShoppingBag, Clapperboard, Workflow, Code2, type LucideIcon } from "lucide-react";
import {
  registerMachine,
  prefersReducedMotion,
  gsap,
  useGSAP,
  ScrollTrigger,
  SCRAMBLE_CHARS,
} from "./machine";

/**
 * CAPABILITIES — a bento grid of module cards.
 *
 * Each capability is a card that powers on as it scrolls in: it assembles into
 * place, its status pip ignites, the status scrambles IDLE -> ONLINE, and a
 * power bar charges across the bottom edge. Card grid instead of a flat list
 * so it is scannable and premium, not a wall of rows nobody reads. Content is
 * always present in the DOM (readable without JS / reduced motion).
 */

const MODULES: { k: string; tag: string; d: string; Icon: LucideIcon; wide?: boolean }[] = [
  { k: "Brand", tag: "identity", d: "Identity, logo, and the system that makes you recognisable anywhere.", Icon: Palette },
  { k: "Web", tag: "next.js", d: "Sites and web apps on modern frameworks. Fast, custom, built to scale.", Icon: Globe, wide: true },
  { k: "Commerce", tag: "woocommerce", d: "Stores that convert. Payments, catalogue, the full retail engine.", Icon: ShoppingBag },
  { k: "Motion", tag: "webgl", d: "Real-time WebGL, animation, and the moments that make a brand stick.", Icon: Clapperboard },
  { k: "Automation", tag: "n8n", d: "n8n and WhatsApp pipelines that do the work while you sleep.", Icon: Workflow, wide: true },
  { k: "Software", tag: "custom", d: "Custom tools and platforms when off-the-shelf will not cut it.", Icon: Code2 },
];

export function CapabilityModules() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerMachine();
      const reduce = prefersReducedMotion();
      const cards = gsap.utils.toArray<HTMLElement>(".cap-card");

      const settle = (card: HTMLElement) => {
        const pip = card.querySelector<HTMLElement>(".cap-pip");
        const fill = card.querySelector<HTMLElement>(".cap-fill");
        const status = card.querySelector<HTMLElement>(".cap-status");
        if (pip) pip.dataset.on = "true";
        if (fill) gsap.to(fill, { scaleX: 1, duration: 0.9, ease: "power3.out" });
        if (status) {
          if (reduce) status.textContent = "ONLINE";
          else
            gsap.to(status, {
              duration: 0.7,
              ease: "none",
              scrambleText: { text: "ONLINE", chars: SCRAMBLE_CHARS, speed: 0.7 },
            });
        }
      };

      if (reduce) {
        cards.forEach(settle);
        return;
      }

      gsap.set(cards, { opacity: 0, y: 26 });
      gsap.set(".cap-fill", { scaleX: 0, transformOrigin: "left center" });

      cards.forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.to(card, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
            settle(card);
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className="mt-12 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 md:gap-4"
    >
      {MODULES.map((m, i) => (
        <div
          key={m.k}
          className="cap-card group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,#0d1014_0%,#090b0f_100%)] p-6 transition-colors duration-500 ease-snap hover:border-v4-accent/40 md:p-7"
        >
          {/* top row: glyph + live status */}
          <div className="flex items-center justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-v4-muted transition-colors duration-300 group-hover:border-v4-accent/50 group-hover:text-v4-accent">
              <m.Icon size={20} strokeWidth={1.6} />
            </span>
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]">
              <span className="cap-pip machine-dot" aria-hidden />
              <span className="cap-status text-v4-accent">ONLINE</span>
            </span>
          </div>

          {/* title + description */}
          <h3 className="mt-6 font-sans text-[clamp(1.4rem,2.2vw,1.9rem)] font-semibold tracking-[-0.02em] text-v4-ink transition-colors duration-300 group-hover:text-v4-accent">
            {m.k}
          </h3>
          <p className="mt-2 max-w-[42ch] flex-1 text-[0.95rem] leading-relaxed text-v4-muted">
            {m.d}
          </p>

          {/* footer: index + tag */}
          <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-v4-faint">
            <span>mod.{String(i + 1).padStart(2, "0")}</span>
            <span>{m.tag}</span>
          </div>

          {/* power bar along the bottom edge */}
          <span className="cap-fill absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-v4-accent to-v4-accent/60" />
        </div>
      ))}
    </div>
  );
}
