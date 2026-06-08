"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { PORTFOLIO } from "@/lib/constants";
import { TECH_COLORS } from "../tech-icons";
import { StatusReadout } from "./status-readout";

/**
 * WORK — DEPLOYED UNITS, shown as a premium horizontal showcase gallery.
 *
 * Each project is a polished card: the live screenshot in machine chrome (live
 * telemetry bar + bracket corners) over its info (unit id, name, the result as
 * an output metric, the stack). You swipe through them on mobile and
 * scroll / arrow through them on desktop, so the section stays compact instead
 * of an endless vertical stack, and every unit gets a real moment.
 */

type Project = (typeof PORTFOLIO.projects)[number];

function UnitCard({ project, index }: { project: Project; index: number }) {
  const [src, setSrc] = useState<string | null>(project.image);
  const showImage = Boolean(src);
  const live = project.category !== "community";
  const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const unit = String(index + 1).padStart(2, "0");

  return (
    <article className="snap-start shrink-0 w-[84vw] xs:w-[78vw] sm:w-[420px] lg:w-[470px]">
      <a href={project.url} target="_blank" rel="noopener noreferrer" className="group block">
        {/* framed live screenshot */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-v4-bg-2 shadow-[0_30px_90px_-50px_rgba(0,0,0,0.95)] transition-transform duration-500 ease-snap group-hover:-translate-y-1">
            {/* telemetry bar */}
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] bg-[#090c10] px-3.5 py-2.5">
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]">
                <span
                  className="machine-dot"
                  data-on="true"
                  style={live ? undefined : { background: "#ff9742", boxShadow: "0 0 8px 1px rgba(255,151,66,0.7)" }}
                />
                <span className={live ? "text-v4-accent" : "text-v4-ember"}>{live ? "LIVE" : "COMMUNITY"}</span>
                <span className="hidden text-v4-faint sm:inline">deploy:{slug}-{unit}</span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-v4-faint">
                since {project.deployedSince}
              </span>
            </div>

            {/* the unit */}
            <div className="relative aspect-[16/10] overflow-hidden">
              {showImage ? (
                <Image
                  src={src as string}
                  alt={`${project.name} live site`}
                  fill
                  sizes="(max-width: 640px) 84vw, 470px"
                  className="object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]"
                  onError={() =>
                    setSrc((cur) =>
                      cur === project.image && project.fallbackImage ? project.fallbackImage : null
                    )
                  }
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(120%_120%_at_30%_0%,#12161b_0%,#070809_70%)]">
                  <span className="font-sans text-[clamp(1.6rem,4vw,2.6rem)] font-bold tracking-[-0.03em] text-white/85">
                    {project.name}
                  </span>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-v4-bg/55 via-transparent to-transparent" />
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-v4-accent/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-v4-bg opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                Open ↗
              </span>
            </div>
          </div>
          {/* bracket corner furniture */}
          <span className="pointer-events-none absolute -left-1.5 -top-1.5 h-3.5 w-3.5 border-l border-t border-v4-accent/60" />
          <span className="pointer-events-none absolute -right-1.5 -top-1.5 h-3.5 w-3.5 border-r border-t border-v4-accent/60" />
          <span className="pointer-events-none absolute -bottom-1.5 -left-1.5 h-3.5 w-3.5 border-b border-l border-v4-accent/60" />
          <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 border-b border-r border-v4-accent/60" />
        </div>

        {/* info */}
        <div className="mt-5 px-0.5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-v4-accent">unit.{unit}</span>
            <span className="h-px w-8 bg-white/15" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-v4-faint">
              {live ? "client" : "community"} · {project.deployedSince}
            </span>
          </div>
          <h3 className="mt-3 font-sans text-[clamp(1.7rem,3vw,2.4rem)] font-bold leading-[1.0] tracking-[-0.03em] text-v4-ink transition-colors duration-300 group-hover:text-v4-accent">
            {project.name}
          </h3>
          <div className="mt-3 flex items-start gap-2.5 border-l-2 border-v4-accent/60 pl-3">
            <span className="mt-1 shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-v4-faint">out</span>
            <p className="text-[1.02rem] font-medium leading-snug text-v4-ink">{project.result}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 5).map((t) => (
              <span
                key={t}
                className="rounded-md border px-2 py-0.5 font-mono text-[10px] tracking-[0.04em]"
                style={{
                  color: TECH_COLORS[t] ?? "#9aa3ad",
                  borderColor: `color-mix(in srgb, ${TECH_COLORS[t] ?? "#9aa3ad"} 30%, transparent)`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </a>
    </article>
  );
}

export function WorkGallery() {
  const trackRef = useRef<HTMLDivElement>(null);

  const nudge = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * Math.min(500, trackRef.current.clientWidth * 0.85), behavior: "smooth" });
  };

  return (
    <section className="machine-panel machine-edge relative px-6 py-[11vh] md:py-[16vh] md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div data-reveal className="reveal">
              <StatusReadout
                label="module.work"
                online="DEPLOYED"
                detail={`${PORTFOLIO.projects.length} units live`}
              />
            </div>
            <h2
              data-reveal
              className="reveal mt-6 max-w-[14ch] text-balance font-sans text-[clamp(1.8rem,4.4vw,3.4rem)] font-bold leading-[1.0] tracking-[-0.025em] text-white"
            >
              Shipped. Live. Earning.
            </h2>
          </div>
          {/* desktop arrows */}
          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <button
              type="button"
              aria-label="Previous unit"
              onClick={() => nudge(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-v4-ink transition-colors duration-300 hover:border-v4-accent hover:text-v4-accent"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next unit"
              onClick={() => nudge(1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-v4-ink transition-colors duration-300 hover:border-v4-accent hover:text-v4-accent"
            >
              →
            </button>
          </div>
        </div>

        {/* horizontal gallery */}
        <div
          ref={trackRef}
          className="scrollbar-hide -mx-6 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:mt-14 md:-mx-10 md:px-10 lg:-mx-16 lg:px-16"
        >
          {PORTFOLIO.projects.map((p, i) => (
            <UnitCard key={p.name} project={p} index={i} />
          ))}
          <div className="shrink-0" aria-hidden style={{ width: "1px" }} />
        </div>

        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-v4-faint md:hidden">
          swipe →
        </p>
      </div>
    </section>
  );
}
