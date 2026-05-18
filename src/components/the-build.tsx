"use client";

import { useEffect, useRef, useState } from "react";
import {
  FileText,
  Zap,
  MessageCircle,
  Calendar,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { THE_BUILD } from "@/lib/constants";
import { Bracketed } from "@/components/primitives/bracketed";
import { MonoTag } from "@/components/primitives/mono-tag";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const NODE_ICONS: Record<string, LucideIcon> = {
  form: FileText,
  automation: Zap,
  notify: MessageCircle,
  booking: Calendar,
  revenue: TrendingUp,
};

type NodeState = "idle" | "active" | "done";

export function TheBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const linePathRefs = useRef<(SVGPathElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);

  // Per-node state for status pill text (idle | active | done)
  const [nodeStates, setNodeStates] = useState<NodeState[]>(
    () => THE_BUILD.nodes.map(() => "idle")
  );

  useEffect(() => {
    if (!sectionRef.current || !pinWrapperRef.current) return;

    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    const totalNodes = THE_BUILD.nodes.length;

    // Initial state: lines invisible, nodes muted
    linePathRefs.current.forEach((path) => {
      if (path) {
        const length = path.getTotalLength();
        path.style.strokeDasharray = String(length);
        path.style.strokeDashoffset = String(length);
      }
    });

    const ctx = gsap.context(() => {
      if (isMobile) {
        // ── MOBILE FALLBACK ─────────────────────────────
        // Auto-play sequential reveal when section enters viewport (no pin)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });

        THE_BUILD.nodes.forEach((_, i) => {
          tl.call(() => updateNodeState(i, "active"), [], i * 0.5);
          tl.call(() => updateNodeState(i, "done"), [], i * 0.5 + 0.45);
          if (i < totalNodes - 1 && linePathRefs.current[i]) {
            tl.to(
              linePathRefs.current[i],
              { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" },
              i * 0.5 + 0.25
            );
          }
        });
        // Counter and progress bar
        const counterTarget = { val: 0 };
        tl.to(
          counterTarget,
          {
            val: 100,
            duration: totalNodes * 0.5,
            ease: "none",
            onUpdate: () => {
              const v = Math.round(counterTarget.val);
              if (counterRef.current) counterRef.current.textContent = `${v}%`;
              if (progressLabelRef.current)
                progressLabelRef.current.textContent = `${v}% deployed`;
              if (progressRef.current)
                progressRef.current.style.width = `${v}%`;
            },
          },
          0
        );
        return;
      }

      // ── DESKTOP: PINNED SCROLL-DRIVEN ──────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=2200",
          pin: pinWrapperRef.current,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      // Each node has a window of scroll progress.
      // 5 nodes spread across 0.05 → 0.95 of the timeline.
      const segment = 1 / totalNodes;
      THE_BUILD.nodes.forEach((_, i) => {
        const start = i * segment + 0.02;
        const activeStart = start;
        const doneAt = start + segment * 0.55;

        tl.call(
          () => updateNodeState(i, "active"),
          [],
          activeStart
        );
        tl.call(() => updateNodeState(i, "done"), [], doneAt);

        // Draw connecting line to NEXT node (if not last)
        if (i < totalNodes - 1 && linePathRefs.current[i]) {
          tl.to(
            linePathRefs.current[i],
            { strokeDashoffset: 0, duration: segment * 0.5, ease: "none" },
            doneAt
          );
        }
      });

      // Counter and progress bar — linear across the entire scrub
      const counter = { val: 0 };
      tl.to(
        counter,
        {
          val: 100,
          duration: 1,
          ease: "none",
          onUpdate: () => {
            const v = Math.round(counter.val);
            if (counterRef.current) counterRef.current.textContent = `${v}%`;
            if (progressLabelRef.current)
              progressLabelRef.current.textContent = `${v}% deployed`;
            if (progressRef.current) progressRef.current.style.width = `${v}%`;
          },
        },
        0
      );
    }, sectionRef);

    return () => ctx.revert();

    function updateNodeState(idx: number, state: NodeState) {
      setNodeStates((prev) => {
        if (prev[idx] === state) return prev;
        const next = [...prev];
        next[idx] = state;
        return next;
      });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="the-build"
      className="hidden lg:block relative bg-void"
      aria-label="The Build — system pipeline visualization"
    >
      <div
        ref={pinWrapperRef}
        className="min-h-[88vh] lg:min-h-screen flex flex-col justify-center px-5 md:px-8 lg:px-12 py-16 lg:py-20"
      >
        <div className="container-width w-full">
          {/* Header */}
          <div className="mb-10 md:mb-14 max-w-3xl">
            <p className="text-terminal text-xs font-mono font-semibold tracking-[2.5px] uppercase mb-3 md:mb-4">
              <Bracketed tight>{THE_BUILD.tag}</Bracketed>
            </p>
            <h2 className="font-display text-[clamp(2rem,5.5vw,4rem)] italic font-normal leading-[1.02] tracking-tight mb-3 md:mb-4">
              {THE_BUILD.heading}
            </h2>
            <p className="text-sm md:text-base text-muted leading-relaxed max-w-2xl">
              {THE_BUILD.subline}
            </p>
          </div>

          {/* Pipeline — desktop horizontal flow, mobile vertical stack */}
          <div className="relative">
            {/* Connecting lines layer (desktop only — absolute SVG behind nodes) */}
            <svg
              className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-0"
              aria-hidden="true"
              preserveAspectRatio="none"
              viewBox="0 0 1000 200"
            >
              {THE_BUILD.nodes.slice(0, -1).map((_, i) => {
                // Each line connects from one node midpoint to the next.
                // 5 nodes evenly distributed across 1000 viewBox width.
                const x1 = ((i + 0.5) / 5) * 1000 + 70;
                const x2 = ((i + 1.5) / 5) * 1000 - 70;
                const y = 100;
                return (
                  <path
                    key={i}
                    ref={(el) => {
                      linePathRefs.current[i] = el;
                    }}
                    d={`M ${x1} ${y} L ${x2} ${y}`}
                    stroke="#10b981"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            {/* Node row */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
              {THE_BUILD.nodes.map((node, i) => {
                const Icon = NODE_ICONS[node.id];
                const state = nodeStates[i];
                const isIdle = state === "idle";
                const isActive = state === "active";
                const isDone = state === "done";
                const statusText = node.states[state];

                return (
                  <div
                    key={node.id}
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                    className={`relative rounded-xl border p-4 md:p-5 bg-card-bg transition-all duration-500 ease-snap ${
                      isIdle
                        ? "border-border opacity-40"
                        : isActive
                        ? "border-live-amber/60 opacity-100 shadow-[0_0_28px_-8px_rgba(255,184,28,0.5)]"
                        : "border-terminal/40 opacity-100 shadow-[0_0_28px_-10px_rgba(16,185,129,0.5)]"
                    }`}
                  >
                    {/* Top index label */}
                    <div className="flex items-center justify-between mb-3">
                      <MonoTag variant={isDone ? "terminal" : isActive ? "amber" : "muted"}>
                        node {String(i + 1).padStart(2, "0")}
                      </MonoTag>
                      <div
                        className={`relative flex h-2 w-2 ${
                          isIdle ? "opacity-30" : ""
                        }`}
                        aria-hidden="true"
                      >
                        {/* Pulse only during ACTIVE (briefly, scroll-driven). Done = solid, no pulse. */}
                        {isActive && (
                          <span className="absolute inset-0 rounded-full bg-live-amber animate-live-pulse" />
                        )}
                        <span
                          className={`relative inline-block h-2 w-2 rounded-full ${
                            isDone ? "bg-terminal" : isActive ? "bg-live-amber" : "bg-muted"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Icon */}
                    <div
                      className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg mb-4 transition-colors duration-500 ${
                        isDone
                          ? "bg-terminal/15 text-terminal"
                          : isActive
                          ? "bg-live-amber/15 text-live-amber"
                          : "bg-white/[0.03] text-muted"
                      }`}
                    >
                      <Icon size={24} strokeWidth={2} />
                    </div>

                    {/* Label + caption */}
                    <div className="mb-3">
                      <h3 className="text-sm md:text-[15px] font-bold text-white leading-tight mb-1">
                        {node.label}
                      </h3>
                      <p className="text-[11px] md:text-xs text-muted leading-snug">
                        {node.caption}
                      </p>
                    </div>

                    {/* Status pill */}
                    <div className="pt-3 border-t border-white/[0.06]">
                      <MonoTag
                        variant={isDone ? "terminal" : isActive ? "amber" : "muted"}
                      >
                        <Bracketed tight>{statusText}</Bracketed>
                      </MonoTag>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deployment progress + counter */}
          <div className="mt-10 md:mt-14 max-w-3xl">
            <div className="flex items-baseline justify-between gap-4 mb-3">
              <span
                ref={progressLabelRef}
                className="font-mono text-xs md:text-sm text-muted"
              >
                0% deployed
              </span>
              <span
                ref={counterRef}
                className="font-display text-3xl md:text-5xl italic text-terminal leading-none"
              >
                0%
              </span>
            </div>
            <div className="h-px bg-white/[0.06] overflow-hidden">
              <div
                ref={progressRef}
                className="h-full bg-gradient-to-r from-terminal via-terminal to-live-amber"
                style={{ width: "0%" }}
              />
            </div>
            <p className="mt-6 text-sm md:text-[15px] text-white/85 leading-relaxed max-w-xl">
              <span className="text-terminal font-mono mr-1">✓</span>
              {THE_BUILD.closer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
