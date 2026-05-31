"use client";

import { useEffect, useRef } from "react";
import { PORTFOLIO, waUrl, SITE } from "@/lib/constants";

/* Brand mark used inline in copy */
function Mark() {
  return (
    <span className="font-semibold tracking-tight">
      <span className="text-[#10b981]">{"{"}</span>
      alqode
      <span className="text-[#10b981]">{"}"}</span>
    </span>
  );
}

/* Scroll-reveal: content is visible by default, animation only enhances it.
   Uses IntersectionObserver to add a class; CSS handles the transition and the
   reduced-motion fallback. Never gates visibility on JS. */
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
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

const CAPABILITIES = [
  { k: "Brand", d: "Identity, logo, and the system that makes it recognisable anywhere." },
  { k: "Web", d: "Sites and web apps on modern frameworks. Fast, custom, built to scale." },
  { k: "Commerce", d: "Stores that convert. WooCommerce, payments, the full retail engine." },
  { k: "Motion", d: "Real-time WebGL, animation, and the moments that make a brand stick." },
  { k: "Automation", d: "n8n and WhatsApp pipelines that do the work while you sleep." },
  { k: "Software", d: "Custom tools and SaaS when off-the-shelf will not cut it." },
];

export function PageSections() {
  const ref = useReveal();

  return (
    <main ref={ref} className="relative z-10 bg-[#040405] text-white">
      {/* ===== MANIFESTO ===== */}
      <section className="mx-auto max-w-[1400px] px-6 py-[18vh] md:px-10 lg:px-16">
        <p
          data-reveal
          className="reveal max-w-[20ch] font-mono text-[11px] uppercase tracking-[0.3em] text-white/40"
        >
          The studio
        </p>
        <h2
          data-reveal
          className="reveal mt-8 max-w-[16ch] text-balance font-sans text-[clamp(2rem,5.5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em]"
        >
          The whole stack, in house.
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-[1fr_minmax(0,34ch)] md:gap-16">
          <p
            data-reveal
            className="reveal max-w-[42ch] text-pretty text-[clamp(1.05rem,1.6vw,1.35rem)] leading-relaxed text-white/70"
          >
            <Mark /> is a digital studio in Cape Town, building for South Africa and
            the UAE. Brand, web, commerce, motion, automation, software, from the
            first sketch to the system that runs in production. Every layer under one
            roof, no handoffs, no agency overhead, no middle layer between the idea
            and the people building it.
          </p>
          <p
            data-reveal
            className="reveal self-end text-[clamp(1.05rem,1.6vw,1.35rem)] font-semibold leading-snug tracking-[-0.01em]"
          >
            We don&apos;t build websites. We build machines that make you money.
          </p>
        </div>
      </section>

      {/* ===== CAPABILITIES ===== */}
      <section className="border-t border-white/[0.06] px-6 py-[14vh] md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <h2
            data-reveal
            className="reveal font-sans text-[clamp(1.6rem,3.4vw,2.8rem)] font-bold tracking-[-0.02em]"
          >
            Six layers, one hand.
          </h2>
          <ul className="mt-12 divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {CAPABILITIES.map((c, i) => (
              <li
                key={c.k}
                data-reveal
                className="reveal group grid grid-cols-[3ch_1fr] items-baseline gap-x-6 py-6 md:grid-cols-[4ch_minmax(0,26ch)_1fr] md:gap-x-10 md:py-7"
              >
                <span className="font-mono text-xs text-white/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-sans text-[clamp(1.4rem,2.6vw,2.2rem)] font-semibold tracking-[-0.02em] transition-colors duration-300 group-hover:text-[#10b981]">
                  {c.k}
                </span>
                <span className="col-span-2 mt-2 max-w-[44ch] text-[0.98rem] leading-relaxed text-white/55 md:col-span-1 md:mt-0">
                  {c.d}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== WORK ===== */}
      <section className="border-t border-white/[0.06] px-6 py-[14vh] md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-end justify-between gap-6">
            <h2
              data-reveal
              className="reveal font-sans text-[clamp(1.6rem,3.4vw,2.8rem)] font-bold tracking-[-0.02em]"
            >
              Live in production.
            </h2>
            <span className="reveal shrink-0 font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">
              {PORTFOLIO.projects.length} systems
            </span>
          </div>

          <div className="mt-14 flex flex-col gap-px">
            {PORTFOLIO.projects.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                data-reveal
                className="reveal group grid grid-cols-1 gap-2 border-t border-white/[0.08] py-8 transition-colors duration-300 hover:bg-white/[0.02] md:grid-cols-[minmax(0,22ch)_1fr_auto] md:items-center md:gap-10"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-sans text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold tracking-[-0.02em] transition-colors duration-300 group-hover:text-[#10b981]">
                    {p.name}
                  </span>
                  <span className="font-mono text-[11px] text-white/30">
                    {p.deployedSince}
                  </span>
                </div>
                <span className="max-w-[52ch] text-[0.98rem] leading-relaxed text-white/55">
                  {p.result}
                </span>
                <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 transition-colors duration-300 group-hover:text-white">
                  Visit
                  <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                    ↗
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== START / CTA ===== */}
      <section className="border-t border-white/[0.06] px-6 py-[20vh] md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <h2
            data-reveal
            className="reveal max-w-[18ch] text-balance font-sans text-[clamp(2.2rem,6vw,5rem)] font-bold leading-[1.0] tracking-[-0.035em]"
          >
            Tell me what should run itself.
          </h2>
          <p
            data-reveal
            className="reveal mt-8 max-w-[46ch] text-[clamp(1.05rem,1.6vw,1.35rem)] leading-relaxed text-white/65"
          >
            Free mockup in 24 hours. A quote in one. Projects from R8,000. You see
            what you are getting before you pay a cent.
          </p>
          <div data-reveal className="reveal mt-12 flex flex-wrap items-center gap-4">
            <a
              href={waUrl("v4_start_primary", "Hi, I'd like to start a project with alqode")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#10b981] px-8 py-4 font-sans text-sm font-semibold text-[#040405] transition-transform duration-300 ease-out hover:scale-[1.04]"
            >
              Start on WhatsApp
              <span aria-hidden>→</span>
            </a>
            <a
              href={waUrl("v4_mockup", "Hi, I'd like a free 24h mockup")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 font-sans text-sm font-semibold text-white transition-colors duration-300 hover:border-white/50"
            >
              Get a free mockup
            </a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/[0.06] px-6 py-12 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-lg">
            <Mark />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">
            <a className="transition-colors hover:text-white" href={waUrl("v4_footer")} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a className="transition-colors hover:text-white" href={SITE.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a className="transition-colors hover:text-white" href={SITE.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a className="transition-colors hover:text-white" href={`mailto:${SITE.email}`}>
              Email
            </a>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/30">
            Cape Town · © 2026
          </div>
        </div>
      </footer>
    </main>
  );
}
