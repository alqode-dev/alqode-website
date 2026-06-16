"use client";

import { TESTIMONIALS } from "@/lib/constants";
import { ProofTransform } from "./proof-transform";

/**
 * CLIENT PROOF — the voice + the transformation, deliberately NOT the live
 * screenshots (the work gallery "Shipped. Live. Earning." already owns those).
 * This section's job is different: the problem we walked in on, the result as a
 * before→after kinetic transform, and the client's own words. See proof-transform.tsx.
 */

const VOICES = TESTIMONIALS.items;

export function ClientProof() {
  return (
    <div className="relative">
      <ProofTransform />

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
