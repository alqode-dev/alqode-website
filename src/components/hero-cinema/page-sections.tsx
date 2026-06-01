"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PORTFOLIO, waUrl, SITE } from "@/lib/constants";
import { BudgetSlider } from "./budget-slider";
import { StudioSnakeLine } from "./studio-snake-line";
import { FounderOrbit } from "./founder-orbit";

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

const CAPABILITIES = [
  { k: "Brand", d: "Identity, logo, and the system that makes it recognisable anywhere." },
  { k: "Web", d: "Sites and web apps on modern frameworks. Fast, custom, built to scale." },
  { k: "Commerce", d: "Stores that convert. WooCommerce, payments, the full retail engine." },
  { k: "Motion", d: "Real-time WebGL, animation, and the moments that make a brand stick." },
  { k: "Automation", d: "n8n and WhatsApp pipelines that do the work while you sleep." },
  { k: "Software", d: "Custom tools and platforms when off-the-shelf will not cut it." },
];

type Project = (typeof PORTFOLIO.projects)[number];

/* Framed live screenshot for a Work row — tries image, then fallback, then a
   branded placeholder if there is no shot yet (Trophy SA). */
function ProjectVisual({ project }: { project: Project }) {
  const [src, setSrc] = useState<string | null>(project.image);
  const showImage = Boolean(src);

  return (
    <div className="group/vis relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-v4-bg-2">
      {showImage ? (
        <Image
          src={src as string}
          alt={`${project.name} — live site`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
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
      {/* depth + sheen */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-v4-bg/55 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/[0.06]" />
      {/* open affordance */}
      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-v4-accent/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-v4-bg opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
        Open ↗
      </span>
    </div>
  );
}

export function PageSections() {
  const ref = useReveal();

  return (
    <main ref={ref} className="relative z-10 bg-v4-bg text-v4-ink">
      {/* ===== MANIFESTO + STUDIO SNAKE LINE ===== */}
      <section className="relative overflow-hidden px-6 pb-[14vh] pt-[18vh] md:pb-[40vh] md:px-10 lg:px-16">
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <p
            data-reveal
            className="reveal max-w-[20ch] font-mono text-[11px] uppercase tracking-[0.3em] text-v4-faint"
          >
            The studio
          </p>
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
              <Mark /> is a digital studio in Cape Town, building for South Africa and
              the UAE. Brand, web, commerce, motion, automation, software, from the
              first sketch to the system that runs in production. Every layer under one
              roof, no handoffs, no agency overhead, no middle layer between the idea
              and the people building it.
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
      <section className="border-t border-white/[0.06] bg-v4-bg-2 px-6 py-[14vh] md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <p
            data-reveal
            className="reveal font-mono text-[11px] uppercase tracking-[0.3em] text-v4-faint"
          >
            What we do
          </p>
          <h2
            data-reveal
            className="reveal mt-6 font-sans text-[clamp(1.6rem,3.4vw,2.8rem)] font-bold tracking-[-0.02em] text-white"
          >
            Six layers, one hand.
          </h2>
          <ul className="mt-12 border-t border-white/[0.08]">
            {CAPABILITIES.map((c, i) => (
              <li
                key={c.k}
                data-reveal
                className="reveal group relative -mx-3 grid grid-cols-[3ch_1fr] items-baseline gap-x-6 border-b border-white/[0.08] px-3 py-6 transition-colors duration-500 ease-snap hover:bg-white/[0.015] md:-mx-5 md:grid-cols-[4ch_minmax(0,26ch)_1fr] md:gap-x-10 md:px-5 md:py-7"
              >
                {/* left accent bar grows on hover */}
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 h-0 w-[2px] -translate-y-1/2 bg-v4-accent transition-all duration-500 ease-snap group-hover:h-[62%]"
                />
                <span className="font-mono text-xs text-v4-faint transition-colors duration-300 group-hover:text-v4-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-sans text-[clamp(1.4rem,2.6vw,2.2rem)] font-semibold tracking-[-0.02em] text-v4-ink transition-[color,transform] duration-300 ease-snap group-hover:translate-x-1 group-hover:text-v4-accent">
                  {c.k}
                </span>
                <span className="col-span-2 mt-2 max-w-[44ch] text-[0.98rem] leading-relaxed text-v4-muted transition-colors duration-300 group-hover:text-v4-ink md:col-span-1 md:mt-0">
                  {c.d}
                </span>
                {/* hover arrow */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 font-mono text-base text-v4-accent opacity-0 transition-all duration-300 ease-snap group-hover:translate-x-1 group-hover:opacity-100 md:right-5 md:block"
                >
                  →
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== WORK — large alternating editorial showcase (distinct from the index) ===== */}
      <section className="border-t border-white/[0.06] px-6 py-[16vh] md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-end justify-between gap-6">
            <h2
              data-reveal
              className="reveal max-w-[14ch] text-balance font-sans text-[clamp(1.8rem,4.4vw,3.4rem)] font-bold leading-[1.0] tracking-[-0.025em] text-white"
            >
              Shipped. Live. Earning.
            </h2>
            <span className="reveal shrink-0 font-mono text-[11px] uppercase tracking-[0.28em] text-v4-faint">
              {PORTFOLIO.projects.length} in production
            </span>
          </div>

          <div className="mt-16 flex flex-col gap-[12vh] md:mt-24">
            {PORTFOLIO.projects.map((p, i) => {
              const right = i % 2 === 1;
              return (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-reveal
                  className="reveal group grid items-center gap-7 md:grid-cols-2 md:gap-14"
                >
                  {/* text column */}
                  <div className={right ? "md:order-2" : ""}>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-v4-faint">
                        {p.category === "community" ? "Community" : "Client"}
                      </span>
                      <span className="h-px w-10 bg-white/15" />
                      <span className="font-mono text-[11px] text-v4-faint">{p.deployedSince}</span>
                    </div>
                    <h3 className="mt-4 font-sans text-[clamp(2rem,4.6vw,3.6rem)] font-bold leading-[0.98] tracking-[-0.035em] text-v4-ink transition-colors duration-300 group-hover:text-v4-accent">
                      {p.name}
                    </h3>
                    <p className="mt-4 text-[clamp(1.05rem,1.5vw,1.3rem)] font-medium leading-snug text-v4-ink">
                      {p.result}
                    </p>
                    <p className="mt-3 max-w-[46ch] text-[0.98rem] leading-relaxed text-v4-muted">
                      {p.description}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-v4-faint transition-colors duration-300 group-hover:text-v4-ink">
                      Visit live site
                      <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                        ↗
                      </span>
                    </span>
                  </div>
                  {/* visual column */}
                  <div className={right ? "md:order-1" : ""}>
                    <ProjectVisual project={p} />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FOUNDER — face in the system (solar system) ===== */}
      <section className="relative overflow-hidden border-t border-white/[0.06] bg-[#050608] px-6 py-[16vh] md:px-10 lg:px-16">
        {/* faint starfield + deep-space vignette = its own universe */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 70% 65%, rgba(255,255,255,0.4), transparent), radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,0.35), transparent), radial-gradient(1px 1px at 85% 20%, rgba(255,255,255,0.4), transparent), radial-gradient(1.5px 1.5px at 55% 45%, rgba(16,185,129,0.4), transparent)",
            backgroundSize: "auto",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_50%,transparent,rgba(5,6,8,0.85))]"
        />
        <div className="relative mx-auto max-w-[1400px]">
          <p
            data-reveal
            className="reveal font-mono text-[11px] uppercase tracking-[0.3em] text-v4-faint"
          >
            Who you work with
          </p>
          <div className="mt-10 grid items-center gap-10 md:mt-12 md:grid-cols-2 md:gap-16">
            <div data-reveal className="reveal order-1">
              <FounderOrbit />
            </div>
            <div data-reveal className="reveal order-2">
              <blockquote className="max-w-[20ch] text-balance font-sans text-[clamp(1.7rem,3.4vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-white">
                Our job is to make you so successful,{" "}
                <span className="text-v4-accent">your competitors run out of business.</span>
              </blockquote>
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

      {/* ===== START / CTA ===== */}
      <section className="border-t border-white/[0.06] bg-v4-bg-2 px-6 py-[20vh] md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
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

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/[0.06] px-6 py-12 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-lg text-v4-ink">
            <Mark />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-v4-muted">
            <a className="transition-colors hover:text-v4-ink" href={waUrl("v4_footer")} target="_blank" rel="noopener noreferrer">
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
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-v4-faint">
            Cape Town · © 2026
          </div>
        </div>
      </footer>
    </main>
  );
}
