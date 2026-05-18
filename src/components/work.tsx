"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/lib/animations";
import { PORTFOLIO, TESTIMONIALS } from "@/lib/constants";
import { TECH_ICON_MAP, TECH_COLORS } from "@/components/tech-icons";
import { ClientMiniLogo } from "@/components/client-logos-svg";
import { Bracketed } from "@/components/primitives/bracketed";
import { LiveStatus } from "@/components/primitives/live-status";
import { MonoTag } from "@/components/primitives/mono-tag";

type Project = (typeof PORTFOLIO.projects)[number];
type Testimonial = (typeof TESTIMONIALS.items)[number];

function findTestimonial(projectName: string): Testimonial | undefined {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const projectKey = norm(projectName);
  return TESTIMONIALS.items.find((t) => {
    const clientKey = norm(t.client);
    return (
      projectKey === clientKey ||
      projectKey.includes(clientKey) ||
      clientKey.includes(projectKey)
    );
  });
}

function DeploymentCard({
  project,
  testimonial,
  deployId,
}: {
  project: Project;
  testimonial: Testimonial | undefined;
  deployId: string;
}) {
  const initial = project.image ?? project.fallbackImage ?? null;
  const [imgSrc, setImgSrc] = useState<string | null>(initial);
  const [imgError, setImgError] = useState(!initial);

  const isCommunity = project.category === "community";

  return (
    <article className="reveal-item bg-card-bg rounded-xl overflow-hidden border border-border hover:border-terminal/30 transition-all duration-500 ease-snap group relative flex flex-col h-full">
      {/* Image with scanline overlay + status overlay */}
      <div className="relative h-[200px] md:h-[220px] bg-dim-bg overflow-hidden flex-shrink-0 scanline-overlay">
        {!imgError && imgSrc ? (
          <Image
            src={imgSrc}
            alt={`${project.name} screenshot`}
            fill
            className="object-cover transition-transform duration-700 ease-snap group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            onError={() => {
              if (project.fallbackImage && imgSrc !== project.fallbackImage) {
                setImgSrc(project.fallbackImage);
              } else {
                setImgError(true);
              }
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-card-bg via-dim-bg to-void">
            <div className="text-center px-4">
              <div className="font-display text-3xl md:text-4xl italic text-white/70 leading-tight">
                {project.name}
              </div>
              <div className="font-mono text-[9px] tracking-[2px] uppercase text-terminal/60 mt-2">
                live site
              </div>
            </div>
          </div>
        )}

        {/* Top overlay: status badge + deploy ID */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
          <div className="bg-void/75 backdrop-blur-sm rounded-md px-2.5 py-1.5">
            <LiveStatus
              variant={isCommunity ? "active" : "live"}
              size="xs"
            >
              {isCommunity
                ? `community · since ${project.deployedSince}`
                : `live · since ${project.deployedSince}`}
            </LiveStatus>
          </div>
          <div className="bg-void/75 backdrop-blur-sm rounded-md px-2 py-1.5 hidden md:block">
            <MonoTag variant="muted">{deployId}</MonoTag>
          </div>
        </div>

        {/* Visit overlay on hover */}
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 z-10 bg-terminal text-void rounded-md px-3 py-1.5 text-xs font-bold opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 ease-snap inline-flex items-center gap-1.5"
            aria-label={`Visit ${project.name}`}
          >
            Open
            <ExternalLink size={11} />
          </a>
        )}
      </div>

      {/* Content */}
      <div className="p-5 md:p-6 flex-1 flex flex-col">
        <h3 className="font-display text-2xl md:text-[28px] italic leading-tight mb-2">
          {project.name}
        </h3>
        {project.result && (
          <p className="text-[13px] md:text-sm text-terminal font-semibold leading-snug mb-3">
            {project.result}
          </p>
        )}
        <p className="text-xs md:text-sm text-muted leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded bg-terminal/15 text-terminal font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Tech pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tech.map((t) => {
            const Icon = TECH_ICON_MAP[t];
            const color = TECH_COLORS[t];
            const colorPill = !Icon && !!color;
            return (
              <span
                key={t}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded border font-medium"
                style={
                  colorPill
                    ? { color, borderColor: `${color}55` }
                    : { color: "#666", borderColor: "#2a2a2a" }
                }
              >
                {Icon && (
                  <Icon
                    size={12}
                    style={{ color: color || undefined }}
                    className={color ? "" : "opacity-70"}
                  />
                )}
                {t}
              </span>
            );
          })}
        </div>

        {/* Spacer pushes the footer down */}
        <div className="flex-1" />

        {/* Footer: testimonial log OR community note */}
        {testimonial ? (
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center justify-between gap-2 mb-3">
              <MonoTag variant="terminal">
                ▸ user feedback
              </MonoTag>
              <MonoTag variant="muted">verified</MonoTag>
            </div>
            <p className="text-[13px] md:text-sm leading-relaxed text-white/85 mb-4 font-medium">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-dim-bg ring-1 ring-terminal/30">
                <Image
                  src={testimonial.photo}
                  alt={`${testimonial.name} at ${testimonial.client}`}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="flex-1 leading-tight">
                <div className="text-xs font-semibold">{testimonial.name}</div>
                <div className="text-[11px] text-muted mt-0.5">{testimonial.role}</div>
              </div>
              <a
                href={testimonial.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-terminal hover:gap-1.5 transition-all duration-200 ease-snap"
                aria-label={`Visit ${testimonial.client}`}
              >
                <ClientMiniLogo clientKey={testimonial.clientKey} />
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <MonoTag variant="terminal">
                <Bracketed tight>community deployment</Bracketed>
              </MonoTag>
              <MonoTag variant="muted">public access</MonoTag>
            </div>
            <p className="text-[13px] md:text-sm leading-relaxed text-white/75">
              No client. No invoice. Built and maintained as a service to the community.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

export function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="section-padding"
      aria-label="Our work"
    >
      <div className="container-width">
        {/* Mono tag header */}
        <p className="reveal-item text-terminal text-xs md:text-sm font-mono font-semibold tracking-[1px] mb-3 md:mb-4">
          {PORTFOLIO.tag}
        </p>
        <div className="reveal-item flex items-baseline gap-3 md:gap-4 mb-3 flex-wrap">
          <h2 className="font-display text-[clamp(2rem,5.5vw,4rem)] italic font-normal leading-[1.02] tracking-tight">
            {PORTFOLIO.heading}{" "}
            <span className="text-terminal">{PORTFOLIO.headingAccent}</span>
          </h2>
          <MonoTag variant="muted">
            <Bracketed tight>{PORTFOLIO.projects.length} active</Bracketed>
          </MonoTag>
        </div>
        <p className="reveal-item text-sm md:text-base text-muted leading-relaxed mb-10 md:mb-14 max-w-2xl">
          {PORTFOLIO.subline}
        </p>

        {/* 2-col grid of deployment cards (1-col mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          {PORTFOLIO.projects.map((project, i) => {
            const testimonial = findTestimonial(project.name);
            const deployId = `[deploy:${project.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-${String(i + 1).padStart(2, "0")}]`;
            return (
              <DeploymentCard
                key={project.name}
                project={project}
                testimonial={testimonial}
                deployId={deployId}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
