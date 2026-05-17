"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ExternalLink, Quote } from "lucide-react";
import { useScrollReveal } from "@/lib/animations";
import { PORTFOLIO, TESTIMONIALS } from "@/lib/constants";
import { TECH_ICON_MAP, TECH_COLORS } from "@/components/tech-icons";
import { ClientMiniLogo } from "@/components/client-logos-svg";

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

function ProjectCard({ project }: { project: Project }) {
  const initial = project.image ?? project.fallbackImage ?? null;
  const [imgSrc, setImgSrc] = useState<string | null>(initial);
  const [imgError, setImgError] = useState(!initial);

  return (
    <article className="bg-card-bg rounded-xl overflow-hidden border border-border hover:border-terminal/30 transition-all duration-300 group flex flex-col h-full">
      {/* Screenshot or branded placeholder */}
      <div className="relative h-[180px] md:h-[200px] bg-dim-bg overflow-hidden flex-shrink-0">
        {!imgError && imgSrc ? (
          <Image
            src={imgSrc}
            alt={`${project.name} screenshot`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
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
              <div className="font-display text-2xl md:text-3xl italic text-white/70 leading-tight">
                {project.name}
              </div>
              <div className="text-[9px] tracking-[2px] uppercase text-terminal/60 mt-2">
                Live site
              </div>
            </div>
          </div>
        )}
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 bg-void/70 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`Visit ${project.name}`}
          >
            <ExternalLink size={14} className="text-white" />
          </a>
        )}
      </div>

      <div className="p-5 md:p-6 flex-1 flex flex-col">
        <h3 className="text-base md:text-lg font-bold mb-1.5">{project.name}</h3>
        {project.result && (
          <p className="text-[13px] md:text-sm text-terminal font-semibold leading-snug mb-2">
            {project.result}
          </p>
        )}
        <p className="text-xs md:text-sm text-muted leading-relaxed mb-3 flex-1">
          {project.description}
        </p>

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

        <div className="flex flex-wrap gap-2">
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
      </div>
    </article>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article className="bg-gradient-to-br from-card-bg via-card-bg to-dim-bg border border-border hover:border-terminal/30 rounded-xl p-6 md:p-7 flex flex-col h-full transition-all duration-300 relative overflow-hidden">
      {/* Big background quote glyph */}
      <Quote
        size={120}
        className="absolute -top-4 -right-4 text-terminal/[0.06] rotate-180"
        aria-hidden="true"
      />

      <Quote size={24} className="text-terminal mb-4 relative z-10" aria-hidden="true" />
      <p className="text-base md:text-[17px] leading-relaxed text-white/90 mb-6 flex-1 relative z-10 font-medium">
        &ldquo;{t.quote}&rdquo;
      </p>

      <div className="flex items-center gap-3 pt-5 border-t border-border relative z-10">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-dim-bg ring-2 ring-terminal/20">
          <Image
            src={t.photo}
            alt={`${t.name} at ${t.client}`}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div className="leading-tight flex-1">
          <div className="text-sm font-semibold">{t.name}</div>
          <div className="text-xs text-muted mt-0.5">{t.role}</div>
        </div>
      </div>

      <a
        href={t.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${t.client}`}
        className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between gap-2 group/visit relative z-10"
      >
        <ClientMiniLogo clientKey={t.clientKey} />
        <span className="inline-flex items-center gap-1 text-xs font-bold text-terminal group-hover/visit:gap-2 transition-all">
          Visit live site
          <ExternalLink size={12} />
        </span>
      </a>
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
        <h2 className="reveal-item font-display text-[clamp(2rem,5vw,3.5rem)] font-normal italic leading-[1.05] tracking-tight mb-3">
          Built by <span className="text-terminal">{PORTFOLIO.headingAccent}</span>
        </h2>
        <p className="reveal-item text-sm md:text-base text-muted leading-relaxed mb-10 md:mb-14 max-w-2xl">
          Real systems. Real businesses. Real voices.
        </p>

        <div className="space-y-6 md:space-y-8">
          {PORTFOLIO.projects.map((project) => {
            const testimonial = findTestimonial(project.name);
            return (
              <div
                key={project.name}
                className={`reveal-item grid gap-5 md:gap-6 ${
                  testimonial ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
                }`}
              >
                <ProjectCard project={project} />
                {testimonial && <TestimonialCard t={testimonial} />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
