"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { waUrl } from "@/lib/constants";

/**
 * Floating WhatsApp button — mobile only, sticky bottom-right.
 * Appears after 200px scroll. 90% of traffic is mobile;
 * this is the always-visible conversion path.
 */
export function WhatsappFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      href={waUrl("mobile_fab")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message us on WhatsApp"
      className={`lg:hidden fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-terminal text-void shadow-[0_8px_24px_-4px_rgba(16,185,129,0.5)] transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <MessageCircle size={26} strokeWidth={2.5} />
      <span className="absolute inset-0 rounded-full bg-terminal animate-ping opacity-30" />
    </a>
  );
}
