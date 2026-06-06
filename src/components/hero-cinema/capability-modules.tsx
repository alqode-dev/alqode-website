"use client";

import { Palette, Globe, ShoppingBag, Clapperboard, Workflow, Code2, type LucideIcon } from "lucide-react";

/**
 * CAPABILITIES — "every layer", made literal.
 *
 * Not a list, grid, or tab panel. The six capabilities are fused into ONE
 * object: a cross-section of the machine, six material layers stacked flush
 * with their coloured edges forming a continuous spine down the side. On
 * desktop the whole slab tilts in 3D so you are looking at a real cross-section;
 * on mobile it lies flat and compact. Each layer carries its own info, so there
 * is no separate detail pane and nothing to scroll through.
 */

type Layer = { k: string; tag: string; d: string; Icon: LucideIcon; edge: string };

const LAYERS: Layer[] = [
  { k: "Brand", tag: "identity", d: "The look people remember and trust.", Icon: Palette, edge: "#b48ef7" },
  { k: "Web", tag: "next.js", d: "Fast, custom sites and web apps that scale.", Icon: Globe, edge: "#5b9df9" },
  { k: "Commerce", tag: "woocommerce", d: "Stores that sell while you sleep.", Icon: ShoppingBag, edge: "#10b981" },
  { k: "Motion", tag: "webgl", d: "Real-time WebGL and moments that stick.", Icon: Clapperboard, edge: "#ff9742" },
  { k: "Automation", tag: "n8n", d: "Pipelines that capture, book and follow up.", Icon: Workflow, edge: "#ec5a8d" },
  { k: "Software", tag: "custom", d: "Custom tools built around how you work.", Icon: Code2, edge: "#2dd4bf" },
];

export function CapabilityModules() {
  return (
    <div className="mt-12 md:mt-16 md:[perspective:1900px]">
      {/* the cross-section slab */}
      <div className="overflow-hidden rounded-xl border border-white/[0.1] bg-[linear-gradient(110deg,#11151b_0%,#0a0c11_70%)] shadow-[0_40px_80px_-50px_rgba(0,0,0,0.95)] md:origin-top md:[transform:rotateX(17deg)] md:[box-shadow:0_50px_90px_-40px_rgba(0,0,0,0.95)]">
        {LAYERS.map((l, i) => {
          const Icon = l.Icon;
          return (
            <div
              key={l.k}
              className="group/layer relative flex items-center gap-3.5 border-t border-white/[0.06] py-3.5 pl-5 pr-4 transition-colors duration-300 first:border-t-0 hover:bg-white/[0.025] md:py-4 md:pl-6"
            >
              {/* the material edge — these stack into a continuous spine */}
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-[5px]"
                style={{ background: l.edge, boxShadow: `0 0 12px -2px ${l.edge}` }}
              />

              {/* glyph */}
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] transition-transform duration-300 group-hover/layer:scale-105"
                style={{ color: l.edge }}
              >
                <Icon size={18} strokeWidth={1.7} />
              </span>

              {/* name + description */}
              <div className="min-w-0 flex-1">
                <h3 className="font-sans text-[clamp(1.2rem,2vw,1.7rem)] font-bold tracking-[-0.02em] text-v4-ink">
                  {l.k}
                </h3>
                <p className="truncate text-[0.9rem] leading-snug text-v4-muted sm:overflow-visible sm:whitespace-normal">
                  {l.d}
                </p>
              </div>

              {/* layer index + tag */}
              <div className="hidden shrink-0 flex-col items-end gap-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-v4-faint sm:flex">
                <span style={{ color: l.edge }}>L{String(i + 1).padStart(2, "0")}</span>
                <span>{l.tag}</span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-v4-faint md:mt-9">
        / one machine · six layers · take any of them
      </p>
    </div>
  );
}
