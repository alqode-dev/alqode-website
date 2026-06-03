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
 * CAPABILITIES — the modules.
 *
 * Not a list. Six module bays that power on one-by-one as the signal reaches
 * them: the row assembles into its bay (clip + slide), its status pip ignites,
 * the status text scrambles IDLE -> ONLINE, and a power bar charges. The hover
 * is the "selected module" state. Content is fully present in the DOM so it
 * reads without JS / under reduced motion.
 */

const MODULES: { k: string; tag: string; d: string; Icon: LucideIcon }[] = [
  { k: "Brand", tag: "identity", d: "Identity, logo, and the system that makes it recognisable anywhere.", Icon: Palette },
  { k: "Web", tag: "next.js", d: "Sites and web apps on modern frameworks. Fast, custom, built to scale.", Icon: Globe },
  { k: "Commerce", tag: "woocommerce", d: "Stores that convert. Payments, catalogue, the full retail engine.", Icon: ShoppingBag },
  { k: "Motion", tag: "webgl", d: "Real-time WebGL, animation, and the moments that make a brand stick.", Icon: Clapperboard },
  { k: "Automation", tag: "n8n", d: "n8n and WhatsApp pipelines that do the work while you sleep.", Icon: Workflow },
  { k: "Software", tag: "custom", d: "Custom tools and platforms when off-the-shelf will not cut it.", Icon: Code2 },
];

export function CapabilityModules() {
  const root = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      registerMachine();
      const reduce = prefersReducedMotion();
      const rows = gsap.utils.toArray<HTMLElement>(".cap-row");

      const settle = (row: HTMLElement) => {
        const pip = row.querySelector<HTMLElement>(".cap-pip");
        const fill = row.querySelector<HTMLElement>(".cap-fill");
        const status = row.querySelector<HTMLElement>(".cap-status");
        if (pip) pip.dataset.on = "true";
        if (fill) gsap.to(fill, { scaleX: 1, duration: 0.8, ease: "power3.out" });
        if (status) {
          if (reduce) {
            status.textContent = "ONLINE";
          } else {
            gsap.to(status, {
              duration: 0.7,
              ease: "none",
              scrambleText: { text: "ONLINE", chars: SCRAMBLE_CHARS, speed: 0.7 },
            });
          }
        }
      };

      if (reduce) {
        rows.forEach(settle);
        return;
      }

      // resting: seated out of the bay, status idle, bar empty
      gsap.set(rows, { opacity: 0, x: -22, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".cap-fill", { scaleX: 0, transformOrigin: "left center" });

      rows.forEach((row) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 86%",
          once: true,
          onEnter: () => {
            gsap.to(row, {
              opacity: 1,
              x: 0,
              clipPath: "inset(0 0% 0 0)",
              duration: 0.7,
              ease: "power3.out",
            });
            settle(row);
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <ul ref={root} className="mt-12 border-t border-white/[0.08]">
      {MODULES.map((m, i) => (
        <li
          key={m.k}
          className="cap-row group relative grid grid-cols-[2.5rem_1fr] items-center gap-x-5 border-b border-white/[0.08] px-1 py-6 transition-colors duration-500 ease-snap hover:bg-white/[0.02] md:grid-cols-[5rem_minmax(0,22ch)_1fr_8rem] md:gap-x-8 md:py-7"
        >
          {/* left accent bar grows on hover */}
          <span
            aria-hidden
            className="absolute left-0 top-1/2 h-0 w-[2px] -translate-y-1/2 bg-v4-accent transition-all duration-500 ease-snap group-hover:h-[64%]"
          />

          {/* module address + status pip */}
          <span className="flex items-center gap-2 font-mono text-xs text-v4-faint">
            <span className="cap-pip machine-dot" aria-hidden />
            <span className="transition-colors duration-300 group-hover:text-v4-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
          </span>

          {/* glyph + title */}
          <span className="flex items-center gap-3 transition-transform duration-300 ease-snap group-hover:translate-x-1">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-v4-muted transition-colors duration-300 group-hover:border-v4-accent/50 group-hover:text-v4-accent md:h-10 md:w-10">
              <m.Icon size={18} strokeWidth={1.6} />
            </span>
            <span className="font-sans text-[clamp(1.4rem,2.6vw,2.2rem)] font-semibold tracking-[-0.02em] text-v4-ink transition-colors duration-300 ease-snap group-hover:text-v4-accent">
              {m.k}
            </span>
          </span>

          {/* description */}
          <span className="col-span-2 mt-2 max-w-[46ch] text-[0.98rem] leading-relaxed text-v4-muted transition-colors duration-300 group-hover:text-v4-ink md:col-span-1 md:mt-0">
            {m.d}
          </span>

          {/* status bay: ONLINE + power bar + module tag */}
          <span className="col-span-2 mt-3 flex items-center gap-3 md:col-span-1 md:mt-0 md:flex-col md:items-end md:gap-1.5">
            <span className="flex items-center gap-2">
              <span className="cap-status font-mono text-[10px] uppercase tracking-[0.22em] text-v4-accent">
                ONLINE
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-v4-faint">
                {m.tag}
              </span>
            </span>
            <span className="h-[3px] w-24 overflow-hidden rounded-full bg-white/[0.08] md:w-full">
              <span className="cap-fill block h-full w-full rounded-full bg-gradient-to-r from-v4-accent to-v4-accent/70" />
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
