"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { HERO, SITE } from "@/lib/constants";
import { useDecryptOnHover } from "@/lib/decrypt";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [tagText, setTagText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [headlineReady, setHeadlineReady] = useState(false);
  const [wordsRevealed, setWordsRevealed] = useState(0);
  const [sublineReady, setSublineReady] = useState(false);
  const [ctaReady, setCtaReady] = useState(false);
  const [entryDone, setEntryDone] = useState(false);

  // Dot-grid glow: mouse tracking (desktop only)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  // All headline words for staggered reveal
  const line1Words = HERO.headline.split(" ");
  const line2Words = HERO.headlineAccent.split(" ");
  const totalWords = line1Words.length + line2Words.length;

  // Decrypt hook: applied to h1, subline, founder tag (NOT CTAs)
  useDecryptOnHover(sectionRef, "[data-decrypt]", { enabled: entryDone });

  // Desktop detection for dot-grid glow
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    setIsDesktop(mql.matches && !isTouch);

    const handleChange = () => {
      const touchNow = window.matchMedia("(pointer: coarse)").matches;
      setIsDesktop(mql.matches && !touchNow);
    };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  // Mouse tracking for dot-grid glow
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!isDesktop) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [isDesktop]
  );

  // Typewriter effect for {alqode} tag
  useEffect(() => {
    const fullText = HERO.tag;
    let i = 0;

    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTagText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setTimeout(() => setShowCursor(false), 500);
        setTimeout(() => setHeadlineReady(true), 300);
      }
    }, 80);

    return () => clearInterval(timer);
  }, []);

  // Word-by-word headline stagger (0.05s per word per spec)
  useEffect(() => {
    if (!headlineReady) return;

    let wordIndex = 0;
    const timer = setInterval(() => {
      if (wordIndex < totalWords) {
        wordIndex++;
        setWordsRevealed(wordIndex);
      } else {
        clearInterval(timer);
        // Subline fades 0.3s after headline
        setTimeout(() => setSublineReady(true), 300);
      }
    }, 50); // 0.05s per word

    return () => clearInterval(timer);
  }, [headlineReady, totalWords]);

  // CTAs fade 0.2s after subline
  useEffect(() => {
    if (!sublineReady) return;
    const t = setTimeout(() => setCtaReady(true), 200);
    return () => clearTimeout(t);
  }, [sublineReady]);

  // Entry done: 700ms after CTA appears, enable decrypt
  useEffect(() => {
    if (!ctaReady) return;
    const t = setTimeout(() => setEntryDone(true), 700);
    return () => clearTimeout(t);
  }, [ctaReady]);

  const handleScrollToWork = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center dot-grid"
      aria-label="Hero"
      onMouseMove={handleMouseMove}
    >
      {/* Green glow */}
      <div className="glow-terminal absolute inset-0 pointer-events-none" />

      {/* Interactive dot-grid glow (desktop only) */}
      {isDesktop && (
        <div
          className="dot-grid-glow absolute inset-0"
          style={{
            WebkitMaskPosition: `${mousePos.x - 150}px ${mousePos.y - 150}px`,
            maskPosition: `${mousePos.x - 150}px ${mousePos.y - 150}px`,
          }}
        />
      )}

      <div className="container-width px-5 md:px-8 lg:px-12 pt-24 pb-16 relative z-10">
        {/* {alqode} tag with typewriter */}
        <div className="mb-3 min-h-[20px]">
          <span className="text-terminal text-xs font-semibold tracking-[2px] uppercase">
            {tagText}
            {showCursor && (
              <span className="inline-block w-[1px] h-3.5 bg-terminal ml-0.5 align-middle animate-cursor-blink" />
            )}
          </span>
        </div>

        {/* Headline - word by word stagger */}
        <h1
          data-decrypt
          className="text-[clamp(1.75rem,5vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight mb-4 max-w-2xl"
        >
          {/* Line 1: "We don't build websites." */}
          {line1Words.map((word, i) => (
            <span
              key={`l1-${i}`}
              className="inline-block mr-[0.25em] transition-all duration-500 ease-out"
              style={{
                opacity: i < wordsRevealed ? 1 : 0,
                transform: i < wordsRevealed ? "translateY(0)" : "translateY(12px)",
              }}
            >
              {word}
            </span>
          ))}
          <br />
          {/* Line 2: "We build machines that make you money." in green */}
          {line2Words.map((word, i) => {
            const globalIndex = line1Words.length + i;
            return (
              <span
                key={`l2-${i}`}
                className="inline-block mr-[0.25em] text-terminal transition-all duration-500 ease-out"
                style={{
                  opacity: globalIndex < wordsRevealed ? 1 : 0,
                  transform: globalIndex < wordsRevealed ? "translateY(0)" : "translateY(12px)",
                }}
              >
                {word}
              </span>
            );
          })}
        </h1>

        {/* Subline */}
        <p
          data-decrypt
          className={`text-sm md:text-base text-muted leading-relaxed mb-7 max-w-md transition-all duration-700 ${
            sublineReady
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          {HERO.subline}
        </p>

        {/* CTAs - no data-decrypt, excluded from scramble */}
        <div
          className={`flex flex-wrap gap-3 transition-all duration-700 ${
            ctaReady
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-terminal text-void px-6 py-3 rounded-lg text-sm font-bold hover:bg-terminal/90 transition-colors"
          >
            {HERO.primaryCta}
            <ArrowRight size={16} />
          </a>
          <a
            href="#work"
            onClick={handleScrollToWork}
            className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-medium border border-border text-white hover:border-muted transition-colors"
          >
            {HERO.secondaryCta}
          </a>
        </div>

        {/* Founder tag */}
        <p
          data-decrypt
          className={`text-xs text-muted mt-8 tracking-wide transition-all duration-700 delay-300 ${
            ctaReady ? "opacity-100" : "opacity-0"
          }`}
        >
          {HERO.founderTag}
        </p>
      </div>
    </section>
  );
}
