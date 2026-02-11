"use client";

import { MessageCircle, Github, Instagram, Mail, type LucideIcon } from "lucide-react";
import { FOOTER } from "@/lib/constants";

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  WhatsApp: MessageCircle,
  GitHub: Github,
  Instagram: Instagram,
  Email: Mail,
};

export function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    e.preventDefault();
    const id = label.toLowerCase();
    const target = document.querySelector(`#${id}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-border bg-dim-bg" aria-label="Footer">
      <div className="container-width px-5 md:px-8 py-10">
        {/* Desktop: 3-column grid / Mobile: stacked */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Logo + tagline */}
          <div>
            <div className="text-sm font-bold mb-1.5">
              <span className="text-terminal">{"{"}</span>
              alqode
              <span className="text-terminal">{"}"}</span>
            </div>
            <p className="text-xs text-muted">{FOOTER.tagline}</p>
          </div>

          {/* Center: Navigate */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-muted font-semibold tracking-wider uppercase mb-1">
              Navigate
            </span>
            {FOOTER.navigate.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={(e) => handleNavClick(e, link)}
                className="text-xs text-white hover:text-terminal transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right: Connect with brand icons */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-muted font-semibold tracking-wider uppercase mb-1">
              Connect
            </span>
            {FOOTER.connect.map((link) => {
              const Icon = SOCIAL_ICONS[link.label];
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="inline-flex items-center gap-2 text-xs text-white hover:text-terminal transition-colors"
                >
                  {Icon && <Icon size={13} className="opacity-70" />}
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>

        {/* Bottom divider + copyright */}
        <div className="mt-8 pt-5 border-t border-border text-center text-[10px] text-muted">
          {FOOTER.copyright}
        </div>
      </div>
    </footer>
  );
}
