"use client";

/**
 * THE MACHINE — central GSAP plugin registration + shared motion constants.
 *
 * GSAP went fully free in 2025 (Webflow bought GreenSock), so every premium
 * plugin ships inside gsap@3.15. We register them once, here, and import the
 * registered `gsap` plus the plugins from this module everywhere in the v4
 * build. Registering twice is a no-op (gsap dedupes), so this is safe to call
 * from any component's useGSAP block.
 */
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { Flip } from "gsap/Flip";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

let registered = false;

export function registerMachine() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
    DrawSVGPlugin,
    SplitText,
    ScrambleTextPlugin,
    Flip,
    MotionPathPlugin
  );
  registered = true;
}

/** True when the visitor asked for reduced motion. Guard every flourish with it. */
export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** The machine's house easing — the same snap used across the brand. */
export const MACHINE_EASE = "power3.out";

/** Glyph set the status readouts scramble through before locking ONLINE. */
export const SCRAMBLE_CHARS = "01<>/_=+*#%▮▯⎓";

export {
  gsap,
  useGSAP,
  ScrollTrigger,
  DrawSVGPlugin,
  SplitText,
  ScrambleTextPlugin,
  Flip,
  MotionPathPlugin,
};
