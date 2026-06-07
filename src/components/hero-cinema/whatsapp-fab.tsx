"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "../tech-icons";
import { waUrl } from "@/lib/constants";
import { prefersReducedMotion } from "./machine";

/**
 * Floating WhatsApp button — the v4 conversion safety net.
 *
 * v4 is headerless by design, so this is the only persistent way to reach us.
 * Styled to the machine (dark chrome pill, accent ring), NOT the v3 terminal
 * circle. On mobile it's a compact disc; on desktop the reply-time label sits
 * beside it. The pip is an HONEST cue — a soft live pulse plus "usually replies
 * in minutes", never a fake "online now" light. Appears once past the first
 * screen so it doesn't fight the hero.
 */
export function WhatsappFab() {
  const [visible, setVisible] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(prefersReducedMotion());
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={waUrl("v4_fab", "Hi alqode, I'd like to talk about a project.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message us on WhatsApp. We usually reply in minutes."
      className={`group fixed bottom-5 right-5 z-[60] flex items-center gap-3 rounded-full border border-white/[0.12] bg-[#0c0f13]/90 py-2.5 pl-2.5 pr-2.5 backdrop-blur-md transition-all duration-500 ease-snap hover:border-v4-accent/45 md:bottom-6 md:right-6 md:pr-5 ${
        visible
          ? "translate-y-0 opacity-100 shadow-[0_14px_44px_-14px_rgba(0,0,0,0.9)]"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#25D366]/[0.12] ring-1 ring-[#25D366]/30 transition-transform duration-500 ease-snap group-hover:scale-105">
        <WhatsAppIcon size={22} style={{ color: "#25D366" }} />
        {/* honest live pip */}
        <span className="absolute -right-0.5 -top-0.5 grid h-3 w-3 place-items-center rounded-full border-2 border-[#0c0f13] bg-v4-accent">
          {!reduce && (
            <span className="absolute inset-0 rounded-full bg-v4-accent opacity-60 [animation:ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite]" />
          )}
        </span>
      </span>

      {/* label — desktop only, hidden on phones to keep the disc compact */}
      <span className="hidden flex-col pr-1 leading-tight md:flex">
        <span className="text-[13px] font-semibold text-v4-ink">{"Let's talk"}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-v4-muted">
          Usually replies in minutes
        </span>
      </span>
    </a>
  );
}
