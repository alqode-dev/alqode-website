"use client";

import Image from "next/image";
import { TESTIMONIALS } from "@/lib/constants";

/**
 * CLIENT PROOF — what we actually solved, in their words.
 *
 * The work gallery shows THAT we built something; this explains WHAT PROBLEM we
 * solved for each real business, then lets the owner confirm it. So it leads
 * with the problem-solved headline (the thing the gallery can't say), backed by
 * the client's own quote in the brand's serif voice, their real face + business
 * + a link to the live site. All three are readable at once — no carousel
 * hiding the proof. Clean and editorial, not a testimonial widget.
 */

const CASES = TESTIMONIALS.items;

export function FieldSignal() {
  return (
    <div className="flex flex-col">
      {CASES.map((c, i) => {
        const location = c.role.split(" · ")[1] ?? c.role;
        return (
          <article
            key={c.clientKey}
            className="grid gap-6 border-t border-white/[0.08] py-9 first:border-t-0 first:pt-0 md:grid-cols-[280px_1fr] md:gap-12 md:py-12"
          >
            {/* who — real face, real business, live proof */}
            <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-5">
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/15 md:h-[5.5rem] md:w-[5.5rem]">
                <Image src={c.photo} alt={`${c.client} owner`} fill sizes="88px" className="object-cover" />
                <span className="pointer-events-none absolute -left-1 -top-1 h-2.5 w-2.5 border-l border-t border-v4-accent/70" />
                <span className="pointer-events-none absolute -bottom-1 -right-1 h-2.5 w-2.5 border-b border-r border-v4-accent/70" />
              </span>
              <div>
                <p className="font-sans text-lg font-semibold leading-tight text-v4-ink">{c.client}</p>
                <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.16em] text-v4-faint">{location}</p>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-v4-accent transition-opacity hover:opacity-70"
                >
                  view live ↗
                </a>
              </div>
            </div>

            {/* what we solved, then their words */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-v4-faint">
                  case.{String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-8 bg-white/15" />
                <span className="rounded-md border border-v4-accent/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-v4-accent">
                  {c.metric}
                </span>
              </div>
              <h3 className="mt-4 max-w-[30ch] font-sans text-[clamp(1.35rem,2.4vw,2.05rem)] font-bold leading-[1.14] tracking-[-0.02em] text-v4-ink">
                {c.problem}
              </h3>
              <blockquote className="mt-5 max-w-[54ch] border-l-2 border-v4-accent/40 pl-4 font-display text-[clamp(1.1rem,1.7vw,1.4rem)] italic leading-relaxed text-v4-muted">
                {`“${c.quote}”`}
              </blockquote>
            </div>
          </article>
        );
      })}
    </div>
  );
}
