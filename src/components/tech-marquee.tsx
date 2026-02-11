"use client";

import { TECH_ICON_MAP, TECH_COLORS } from "@/components/tech-icons";

const TECHS = [
  "Next.js",
  "React",
  "TypeScript",
  "Python",
  "Tailwind",
  "Supabase",
  "n8n",
  "Airtable",
  "Vercel",
  "Node.js",
  "Meta",
  "GitHub",
  "JSON",
  "GSAP",
];

export function TechMarquee() {
  return (
    <div
      className="py-6 border-y border-border/30 overflow-hidden"
      aria-label="Technologies we use"
    >
      <div className="marquee-track hover:[animation-play-state:paused]">
        {/* Render twice for seamless loop */}
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee-content" aria-hidden={copy === 1}>
            {TECHS.map((tech) => {
              const Icon = TECH_ICON_MAP[tech];
              const color = TECH_COLORS[tech];
              return (
                <span
                  key={tech}
                  className="inline-flex items-center gap-2 mx-6 text-sm text-muted whitespace-nowrap"
                >
                  {Icon && (
                    <Icon
                      size={16}
                      style={{ color: color || undefined }}
                      className={color ? "" : "text-muted opacity-70"}
                    />
                  )}
                  {tech}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
