"use client";

import { useEffect, useRef, useState } from "react";
import { waUrl } from "@/lib/constants";

/**
 * v4 "Molten Cast" hero — scroll-locked canvas playback of the Higgsfield
 * chrome→{alqode} morph. Scrolling scrubs the video frame-by-frame; cinematic
 * overlay copy reveals on top via IntersectionObserver.
 *
 * Frames live in /public/frames (desktop, 145) and /public/frames-mobile (mobile, 109).
 * The video IS the texture — no dot-grid, no scanline, no Instrument Serif.
 */

const DESKTOP_COUNT = 145;
const MOBILE_COUNT = 109;

export function MoltenCast() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const framePath = isMobile ? "/frames-mobile" : "/frames";
    const frameCount = isMobile ? MOBILE_COUNT : DESKTOP_COUNT;

    const frames: HTMLImageElement[] = new Array(frameCount + 1);
    let current = -1;
    let raf = 0;

    const src = (i: number) =>
      `${framePath}/frame_${String(i).padStart(4, "0")}.webp`;

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const img = frames[current >= 0 ? current : 1];
      if (img && img.complete && img.naturalWidth) draw(img);
    }

    function draw(img: HTMLImageElement) {
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let dw: number, dh: number, dx: number, dy: number;
      if (ir > cr) {
        dh = ch;
        dw = ch * ir;
        dx = (cw - dw) / 2;
        dy = 0;
      } else {
        dw = cw;
        dh = cw / ir;
        dx = 0;
        dy = (ch - dh) / 2;
      }
      ctx!.clearRect(0, 0, cw, ch);
      ctx!.drawImage(img, dx, dy, dw, dh);
    }

    function load(i: number, onFirst?: () => void) {
      if (i < 1 || i > frameCount || frames[i]) return;
      const img = new Image();
      img.src = src(i);
      frames[i] = img;
      if (onFirst) img.onload = onFirst;
    }

    function render() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      const target = Math.min(
        frameCount,
        Math.max(1, Math.round(progress * (frameCount - 1)) + 1)
      );
      if (target !== current) {
        const img = frames[target];
        if (img && img.complete && img.naturalWidth) {
          draw(img);
          current = target;
        }
        // keep a rolling window of upcoming frames warm
        for (let i = target; i <= target + 12; i++) load(i);
      }
      raf = requestAnimationFrame(render);
    }

    window.addEventListener("resize", resize);

    if (reduce) {
      // Reduced motion: hold the final resolved wordmark, no scrub.
      load(frameCount, () => {
        const img = frames[frameCount];
        resize();
        draw(img);
        setReady(true);
      });
      return () => {
        window.removeEventListener("resize", resize);
      };
    }

    // Preload the opening run, then kick the loop once frame 1 is decoded.
    load(1, () => {
      resize();
      draw(frames[1]);
      setReady(true);
      raf = requestAnimationFrame(render);
    });
    for (let i = 2; i <= 24; i++) load(i);
    // Lazy-load the remainder shortly after.
    const t = window.setTimeout(() => {
      for (let i = 25; i <= frameCount; i++) load(i);
    }, 400);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Reveal overlay copy as each panel scrolls in.
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-in");
        });
      },
      { threshold: 0.45 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="mc-root">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="mc-canvas"
        data-ready={ready}
      />
      {/* Legibility wash — soft, not a texture. */}
      <div className="mc-vignette" aria-hidden="true" />

      <main className="mc-main">
        {/* 1 — OPENING */}
        <section className="mc-panel mc-panel--hero">
          <p className="mc-kicker" data-reveal>
            Cape Town · South Africa + UAE
          </p>
          <h1 className="mc-h1" data-reveal>
            One builder.
            <br />
            <span className="mc-accent-line">Every layer.</span>
          </h1>
          <p className="mc-lede" data-reveal>
            A studio of one. Brand, web, commerce, motion, automation and
            software — cast from a single hand.
          </p>
          <span className="mc-scroll" aria-hidden="true">
            Scroll
          </span>
        </section>

        {/* 2 — THE CRAFTS */}
        <section className="mc-panel mc-panel--center">
          <ul className="mc-crafts" data-reveal>
            {["Brand", "Web", "Commerce", "Motion", "Automation", "Software"].map(
              (c, i) => (
                <li key={c} style={{ transitionDelay: `${i * 70}ms` }}>
                  <span className="mc-craft-num">0{i + 1}</span>
                  {c}
                </li>
              )
            )}
          </ul>
        </section>

        {/* 3 — STATEMENT */}
        <section className="mc-panel mc-panel--center">
          <h2 className="mc-h2" data-reveal>
            We don&apos;t build websites.
          </h2>
        </section>

        {/* 4 — CLIMAX (over the resolved {alqode} mark) */}
        <section className="mc-panel mc-panel--climax">
          <div className="mc-climax-inner" data-reveal>
            <h2 className="mc-h2 mc-h2--money">
              We build machines that make you money.
            </h2>
            <a
              className="mc-cta"
              href={waUrl("v4_hero")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Start on WhatsApp
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
