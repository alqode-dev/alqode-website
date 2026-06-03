"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PORTFOLIO, waUrl, SITE } from "@/lib/constants";
import { BudgetSlider } from "./budget-slider";
import { StudioSnakeLine } from "./studio-snake-line";
import { ControlCore } from "./control-core";
import { CapabilityModules } from "./capability-modules";
import { MachineSpine } from "./machine-spine";
import { StatusReadout } from "./status-readout";

/* Brand mark used inline in copy */
function Mark() {
  return (
    <span className="font-semibold tracking-tight">
      <span className="text-v4-accent">{"{"}</span>
      alqode
      <span className="text-v4-accent">{"}"}</span>
    </span>
  );
}

/* Scroll-reveal: content is visible by default, animation only enhances it. */
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.shown = "true";
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

type Project = (typeof PORTFOLIO.projects)[number];

/* A DEPLOYED UNIT — the live screenshot wrapped in machine chrome with a live
   telemetry bar (status, deploy id, since YYYY) and bracket corner furniture.
   Tries image, then fallback, then a branded placeholder (Trophy SA). */
function ProjectVisual({ project, index }: { project: Project; index: number }) {
  const [src, setSrc] = useState<string | null>(project.image);
  const showImage = Boolean(src);
  const live = project.category !== "community";
  const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const unit = String(index + 1).padStart(2, "0");

  return (
    <div className="group/vis relative">
      <div className="relative overflow-hidden rounded-xl border border-white/[0.12] bg-v4-bg-2 shadow-[0_30px_90px_-50px_rgba(0,0,0,0.95)]">
        {/* telemetry bar */}
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] bg-[#090c10] px-3 py-2">
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]">
            <span
              className="machine-dot"
              data-on="true"
              style={
                live
                  ? undefined
                  : { background: "#ff9742", boxShadow: "0 0 8px 1px rgba(255,151,66,0.7)" }
              }
            />
            <span className={live ? "text-v4-accent" : "text-v4-ember"}>
              {live ? "LIVE" : "COMMUNITY"}
            </span>
            <span className="hidden text-v4-faint sm:inline">deploy:{slug}-{unit}</span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-v4-faint">
            since {project.deployedSince}
          </span>
        </div>

        {/* the unit itself */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {showImage ? (
            <Image
              src={src as string}
              alt={`${project.name} — live site`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover/vis:scale-[1.05]"
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
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-v4-accent/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-v4-bg opacity-0 translate-y-1 transition-all duration-300 group-hover/vis:opacity-100 group-hover/vis:translate-y-0">
            Open ↗
          </span>
        </div>
      </div>

      {/* bracket corner furniture — this is a mounted unit */}
      <span className="pointer-events-none absolute -left-1.5 -top-1.5 h-3.5 w-3.5 border-l border-t border-v4-accent/60" />
      <span className="pointer-events-none absolute -right-1.5 -top-1.5 h-3.5 w-3.5 border-r border-t border-v4-accent/60" />
      <span className="pointer-events-none absolute -bottom-1.5 -left-1.5 h-3.5 w-3.5 border-b border-l border-v4-accent/60" />
      <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 border-b border-r border-v4-accent/60" />
    </div>
  );
}

export function PageSections() {
  const ref = useReveal();

  return (
    <main ref={ref} className="relative z-10 bg-v4-bg text-v4-ink">
      <MachineSpine />
      {/* ===== MANIFESTO + STUDIO SNAKE LINE ===== */}
      <section className="machine-panel relative overflow-hidden px-6 pb-[10vh] pt-[12vh] md:pb-[40vh] md:pt-[18vh] md:px-10 lg:px-16">
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <div data-reveal className="reveal">
            <StatusReadout label="module.alqode" online="ONLINE" detail="every layer" />
          </div>
          <h2
            data-reveal
            className="reveal mt-8 max-w-[16ch] text-balance font-sans text-[clamp(2rem,5.5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white"
          >
            The whole stack, in house.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-[1fr_minmax(0,34ch)] md:gap-16">
            <p
              data-reveal
              className="reveal max-w-[42ch] text-pretty text-[clamp(1.05rem,1.6vw,1.35rem)] leading-relaxed text-v4-muted"
            >
              <Mark /> builds digital systems in Cape Town, for South Africa and the
              UAE. Brand, web, commerce, motion, automation, software, from the first
              sketch to the system that runs in production. Every layer under one roof,
              no handoffs, no agency overhead, no middle layer between the idea and the
              people building it.
            </p>
            <p
              data-reveal
              className="reveal self-end text-[clamp(1.05rem,1.6vw,1.35rem)] font-semibold leading-snug tracking-[-0.01em] text-v4-ink"
            >
              We don&apos;t build websites. We build machines that make you money.
            </p>
          </div>
        </div>
        <StudioSnakeLine />
      </section>

      {/* ===== CAPABILITIES — tight numbered index ===== */}
      <section className="machine-panel machine-edge relative px-6 py-[10vh] md:py-[14vh] md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div data-reveal className="reveal">
            <StatusReadout label="module.capabilities" online="ONLINE" detail="6 layers" />
          </div>
          <p className="sr-only">What we do</p>
          <h2
            data-reveal
            className="reveal mt-6 max-w-[18ch] text-balance font-sans text-[clamp(1.8rem,3.8vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white"
          >
            From your logo to your last automation.
          </h2>
          <p
            data-reveal
            className="reveal mt-4 max-w-[48ch] text-[0.98rem] leading-relaxed text-v4-muted"
          >
            Take one module or hand us the whole machine. Every part powers the next.
          </p>
          <CapabilityModules />
        </div>
      </section>

      {/* ===== WORK — large alternating editorial showcase (distinct from the index) ===== */}
      <section className="machine-panel machine-edge relative px-6 py-[11vh] md:py-[16vh] md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div data-reveal className="reveal">
            <StatusReadout
              label="module.work"
              online="DEPLOYED"
              detail={`${PORTFOLIO.projects.length} units live`}
            />
          </div>
          <div className="mt-6 flex items-end justify-between gap-6">
            <h2
              data-reveal
              className="reveal max-w-[14ch] text-balance font-sans text-[clamp(1.8rem,4.4vw,3.4rem)] font-bold leading-[1.0] tracking-[-0.025em] text-white"
            >
              Shipped. Live. Earning.
            </h2>
          </div>

          <div className="mt-10 flex flex-col gap-[5vh] md:mt-24 md:gap-[12vh]">
            {PORTFOLIO.projects.map((p, i) => {
              const right = i % 2 === 1;
              return (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-reveal
                  className="reveal group grid items-center gap-5 md:grid-cols-2 md:gap-14"
                >
                  {/* text column — image leads on mobile, alternates on desktop */}
                  <div className={`order-2 ${right ? "md:order-2" : "md:order-1"}`}>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-v4-accent">
                        unit.{String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="h-px w-10 bg-white/15" />
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-v4-faint">
                        {p.category === "community" ? "community" : "client"} · {p.deployedSince}
                      </span>
                    </div>
                    <h3 className="mt-3 font-sans text-[clamp(1.9rem,4.6vw,3.6rem)] font-bold leading-[0.98] tracking-[-0.035em] text-v4-ink transition-colors duration-300 group-hover:text-v4-accent md:mt-4">
                      {p.name}
                    </h3>
                    {/* result as a telemetry metric */}
                    <div className="mt-3 flex items-start gap-3 border-l-2 border-v4-accent/60 pl-3 md:mt-5">
                      <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-v4-faint">
                        output
                      </span>
                      <p className="text-[clamp(1.05rem,1.5vw,1.3rem)] font-medium leading-snug text-v4-ink">
                        {p.result}
                      </p>
                    </div>
                    <p className="mt-3 line-clamp-2 max-w-[46ch] text-[0.95rem] leading-relaxed text-v4-muted md:line-clamp-none md:text-[0.98rem]">
                      {p.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-v4-faint transition-colors duration-300 group-hover:text-v4-ink md:mt-6">
                      Visit live site
                      <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                        ↗
                      </span>
                    </span>
                  </div>
                  {/* visual column */}
                  <div className={`order-1 ${right ? "md:order-1" : "md:order-2"}`}>
                    <ProjectVisual project={p} index={i} />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FOUNDER — THE CONTROL CORE (operator wired into the systems) ===== */}
      <section className="machine-panel machine-edge relative overflow-hidden px-6 py-[11vh] md:py-[16vh] md:px-10 lg:px-16">
        <div className="relative mx-auto max-w-[1400px]">
          <div data-reveal className="reveal">
            <StatusReadout label="module.core" online="OPERATOR ONLINE" detail="one roof" />
          </div>
          <div className="mt-10 grid items-center gap-10 md:mt-12 md:grid-cols-2 md:gap-16">
            <div data-reveal className="reveal order-1">
              <ControlCore />
            </div>
            <div data-reveal className="reveal order-2">
              <blockquote className="max-w-[20ch] text-balance font-sans text-[clamp(1.7rem,3.4vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-white">
                Our job is to make you so successful,{" "}
                <span className="text-v4-accent">your competitors run out of business.</span>
              </blockquote>
              <p className="mt-7 max-w-[40ch] text-[0.98rem] leading-relaxed text-v4-muted">
                Every system you see routes through one person. No agency layers,
                no handoffs, no junior on your account. The studio answers to you,
                because it answers to me.
              </p>
              <div className="mt-9 flex items-center gap-4">
                <span className="h-px w-12 bg-white/20" />
                <div>
                  <p className="font-sans text-base font-semibold text-v4-ink">
                    Mohammed Hamdaan Dhaler
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-v4-faint">
                    Founder · Cape Town · building for SA + UAE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== START / CTA — the configurator console ===== */}
      <section className="machine-panel machine-edge machine-ember-rim relative px-6 py-[13vh] md:py-[20vh] md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div data-reveal className="reveal mb-6">
            <StatusReadout label="module.configurator" online="READY" detail="dial output" />
          </div>
          <h2
            data-reveal
            className="reveal max-w-[18ch] text-balance font-sans text-[clamp(2.2rem,6vw,5rem)] font-bold leading-[1.0] tracking-[-0.035em] text-white"
          >
            Tell me what should run itself.
          </h2>
          <p
            data-reveal
            className="reveal mt-8 max-w-[46ch] text-[clamp(1.05rem,1.6vw,1.35rem)] leading-relaxed text-v4-muted"
          >
            Move the slider. See what your budget actually builds. Then send it
            straight to me.
          </p>
          <div data-reveal className="reveal">
            <BudgetSlider />
          </div>
        </div>
      </section>

      {/* ===== FOOTER — STANDBY ===== */}
      <footer className="machine-panel machine-edge relative px-6 py-14 md:px-10 md:py-16 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div data-reveal className="reveal">
            <StatusReadout label="module.standby" online="CHANNEL OPEN" detail="one message away" />
          </div>
          <div className="mt-9 flex flex-col gap-9 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-2xl text-v4-ink">
                <Mark />
              </div>
              <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-v4-muted">
                Every layer in house. We build machines that make you money.
              </p>
              <a
                href={waUrl("v4_footer")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-v4-accent px-6 py-3 font-sans text-sm font-semibold text-v4-bg transition-transform duration-300 ease-snap hover:scale-[1.03]"
              >
                Open a channel
                <span aria-hidden>→</span>
              </a>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-v4-muted">
              <a className="transition-colors hover:text-v4-ink" href={waUrl("v4_footer_links")} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              <a className="transition-colors hover:text-v4-ink" href={SITE.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a className="transition-colors hover:text-v4-ink" href={SITE.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a className="transition-colors hover:text-v4-ink" href={`mailto:${SITE.email}`}>
                Email
              </a>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-white/[0.06] pt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-v4-faint sm:flex-row sm:items-center sm:justify-between">
            <span>Cape Town · SA + UAE</span>
            <span>© 2026 alqode</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
