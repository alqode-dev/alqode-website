"use client";

import { useState } from "react";
import { TESTIMONIALS } from "@/lib/constants";
import { ProofShowfloor } from "./proof-showfloor";
import { ProofTransform } from "./proof-transform";

/**
 * CLIENT PROOF — orchestrator.
 *
 * Presents the two strongest directions from the design exploration behind a
 * sticky A/B switch so Hamdaan can flip between them on the same screen and
 * pick by feel. Once chosen, the loser + the switch get removed.
 *   A · SHOWFLOOR  — walk through the real live sites powering on (judges' #1)
 *   B · TRANSFORM  — monumental before→after kinetic type (his favourite mechanic)
 */

const VOICES = TESTIMONIALS.items;

export function ClientProof() {
  const [mode, setMode] = useState<"showfloor" | "transform">("showfloor");

  return (
    <div className="relative">
      {/* temporary A/B chooser */}
      <div className="pointer-events-none sticky top-4 z-30 mb-4 flex justify-center">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-[#0c0f13]/90 p-1 font-mono text-[11px] uppercase tracking-[0.14em] backdrop-blur-md">
          <button
            type="button"
            onClick={() => setMode("showfloor")}
            className={`rounded-full px-3.5 py-1.5 transition-colors ${
              mode === "showfloor" ? "bg-v4-accent/15 text-v4-accent" : "text-v4-faint hover:text-v4-ink"
            }`}
          >
            A · showfloor
          </button>
          <button
            type="button"
            onClick={() => setMode("transform")}
            className={`rounded-full px-3.5 py-1.5 transition-colors ${
              mode === "transform" ? "bg-v4-accent/15 text-v4-accent" : "text-v4-faint hover:text-v4-ink"
            }`}
          >
            B · transform
          </button>
        </div>
      </div>

      {mode === "showfloor" ? <ProofShowfloor /> : <ProofTransform />}

      {/* readable fallback for SEO / screen readers / no-JS */}
      <ul className="sr-only">
        {VOICES.map((c) => (
          <li key={c.clientKey}>
            {c.client}, {c.role}: {c.quote}
          </li>
        ))}
      </ul>
    </div>
  );
}
