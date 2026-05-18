"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { HERO, waUrl } from "@/lib/constants";
import { Bracketed } from "@/components/primitives/bracketed";
import { LiveStatus } from "@/components/primitives/live-status";

// Boot animation timing constants
const COMMAND_CHAR_MS = 60;
const POST_COMMAND_DELAY = 280;
const BETWEEN_LINES_MS = 180;
const POST_BOOT_DELAY = 420;
const WORD_STAGGER_MS = 60;
const POST_HEADLINE_DELAY = 250;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const [commandText, setCommandText] = useState("");
  const [linesShown, setLinesShown] = useState(0);
  const [headlineReady, setHeadlineReady] = useState(false);
  const [wordsRevealed, setWordsRevealed] = useState(0);
  const [sublineReady, setSublineReady] = useState(false);
  const [ctaReady, setCtaReady] = useState(false);

  // Desktop detection for ambient glow
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  const line1Words = HERO.headline.split(" ");
  const line2Words = HERO.headlineAccent.split(" ");
  const totalWords = line1Words.length + line2Words.length;

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

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!isDesktop) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    [isDesktop]
  );

  // 1. Type out the boot command
  useEffect(() => {
    const text = HERO.boot.command;
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setCommandText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, COMMAND_CHAR_MS);
    return () => clearInterval(timer);
  }, []);

  // 2. After command completes, stream the boot lines one by one
  useEffect(() => {
    if (commandText !== HERO.boot.command) return;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    HERO.boot.lines.forEach((_, i) => {
      timeouts.push(
        setTimeout(
          () => setLinesShown(i + 1),
          POST_COMMAND_DELAY + i * BETWEEN_LINES_MS
        )
      );
    });
    const finalDelay =
      POST_COMMAND_DELAY +
      HERO.boot.lines.length * BETWEEN_LINES_MS +
      POST_BOOT_DELAY;
    timeouts.push(setTimeout(() => setHeadlineReady(true), finalDelay));
    return () => timeouts.forEach(clearTimeout);
  }, [commandText]);

  // 3. Word-by-word headline stagger
  useEffect(() => {
    if (!headlineReady) return;
    let wordIndex = 0;
    const timer = setInterval(() => {
      if (wordIndex < totalWords) {
        wordIndex++;
        setWordsRevealed(wordIndex);
      } else {
        clearInterval(timer);
        setTimeout(() => setSublineReady(true), POST_HEADLINE_DELAY);
      }
    }, WORD_STAGGER_MS);
    return () => clearInterval(timer);
  }, [headlineReady, totalWords]);

  useEffect(() => {
    if (!sublineReady) return;
    const t = setTimeout(() => setCtaReady(true), 180);
    return () => clearTimeout(t);
  }, [sublineReady]);

  const handleScrollToWork = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
  };

  const commandDone = commandText === HERO.boot.command;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[88vh] md:min-h-screen flex items-center dot-grid"
      aria-label="Hero"
      onMouseMove={handleMouseMove}
    >
      <div className="glow-terminal absolute inset-0 pointer-events-none" />

      {isDesktop && (
        <div
          className="dot-grid-glow absolute inset-0"
          style={{
            WebkitMaskPosition: `${mousePos.x - 150}px ${mousePos.y - 150}px`,
            maskPosition: `${mousePos.x - 150}px ${mousePos.y - 150}px`,
          }}
        />
      )}

      <div className="container-width px-5 md:px-8 lg:px-12 pt-28 md:pt-32 pb-20 relative z-10 w-full">
        {/* Boot sequence — terminal-style streamed output */}
        <div className="font-mono text-[11px] md:text-[13px] space-y-1 mb-10 md:mb-14 leading-relaxed">
          {/* Command line */}
          <div className="text-white/90">
            <span className="text-terminal mr-1">▸</span>
            {commandText.replace("> ", "")}
            {!commandDone && (
              <span className="inline-block w-[6px] h-[14px] bg-terminal ml-0.5 align-middle animate-cursor-blink" />
            )}
          </div>
          {/* Boot lines stream in */}
          {HERO.boot.lines.map((line, i) => (
            <div
              key={i}
              className="text-terminal/80 transition-all duration-300 ease-snap"
              style={{
                opacity: i < linesShown ? 1 : 0,
                transform: i < linesShown ? "translateX(0)" : "translateX(-6px)",
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Headline — italic serif, line 2 bracketed */}
        <h1 className="font-display text-[clamp(2.25rem,7.5vw,5.5rem)] italic font-normal leading-[0.98] tracking-tight mb-6 md:mb-8 max-w-5xl">
          <span className="block">
            {line1Words.map((word, i) => (
              <span
                key={`l1-${i}`}
                className="inline-block mr-[0.22em] transition-all duration-400 ease-snap"
                style={{
                  opacity: i < wordsRevealed ? 1 : 0,
                  transform: i < wordsRevealed ? "translateY(0)" : "translateY(14px)",
                }}
              >
                {word}
              </span>
            ))}
          </span>
          <span className="block text-terminal mt-1 md:mt-2">
            <span
              className="font-mono text-[0.5em] text-terminal/70 align-middle mr-3 inline-block transition-opacity duration-400"
              style={{ opacity: wordsRevealed > line1Words.length ? 1 : 0 }}
            >
              {"{"}
            </span>
            {line2Words.map((word, i) => {
              const globalIndex = line1Words.length + i;
              return (
                <span
                  key={`l2-${i}`}
                  className="inline-block mr-[0.22em] transition-all duration-400 ease-snap"
                  style={{
                    opacity: globalIndex < wordsRevealed ? 1 : 0,
                    transform: globalIndex < wordsRevealed ? "translateY(0)" : "translateY(14px)",
                  }}
                >
                  {word}
                </span>
              );
            })}
            <span
              className="font-mono text-[0.5em] text-terminal/70 align-middle ml-1 inline-block transition-opacity duration-400"
              style={{ opacity: wordsRevealed >= totalWords ? 1 : 0 }}
            >
              {"}"}
            </span>
          </span>
        </h1>

        {/* Subline */}
        <p
          className={`text-sm md:text-base text-muted leading-relaxed mb-8 max-w-xl transition-all duration-700 ease-snap ${
            sublineReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          {HERO.subline}
        </p>

        {/* CTAs */}
        <div
          className={`flex flex-wrap gap-3 transition-all duration-600 ease-snap ${
            ctaReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <a
            href={waUrl("hero_primary")}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 bg-terminal text-void px-6 py-3 rounded-lg text-sm font-bold hover:bg-terminal/90 hover:gap-3 transition-all duration-200 ease-snap"
          >
            {HERO.primaryCta}
            <ArrowRight size={16} className="transition-transform duration-200 ease-snap group-hover:translate-x-0.5" />
          </a>
          <a
            href="#work"
            onClick={handleScrollToWork}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium border border-border text-white hover:border-terminal/50 hover:bg-white/[0.02] transition-all duration-200 ease-snap"
          >
            {HERO.secondaryCta}
            <ArrowDown size={14} className="transition-transform duration-200 ease-snap group-hover:translate-y-0.5" />
          </a>
        </div>

        {/* Mockup live offer */}
        <div
          className={`mt-7 transition-all duration-700 ease-snap delay-100 ${
            ctaReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <a
            href={HERO.mockupOffer.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 group"
          >
            <LiveStatus variant="live" size="sm" pulse>
              {HERO.mockupOffer.label}
            </LiveStatus>
            <span className="text-terminal text-xs md:text-sm font-bold font-mono group-hover:translate-x-0.5 transition-transform duration-200 ease-snap">
              {HERO.mockupOffer.cta} →
            </span>
          </a>
        </div>

        {/* Metadata footer */}
        <div
          className={`mt-12 md:mt-16 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] md:text-[11px] tracking-[1px] uppercase text-muted transition-all duration-700 ease-snap delay-200 ${
            ctaReady ? "opacity-100" : "opacity-0"
          }`}
        >
          {HERO.metadata.map((item, i) => (
            <Bracketed key={i} tight>
              <span className="text-muted">{item}</span>
            </Bracketed>
          ))}
          <span className="text-terminal/40">·</span>
          <span className="text-muted">Founded by Mohammed Hamdaan Dhaler</span>
        </div>
      </div>
    </section>
  );
}
