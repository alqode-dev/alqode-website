"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import { useScrollReveal } from "@/lib/animations";
import { CLIENTS } from "@/lib/constants";
import { CLIENT_LOGO_MAP } from "@/components/client-logos-svg";

export function ClientLogos() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="py-14 md:py-20"
      aria-label="Clients"
    >
      <div className="container-width px-5 md:px-8">
        <p className="reveal-item text-center text-[10px] md:text-xs uppercase tracking-[2.5px] text-muted mb-8 md:mb-12">
          {CLIENTS.label}
        </p>
        <div className="reveal-item flex flex-wrap items-center justify-center gap-x-12 md:gap-x-20 lg:gap-x-24 gap-y-10">
          {CLIENTS.logos.map((client) => {
            const Logo = CLIENT_LOGO_MAP[client.key];
            return (
              <a
                key={client.key}
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${client.name}`}
                className="client-logo-link text-white/55 hover:scale-105"
                style={{ "--brand-color": client.brandColor } as CSSProperties}
              >
                <Logo />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
