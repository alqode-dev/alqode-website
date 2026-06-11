"use client";

import { useEffect, useRef } from "react";
import { waUrl, SITE } from "@/lib/constants";
import { BudgetSlider } from "./budget-slider";
import { StudioSnakeLine } from "./studio-snake-line";
import { ControlCore } from "./control-core";
import { CapabilityModules } from "./capability-modules";
import { WorkGallery } from "./work-gallery";
import { FieldSignal } from "./field-signal";
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

      {/* ===== CAPABILITIES — one living line, the six cycle through it ===== */}
      <section className="machine-panel machine-edge relative px-6 py-[12vh] md:py-[16vh] md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div data-reveal className="reveal">
            <StatusReadout label="module.capabilities" online="ONLINE" detail="6 layers" />
          </div>
          <h2 className="sr-only">What we do: from your logo to your last automation</h2>
          <CapabilityModules />
        </div>
      </section>

      {/* ===== WORK — DEPLOYED UNITS (premium horizontal showcase gallery) ===== */}
      <WorkGallery />

      {/* ===== CLIENT PROOF — what we solved, in their words ===== */}
      <section className="machine-panel machine-edge relative px-6 py-[11vh] md:py-[16vh] md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1100px]">
          <div data-reveal className="reveal">
            <StatusReadout label="module.proof" online="ONLINE" detail="3 clients · 2 countries" />
          </div>
          <h2
            data-reveal
            className="reveal mt-6 max-w-[18ch] text-balance font-sans text-[clamp(1.8rem,4.4vw,3.4rem)] font-bold leading-[1.0] tracking-[-0.025em] text-white"
          >
            Real problems, solved.
          </h2>
          <p
            data-reveal
            className="reveal mt-4 max-w-[52ch] text-[0.98rem] leading-relaxed text-v4-muted"
          >
            What we built for three real businesses across two countries, and what it changed, in their words.
          </p>
          <div data-reveal className="reveal mt-10 md:mt-14">
            <FieldSignal />
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
                no handoffs, no junior on your account. The work answers to you,
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
              <p className="mt-3 max-w-[32ch] text-sm leading-relaxed text-v4-muted">
                Tell me what is costing you time or money. If a system can fix it,
                we will build it.
              </p>
              <a
                href={waUrl("v4_footer")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-v4-accent px-7 py-3.5 font-sans text-sm font-semibold text-v4-bg transition-transform duration-300 ease-snap hover:scale-[1.03]"
              >
                Let&apos;s solve a problem
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
