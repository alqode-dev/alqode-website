"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { MessageCircle, MapPin, Mail, Plus, Minus, Send } from "lucide-react";
import { useScrollReveal } from "@/lib/animations";
import { CONTACT, FAQ, SITE, waUrl } from "@/lib/constants";
import { Bracketed } from "@/components/primitives/bracketed";
import { MonoTag } from "@/components/primitives/mono-tag";

export function Talk() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  // FAQ accordion state
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Contact form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [project, setProject] = useState("");

  // Typing animation state
  const [animatedName, setAnimatedName] = useState("");
  const [animatedProject, setAnimatedProject] = useState("");
  const [isInteracted, setIsInteracted] = useState(false);
  const [activeField, setActiveField] = useState<"name" | "project" | null>(null);
  const animationRef = useRef<{ cancelled: boolean }>({ cancelled: false });

  const stopAnimation = useCallback(() => {
    setIsInteracted(true);
    animationRef.current.cancelled = true;
    setAnimatedName("");
    setAnimatedProject("");
    setActiveField(null);
  }, []);

  useEffect(() => {
    if (isInteracted) return;

    const cycles = CONTACT.typingCycles;
    let cycleIndex = 0;
    const ctrl = animationRef.current;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    function sleep(ms: number): Promise<void> {
      return new Promise((resolve, reject) => {
        if (ctrl.cancelled) {
          reject();
          return;
        }
        const id = setTimeout(() => {
          if (ctrl.cancelled) {
            reject();
            return;
          }
          resolve();
        }, ms);
        timeouts.push(id);
      });
    }

    async function typeText(
      setter: (val: string) => void,
      text: string,
      speed: number,
      field: "name" | "project"
    ) {
      setActiveField(field);
      for (let i = 0; i <= text.length; i++) {
        if (ctrl.cancelled) return;
        setter(text.slice(0, i));
        await sleep(speed);
      }
    }

    async function deleteText(
      setter: (val: string) => void,
      text: string,
      speed: number,
      field: "name" | "project"
    ) {
      setActiveField(field);
      for (let i = text.length; i >= 0; i--) {
        if (ctrl.cancelled) return;
        setter(text.slice(0, i));
        await sleep(speed);
      }
    }

    async function runCycles() {
      try {
        while (!ctrl.cancelled) {
          const cycle = cycles[cycleIndex % cycles.length];
          await typeText(setAnimatedName, cycle.name, 80, "name");
          if (ctrl.cancelled) return;
          await sleep(300);
          await typeText(setAnimatedProject, cycle.project, 80, "project");
          if (ctrl.cancelled) return;
          setActiveField(null);
          await sleep(2000);
          await deleteText(setAnimatedProject, cycle.project, 40, "project");
          if (ctrl.cancelled) return;
          await deleteText(setAnimatedName, cycle.name, 40, "name");
          if (ctrl.cancelled) return;
          await sleep(500);
          cycleIndex++;
        }
      } catch {
        // cancelled
      }
    }

    runCycles();

    return () => {
      ctrl.cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [isInteracted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Project inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nProject: ${project}`);
    window.open(`mailto:${SITE.email}?subject=${subject}&body=${body}`);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-padding"
      aria-label="Talk to us"
    >
      <div className="container-width">
        {/* Header */}
        <p className="reveal-item text-terminal text-xs md:text-sm font-mono font-semibold tracking-[1px] mb-3 md:mb-4">
          &gt; talk.to_us
        </p>
        <h2 className="reveal-item font-display text-[clamp(2.25rem,6vw,4.5rem)] italic font-normal leading-[1.0] tracking-tight mb-4">
          Let&apos;s talk.
        </h2>
        <p className="reveal-item text-sm md:text-base text-muted leading-relaxed mb-12 md:mb-16 max-w-2xl">
          One message away from a system that changes how your business runs. Drop the questions, drop the project, drop the doubt.
        </p>

        {/* Two-column layout: FAQ left, Form right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12">
          {/* ── LEFT: FAQ ───────────────────────────── */}
          <div className="lg:col-span-5">
            <div className="reveal-item mb-5 md:mb-6 flex items-center gap-3">
              <MonoTag variant="terminal">▸ common questions</MonoTag>
              <div className="flex-1 h-px bg-gradient-to-r from-terminal/40 to-transparent" />
            </div>

            <div className="reveal-item divide-y divide-border/60 border-y border-border/60">
              {FAQ.items.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                  <div key={item.q}>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="w-full py-4 md:py-5 flex items-start justify-between gap-3 text-left group"
                    >
                      <span
                        className={`text-[14px] md:text-[15px] font-semibold transition-colors ${
                          isOpen ? "text-white" : "text-white/85 group-hover:text-white"
                        }`}
                      >
                        {item.q}
                      </span>
                      <span className="flex-shrink-0 mt-1 text-terminal transition-transform">
                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      </span>
                    </button>
                    <div
                      className="overflow-hidden transition-all duration-300 ease-snap"
                      style={{
                        maxHeight: isOpen ? "500px" : "0px",
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <p className="text-[13px] md:text-sm text-muted leading-relaxed pb-5 pr-6">
                        {item.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: Form + CTA ──────────────────── */}
          <div className="lg:col-span-7">
            {/* WhatsApp primary */}
            <div className="reveal-item mb-6 md:mb-8">
              <MonoTag variant="terminal" className="mb-3 inline-block">
                ▸ fastest path
              </MonoTag>
              <a
                href={waUrl("talk_whatsapp")}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 w-full bg-terminal text-void py-4 px-5 rounded-xl text-[15px] font-bold hover:gap-4 transition-all duration-200 ease-snap"
              >
                <span className="inline-flex items-center gap-2">
                  <MessageCircle size={18} />
                  {CONTACT.whatsappCta}
                </span>
                <span className="font-mono text-xs">→</span>
              </a>
            </div>

            {/* Form */}
            <div className="reveal-item">
              <MonoTag variant="terminal" className="mb-3 inline-block">
                ▸ or send a message
              </MonoTag>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="talk-name" className="block mb-1.5">
                    <MonoTag variant="muted">
                      <Bracketed tight>name</Bracketed>
                    </MonoTag>
                  </label>
                  <div className="relative">
                    <input
                      id="talk-name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (!isInteracted) stopAnimation();
                      }}
                      onFocus={() => {
                        if (!isInteracted) stopAnimation();
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card-bg text-white text-sm font-mono outline-none focus:border-terminal/60 focus:bg-card-bg/80 transition-all duration-200 ease-snap"
                    />
                    {!isInteracted && !name && (
                      <div className="absolute inset-0 px-4 py-3 pointer-events-none flex items-center">
                        <span className="text-sm font-mono text-terminal/60">
                          {animatedName}
                          {activeField === "name" && (
                            <span className="inline-block w-[1px] h-4 bg-terminal ml-0.5 align-middle animate-cursor-blink" />
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="talk-email" className="block mb-1.5">
                    <MonoTag variant="muted">
                      <Bracketed tight>email</Bracketed>
                    </MonoTag>
                  </label>
                  <input
                    id="talk-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => {
                      if (!isInteracted) stopAnimation();
                    }}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card-bg text-white text-sm font-mono outline-none focus:border-terminal/60 transition-all duration-200 ease-snap placeholder:text-muted/60"
                  />
                </div>

                {/* Project */}
                <div>
                  <label htmlFor="talk-project" className="block mb-1.5">
                    <MonoTag variant="muted">
                      <Bracketed tight>project</Bracketed>
                    </MonoTag>
                  </label>
                  <div className="relative">
                    <textarea
                      id="talk-project"
                      value={project}
                      onChange={(e) => {
                        setProject(e.target.value);
                        if (!isInteracted) stopAnimation();
                      }}
                      onFocus={() => {
                        if (!isInteracted) stopAnimation();
                      }}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card-bg text-white text-sm font-mono outline-none focus:border-terminal/60 transition-all duration-200 ease-snap resize-none"
                    />
                    {!isInteracted && !project && (
                      <div className="absolute inset-0 px-4 py-3 pointer-events-none">
                        <span className="text-sm font-mono text-terminal/60">
                          {animatedProject}
                          {activeField === "project" && (
                            <span className="inline-block w-[1px] h-4 bg-terminal ml-0.5 align-middle animate-cursor-blink" />
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="group w-full py-3.5 rounded-lg border border-terminal/40 text-terminal bg-terminal/[0.04] hover:bg-terminal/10 hover:border-terminal/60 transition-all duration-200 ease-snap text-sm font-mono font-bold tracking-wide inline-flex items-center justify-center gap-2"
                >
                  ▸ deploy message
                  <Send size={14} className="group-hover:translate-x-0.5 transition-transform duration-200 ease-snap" />
                </button>
              </form>
            </div>

            {/* Footer details */}
            <div className="reveal-item mt-8 pt-6 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-terminal/60" />
                <MonoTag variant="muted">{CONTACT.details.location}</MonoTag>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-terminal/60" />
                <a
                  href={`mailto:${CONTACT.details.email}`}
                  className="font-mono text-[11px] text-muted hover:text-terminal transition-colors"
                >
                  {CONTACT.details.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
