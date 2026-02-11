"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { MessageCircle, MapPin, Mail } from "lucide-react";
import { useScrollReveal } from "@/lib/animations";
import { CONTACT, SITE } from "@/lib/constants";

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [project, setProject] = useState("");
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

  // Signature typing animation
  useEffect(() => {
    if (isInteracted) return;

    const cycles = CONTACT.typingCycles;
    let cycleIndex = 0;
    const ctrl = animationRef.current;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    function sleep(ms: number): Promise<void> {
      return new Promise((resolve, reject) => {
        if (ctrl.cancelled) { reject(); return; }
        const id = setTimeout(() => {
          if (ctrl.cancelled) { reject(); return; }
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
        // Animation was cancelled - expected during cleanup
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
    // mailto fallback for v1
    const subject = encodeURIComponent(`Project inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nProject: ${project}`);
    window.open(`mailto:${SITE.email}?subject=${subject}&body=${body}`);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-padding"
      aria-label="Contact"
    >
      <div className="container-width max-w-xl">
        <h2 className="reveal-item text-[clamp(1.375rem,3vw,2rem)] font-bold mb-1">
          {CONTACT.heading}
        </h2>
        <p className="reveal-item text-sm text-muted mb-8">
          {CONTACT.subline}
        </p>

        {/* WhatsApp CTA */}
        <a
          href={SITE.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="reveal-item flex items-center justify-center gap-2 w-full bg-terminal text-void py-3.5 rounded-xl text-[15px] font-bold hover:bg-terminal/90 transition-colors mb-6"
        >
          <MessageCircle size={18} />
          {CONTACT.whatsappCta}
        </a>

        <p className="reveal-item text-center text-xs text-muted mb-6">
          {CONTACT.separator}
        </p>

        {/* Contact form */}
        <form onSubmit={handleSubmit} className="reveal-item space-y-3">
          {/* Name */}
          <div>
            <label htmlFor="contact-name" className="text-xs text-muted font-semibold block mb-1">
              {CONTACT.formFields.name}
            </label>
            <div className="relative">
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!isInteracted) stopAnimation();
                }}
                onFocus={() => {
                  if (!isInteracted) stopAnimation();
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card-bg text-white text-sm outline-none focus:border-terminal/50 transition-colors"
              />
              {!isInteracted && !name && (
                <div className="absolute inset-0 px-3.5 py-2.5 pointer-events-none flex items-center">
                  <span className="text-sm text-terminal/70 italic">
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
            <label htmlFor="contact-email" className="text-xs text-muted font-semibold block mb-1">
              {CONTACT.formFields.email}
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => {
                if (!isInteracted) stopAnimation();
              }}
              placeholder="your@email.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card-bg text-white text-sm outline-none focus:border-terminal/50 transition-colors placeholder:text-muted"
            />
          </div>

          {/* Project */}
          <div>
            <label htmlFor="contact-project" className="text-xs text-muted font-semibold block mb-1">
              {CONTACT.formFields.project}
            </label>
            <div className="relative">
              <textarea
                id="contact-project"
                value={project}
                onChange={(e) => {
                  setProject(e.target.value);
                  if (!isInteracted) stopAnimation();
                }}
                onFocus={() => {
                  if (!isInteracted) stopAnimation();
                }}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card-bg text-white text-sm outline-none focus:border-terminal/50 transition-colors resize-none"
              />
              {!isInteracted && !project && (
                <div className="absolute inset-0 px-3.5 py-2.5 pointer-events-none">
                  <span className="text-sm text-terminal/70 italic">
                    {animatedProject}
                    {activeField === "project" && (
                      <span className="inline-block w-[1px] h-4 bg-terminal ml-0.5 align-middle animate-cursor-blink" />
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg border border-border text-white text-sm font-semibold hover:bg-white/5 transition-colors"
          >
            {CONTACT.formFields.submit}
          </button>
        </form>

        {/* Details */}
        <div className="reveal-item mt-6 flex flex-col gap-1.5 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} />
            {CONTACT.details.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Mail size={12} />
            {CONTACT.details.email}
          </span>
        </div>
      </div>
    </section>
  );
}
