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
} from "./machine";

/**
 * CLIENT PROOF — each client as an interactive before → after "power-on".
 *
 * Not a testimonial card and not a console. Research says the proof that
 * actually converts is the TRANSFORMATION (before/after) made interactive. So
 * each real client is a draggable reveal: the dead, OFFLINE problem state on
 * one side; drag the handle and their ACTUAL live site powers on in full colour
 * with the result. Honest (the "after" is their real live site; the "before"
 * is the stated problem in the machine's offline style, not a faked old shot),
 * interactive like the configurator, and on-brand with the whole site's
 * boot/power-on motif. The owner's words anchor it underneath.
 */

type Case = (typeof TESTIMONIALS.items)[number];

function domain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function Stage({ c }: { c: Case }) {
  const stage = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLSpanElement>(null);
  const after = useRef<HTMLParagraphElement>(null);
  const pos = useRef(0.16);

  const apply = (p: number) => {
    const v = Math.max(0, Math.min(1, p));
    pos.current = v;
    if (overlay.current) overlay.current.style.clipPath = `inset(0 ${(1 - v) * 100}% 0 0)`;
    if (handle.current) handle.current.style.left = `${v * 100}%`;
    // the result line fades in only as the site powers on, so it never
    // collides with the problem text mid-reveal
    if (after.current) after.current.style.opacity = String(Math.max(0, Math.min(1, (v - 0.5) / 0.28)));
  };

  const hideHint = () => {
    if (hint.current) gsap.to(hint.current, { opacity: 0, duration: 0.3 });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    hideHint();
    const el = stage.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const move = (ev: PointerEvent) => apply((ev.clientX - rect.left) / rect.width);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    apply((e.clientX - rect.left) / rect.width);
  };

  useGSAP(
    () => {
      registerMachine();
      apply(0.16);
      if (prefersReducedMotion()) {
        apply(1);
        if (hint.current) hint.current.style.opacity = "0";
        return;
      }
      const proxy = { v: 0.16 };
      ScrollTrigger.create({
        trigger: stage.current,
        start: "top 78%",
        once: true,
        onEnter: () => {
          gsap.to(proxy, {
            v: 0.6,
            duration: 1.1,
            ease: "power2.inOut",
            onUpdate: () => apply(proxy.v),
            onComplete: () => {
              gsap.to(proxy, {
                v: 0.34,
                duration: 0.7,
                ease: "power2.inOut",
                onUpdate: () => apply(proxy.v),
              });
            },
          });
        },
      });
    },
    { scope: stage }
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.12] bg-v4-bg-2 shadow-[0_40px_100px_-60px_rgba(0,0,0,0.95)]">
      {/* browser chrome */}
      <div className="flex items-center gap-3 border-b border-white/[0.08] bg-[#090c10] px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        <span className="truncate font-mono text-[11px] tracking-[0.02em] text-v4-faint">
          {domain(c.url)}
        </span>
      </div>

      {/* the stage */}
      <div ref={stage} className="relative aspect-[4/5] touch-pan-y select-none sm:aspect-[3/2] md:aspect-[16/10]">
        {/* BEFORE — the dead, offline problem state */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_70%_20%,#13171c_0%,#070809_75%)]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.5] [background:repeating-linear-gradient(0deg,transparent_0,transparent_3px,rgba(255,255,255,0.025)_3px,rgba(255,255,255,0.025)_4px)]"
          />
          <div className="absolute right-4 top-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]">
            <span className="h-1.5 w-1.5 rounded-full bg-v4-ember/80" />
            <span className="text-v4-faint">offline</span>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-v4-faint">
              before
            </span>
            <p className="max-w-[22ch] font-sans text-[clamp(1.05rem,2.2vw,1.6rem)] font-semibold leading-snug text-v4-muted">
              {c.before}
            </p>
          </div>
        </div>

        {/* AFTER — their real live site, powered on, revealed by the handle */}
        <div
          ref={overlay}
          className="absolute inset-0 will-change-[clip-path]"
          style={{ clipPath: "inset(0 84% 0 0)" }}
        >
          <Image
            src={c.site}
            alt={`${c.client} live site`}
            fill
            sizes="(max-width: 768px) 90vw, 1000px"
            className="object-cover object-top"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />
          <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]">
            <span className="machine-dot" data-on="true" />
            <span className="text-v4-accent">online</span>
            <span className="rounded border border-v4-accent/30 px-1.5 py-0.5 text-[9px] text-v4-accent">
              {c.metric}
            </span>
          </div>
          <p
            ref={after}
            style={{ opacity: 0 }}
            className="absolute bottom-4 left-4 right-4 max-w-[34ch] font-sans text-[clamp(0.95rem,1.7vw,1.25rem)] font-semibold leading-snug text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.85)]"
          >
            {c.after}
          </p>
        </div>

        {/* drag handle */}
        <div
          ref={handle}
          onPointerDown={onPointerDown}
          role="slider"
          aria-label={`Reveal what we built for ${c.client}`}
          aria-valuenow={50}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          className="absolute top-0 bottom-0 z-20 -ml-6 w-12 cursor-ew-resize touch-none"
          style={{ left: "16%" }}
        >
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-v4-accent/80 shadow-[0_0_14px_rgba(16,185,129,0.6)]" />
          <span className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-v4-accent/50 bg-[#0a0d11]/90 font-mono text-[12px] text-v4-accent shadow-[0_0_18px_-2px_rgba(16,185,129,0.55)] backdrop-blur-sm">
            ↔
          </span>
        </div>

        {/* invite */}
        <span
          ref={hint}
          className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full border border-white/10 bg-black/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-v4-ink backdrop-blur-sm"
        >
          ← drag to power it on →
        </span>
      </div>
    </div>
  );
}

export function ClientProof() {
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {TESTIMONIALS.items.map((c, i) => {
        const location = c.role.split(" · ")[1] ?? c.role;
        return (
          <div key={c.clientKey} data-reveal className="reveal">
            <div className="mb-5 flex items-center gap-3 md:mb-7">
              <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-v4-accent">
                case.{String(i + 1).padStart(2, "0")}
              </span>
              <span className="h-px flex-1 bg-white/10" />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-v4-faint">
                {c.client} · {location}
              </span>
            </div>

            <Stage c={c} />

            {/* the owner's words confirm the transformation */}
            <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-10">
              <blockquote className="max-w-[58ch] border-l-2 border-v4-accent/40 pl-4 font-display text-[clamp(1.1rem,1.7vw,1.45rem)] italic leading-relaxed text-v4-muted">
                {`“${c.quote}”`}
              </blockquote>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-80"
              >
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/15">
                  <Image src={c.photo} alt={`${c.client} owner`} fill sizes="44px" className="object-cover" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-v4-ink">
                    {c.client}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-v4-accent">
                    view live ↗
                  </span>
                </span>
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
