# alqode v4 — Real-Time Chrome Hero Plan

> Supersedes the video-scrub approach in `V4_CINEMA_PLAN.md` (Phase 2 of that doc is dead).
> Written after deep research into technique + award references (2026-05-30).

## Why we pivoted

The video-scrub `/v4` demo was rejected: chrome not premium/HD, background read as "video on a page," reached the brand too fast, and a scrubbed pre-rendered clip is a dated technique. The client wants the hero rendered live, sharp, reactive, genuinely part of the page.

The research confirms the instinct. Across Lusion, Active Theory, Bruno Simon, Noomo: **the one thing none of these Site-of-the-Day winners do is ship a hero that cannot respond to you.** That reactivity is the exact line between "nice template / premium video" and "award winner." A video can never cross it.

## The look we are matching

The Higgsfield assets are not wasted: the chrome surface and the green-glow `{alqode}` end frame (`public/video/molten-cast.mp4`, end frame `f34f9223`) are now the **art-direction target** the real-time render must equal or beat. The video also becomes the reduced-motion / low-end fallback still.

## Concept (kept, execution rebuilt)

Liquid chrome pools, flows, and **casts itself into the `{alqode}` wordmark**, with the terminal green igniting from inside only at the final beat. Same story, rendered live, reactive to scroll and cursor. Open to refreshing the climax if a more creative resolve proves stronger during the spike.

## Creative direction (decisions, with reasons)

- **Typography:** bold neo-grotesque sans, large, tight-tracked, often uppercase (PP Neue Montreal / Söhne / GT America family; free stand-in: a tight grotesque until a license is bought). No Instrument Serif. Type is composition, and it can be kinetic (morph on scroll).
- **Layout language:** editorial system, not effects-for-effects. Numbered indexing (01 / 02), strong grid, generous negative space, "silence between strong statements" (Obys lesson). This is the antidote to the templated look, and it carries the non-hero sections at near-zero cost.
- **Palette:** near-monochrome canvas (true black hero, possible warm off-white editorial sections). The **chrome is the color event** (its own reflections supply richness). Terminal green `#10b981` is **kept but rationed**: it appears only as the earned inner-glow payoff at the cast moment and maybe one tiny accent, never as wallpaper. That keeps the brand tie while breaking the "terminal-green-everywhere" AI tell.
- **Reactivity (the premium tell):** cursor drives a light / reflection / surface ripple. Scroll drives the cast. At least two input modalities, like the award set.
- **Copy:** humanized, no em dashes, no rule-of-three, no AI tells. Run the humanizer skill on anything meaningful.

## Technical architecture (from research)

Stack (pinned for React 18.3.1):
```
three ^0.171   @react-three/fiber ^8.17 (v8 = React 18; do NOT jump to v9/React19)
@react-three/drei ^9.114   @react-three/postprocessing ^2.16
gsap ^3.15 + @gsap/react   lenis (already present)
```

- **Chrome material:** `meshStandardMaterial` metalness 1, roughness ~0.04, lit by a studio environment via drei `<Environment>` using `<Lightformer>` softboxes + one warm rim (procedural, no HDRI download) on a dark background. Real reflections are what sell "premium." Matcap is the cheaper fallback for mobile.
- **Liquid phase:** drei `<MarchingCubes>` metaballs wearing that exact material, so liquid and letters read as one continuous chrome surface.
- **Wordmark:** `{alqode}` authored as SVG, loaded via `SVGLoader` → `ExtrudeGeometry` (bevelled edges catch the rim light), same chrome material, plus a separate emissive `#10b981` inner core mesh (`toneMapped={false}`).
- **The morph (critical):** NOT a geometry morph (impossible: marching-cubes topology changes every frame). Instead a **scroll-driven waterline cast**: metaballs sink/flatten and dissolve while the extruded wordmark rises and a `uReveal` shader threshold "pulls it out of the pool." A few droplets get absorbed. Shared envMap keeps the chrome continuous. This beat is make-or-break and gets prototyped first.
- **Glow payoff:** `<EffectComposer>` + `<SelectiveBloom>` targeting only the green core; `emissiveIntensity` ramps with scroll so the green ignites as the cast completes.
- **Scroll wiring:** reuse the existing Lenis×GSAP ticker sync in `src/components/lenis-provider.tsx` (do not add a second rAF). A GSAP ScrollTrigger pins the canvas (`end:"+=2400"`, `scrub:0.6`, like `the-build.tsx`) and writes `self.progress` into a module ref; `useFrame` reads it to drive uniforms/positions. No React state in the loop.
- **Delivery:** dynamic-import the whole hero (`next/dynamic`, `ssr:false`), clamp `dpr={[1,1.75]}`, drei `<PerformanceMonitor>` auto-downgrade, marching-cubes resolution 48 desktop / 28 mobile.

## Mobile + accessibility (non-negotiable, 90% mobile)

Not "force parity." Graceful tiers:
- Capable desktop/high-end: full live morph + cursor reactivity.
- Weak GPU / low core count / Safari throttle: lighter version (lower res, bloom off, no morph) or the static cast image.
- `prefers-reduced-motion`: static premium chrome `{alqode}` still (can reuse a Higgsfield frame) with a subtle CSS sheen. No scrubbed 3D.

## Build phases (quality-gated, cheap proof first)

**Phase 0 — QUALITY SPIKE (half day, the gate).** Install the R3F stack on `v4-cinema`. Build only a static chrome `{alqode}` (extruded SVG + chrome material + Lightformer studio env) on `/v4-lab`. Screenshot it. **Decision gate: does the still look premium and HD next to the Higgsfield target?** If lighting/material are not there, fix before anything else. Nothing downstream matters until this screenshot looks expensive.

**Phase 1 — Liquid + continuity.** Add `<MarchingCubes>` metaballs in the same material beside the wordmark. Prove liquid and letters look like one chrome surface.

**Phase 2 — The cast.** Scroll-driven waterline reveal (pool sinks, wordmark rises) + cursor-driven reflection/light. Prove the cast feels weighty and reactive, not like a crossfade.

**Phase 3 — Green payoff.** SelectiveBloom on the green core, ramped on scroll. The glow becomes the climax.

**Phase 4 — Editorial surround.** Sections for the crafts (brand/web/commerce/motion/automation/software) and offer, in the editorial-grid language. Humanized copy. WhatsApp CTA via `waUrl()`.

**Phase 5 — Mobile + perf.** Tiered fallback, reduced-motion still, PerformanceMonitor downgrade, Lighthouse pass. Test on a real mid-range Android, not just throttled desktop.

**Phase 6 — Polish + preview deploy.** Page transitions, micro-interactions (impeccable / emil-design-eng skills), preview URL for review. Do not touch `main` until signed off.

## Top risks + mitigations

1. Cast reads as a cheap crossfade → use the waterline `uReveal` clip, shared envMap, absorbed droplets. Prototype this beat first.
2. Mobile perf / bundle weight (three+R3F+drei ~200KB+ JS) → dynamic import, Lightformer instead of HDRI, static image default on weak devices, auto-downgrade.
3. Chrome looks "CGI plastic" → it is almost always lighting, not material. Invest in the studio env + bevelled letter edges; match to the Higgsfield target frame.

## What I am NOT doing

- No scroll-locked video hero (dead).
- No dot-grid, scanline, terminal `>` tags, Instrument Serif, or em dashes.
- No unconstrained orbit controls (reads as tech demo).
- No stacked post-FX for "cinematic" (Noomo proves restraint wins).
- No pushing the full WebGL experience onto weak phones.
