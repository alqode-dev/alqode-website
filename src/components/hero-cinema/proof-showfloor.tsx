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
} from "./machine";

/**
 * THE SHOWFLOOR — walk through what we shipped.
 *
 * Each client is a floor you descend into: their REAL live site is the hero,
 * sitting in a chrome machine-frame. You ARRIVE on the ember-etched problem,
 * then as the floor centres the site powers on (dim → full colour, lit edge),
 * the metric stamps ember → green, the machine-dot ignites and the voice lands
 * beside a chrome-housed operator plate. The live screenshot proves WHAT was
 * shipped (not a face, not a card). No WebGL — depth is light + scale + colour.
 * Reduced-motion / no-JS renders every floor already powered on and readable.
 */

const ITEMS = TESTIMONIALS.items;

function domain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function Floor({ c, i }: { c: (typeof ITEMS)[number]; i: number }) {
  const root = useRef<HTMLDivElement>(null);
  const shot = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const metric = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const problem = useRef<HTMLParagraphElement>(null);
  const quote = useRef<HTMLQuoteElement>(null);

  const [beforeWord, afterWord] = c.metric.split("→").map((s) => s.trim());
  const location = c.role.split(" · ")[1] ?? c.role;

  useGSAP(
    () => {
      registerMachine();
      const reduce = prefersReducedMotion();

      const powerOn = () => {
        if (dot.current) dot.current.dataset.on = "true";
        if (shot.current) gsap.set(shot.current, { filter: "grayscale(0) brightness(1)" });
        if (frame.current) gsap.set(frame.current, { boxShadow: "0 0 0 1px rgba(16,185,129,0.35), 0 40px 90px -50px rgba(0,0,0,0.95)" });
        if (metric.current) {
          metric.current.style.color = "#10b981";
          metric.current.style.borderColor = "rgba(16,185,129,0.4)";
        }
      };

      if (reduce) {
        powerOn();
        return;
      }

      // resting (arrived, not yet powered)
      gsap.set(shot.current, { filter: "grayscale(0.8) brightness(0.55)" });
      gsap.set(metric.current, { color: "#ff9742", borderColor: "rgba(255,151,66,0.4)" });
      const split = problem.current ? new SplitText(problem.current, { type: "words,chars" }) : null;
      if (split) gsap.set(split.chars, { opacity: 0, y: 8 });
      const qsplit = quote.current ? new SplitText(quote.current, { type: "lines" }) : null;
      if (qsplit) gsap.set(qsplit.lines, { opacity: 0, y: 12 });

      // ARRIVE — the problem prints in as the floor approaches
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          if (split) gsap.to(split.chars, { opacity: 1, y: 0, duration: 0.5, stagger: 0.012, ease: "power3.out" });
        },
      });

      // RESOLVE — as the floor centres, it powers on
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 42%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to(shot.current, { filter: "grayscale(0) brightness(1)", duration: 0.7, ease: "power2.out" }, 0);
          tl.to(frame.current, { boxShadow: "0 0 0 1px rgba(16,185,129,0.35), 0 40px 90px -50px rgba(0,0,0,0.95)", duration: 0.7 }, 0);
          tl.add(() => { if (dot.current) dot.current.dataset.on = "true"; }, 0.25);
          tl.fromTo(metric.current, { scale: 1.15 }, { scale: 1, duration: 0.5, ease: "back.out(2)" }, 0.25);
          tl.to(metric.current, { color: "#10b981", borderColor: "rgba(16,185,129,0.4)", duration: 0.4 }, 0.25);
          if (qsplit) tl.to(qsplit.lines, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }, 0.4);
        },
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative flex min-h-[92vh] flex-col justify-center py-[8vh]">
      {/* control strip */}
      <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em]">
        <span ref={dot} className="machine-dot" aria-hidden />
        <span className="text-v4-accent">showfloor</span>
        <span className="text-v4-faint">// {String(i + 1).padStart(2, "0")} / 0{ITEMS.length} · deployed · verified</span>
      </div>

      {/* the problem we walked in on */}
      <p ref={problem} className="mb-5 max-w-[28ch] font-sans text-[clamp(1.25rem,3.4vw,2rem)] font-semibold leading-tight text-v4-ember">
        {c.before}
      </p>

      {/* the live site — the hero, powering on */}
      <div ref={frame} className="machine-panel machine-ember-rim relative overflow-hidden rounded-2xl border border-white/[0.12] shadow-[0_40px_90px_-50px_rgba(0,0,0,0.95)]">
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] bg-[#090c10] px-3.5 py-2.5">
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]">
            <span className="machine-dot" data-on="true" aria-hidden />
            <span className="text-v4-accent">live</span>
            <span className="text-v4-faint">{domain(c.url)}</span>
          </span>
          <span
            ref={metric}
            className="rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]"
            style={{ color: "#ff9742", borderColor: "rgba(255,151,66,0.4)" }}
          >
            {beforeWord} → {afterWord}
          </span>
        </div>
        <div ref={shot} className="relative aspect-[16/10]">
          <Image src={c.site} alt={`${c.client} live site`} fill sizes="(max-width:768px) 92vw, 1000px" className="object-cover object-top" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-v4-bg/45 via-transparent to-transparent" />
        </div>
        <span className="pointer-events-none absolute -left-1.5 -top-1.5 h-3.5 w-3.5 border-l border-t border-v4-accent/60" />
        <span className="pointer-events-none absolute -right-1.5 -top-1.5 h-3.5 w-3.5 border-r border-t border-v4-accent/60" />
        <span className="pointer-events-none absolute -bottom-1.5 -left-1.5 h-3.5 w-3.5 border-b border-l border-v4-accent/60" />
        <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 border-b border-r border-v4-accent/60" />
      </div>

      {/* what it became + the voice */}
      <p className="mt-5 max-w-[44ch] text-[0.98rem] leading-relaxed text-v4-ink">{c.after}</p>

      <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
        <blockquote
          ref={quote}
          className="max-w-[52ch] border-l-2 border-v4-accent/40 pl-4 font-display text-[clamp(1.05rem,1.7vw,1.4rem)] italic leading-relaxed text-v4-muted"
        >
          {`“${c.quote}”`}
        </blockquote>
        <a href={c.url} target="_blank" rel="noopener noreferrer" className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-80">
          <span className="machine-ember-rim relative h-11 w-11 overflow-hidden rounded-lg ring-1 ring-white/15">
            <Image src={c.photo} alt={`${c.client} owner`} fill sizes="44px" className="object-cover" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-v4-faint">// operator · {c.name}</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-v4-accent">view live ↗</span>
          </span>
        </a>
      </div>
    </div>
  );
}

export function ProofShowfloor() {
  return (
    <div>
      {ITEMS.map((c, i) => (
        <Floor key={c.clientKey} c={c} i={i} />
      ))}
    </div>
  );
}
