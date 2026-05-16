"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/lib/animations";
import { PORTFOLIO } from "@/lib/constants";
import { TECH_ICON_MAP, TECH_COLORS } from "@/components/tech-icons";

function ProjectCard({ project }: { project: (typeof PORTFOLIO.projects)[number] }) {
  const initial = project.image ?? project.fallbackImage ?? null;
  const [imgSrc, setImgSrc] = useState<string | null>(initial);
  const [imgError, setImgError] = useState(!initial);

  return (
    <article className="reveal-item bg-card-bg rounded-xl overflow-hidden border border-border hover:border-terminal/30 transition-all duration-300 group">
      {/* Screenshot or branded placeholder */}
      <div className="relative h-[160px] md:h-[180px] bg-dim-bg overflow-hidden">
        {!imgError && imgSrc ? (
          <Image
            src={imgSrc}
            alt={`${project.name} screenshot`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw"
            onError={() => {
              if (project.fallbackImage && imgSrc !== project.fallbackImage) {
                setImgSrc(project.fallbackImage);
              } else {
                setImgError(true);
              }
            }}
          />
        ) : (
          // Branded placeholder when no screenshot available
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

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-bold mb-1.5">{project.name}</h3>
        {project.result && (
          <p className="text-[13px] text-terminal font-semibold leading-snug mb-2">
            {project.result}
          </p>
        )}
        <p className="text-xs text-muted leading-relaxed mb-3">
          {project.description}
        </p>

        {/* Category tags (green) */}
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

        {/* Tech pills with brand logos */}
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => {
            const IconComponent = TECH_ICON_MAP[t];
            return (
              <span
                key={t}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded border border-border text-muted font-medium"
              >
                {IconComponent && (
                  <IconComponent size={12} style={{ color: TECH_COLORS[t] || undefined }} className={TECH_COLORS[t] ? "" : "text-muted opacity-70"} />
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

export function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="section-padding"
      aria-label="Portfolio"
    >
      <div className="container-width">
        <h2 className="reveal-item font-display text-[clamp(2rem,5vw,3.5rem)] font-normal italic leading-[1.05] tracking-tight mb-3">
          {PORTFOLIO.heading}{" "}
          <span className="text-terminal">{PORTFOLIO.headingAccent}</span>
        </h2>
        <p className="reveal-item text-sm md:text-base text-muted leading-relaxed mb-10 md:mb-12">
          {PORTFOLIO.subline}
        </p>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {PORTFOLIO.projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
