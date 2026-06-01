# alqode v4 — THE MACHINE (master art direction + execution plan)

> Locked direction (Hamdaan approved 2026-06-01). Supersedes the section-polish
> items in V4_BUILD_PLAN.md. Rule: every step must leave the site MORE deployable,
> never a 10-hour monolith. Verify on screen (brightPx>0, 0 console errors) + `npx
> tsc --noEmit` every step. No "hope" — only verified state.

## THE THESIS (why this is ours and not a copy)
alqode builds **machines that make people money.** So the site does not *theme*
itself after space, or anyone else's motif. **The site IS one machine that boots,
assembles, and runs as you scroll.** It's the product, demonstrated. No other studio
can earn this language because it's literally what alqode sells. The founder "solar
system" was a borrowed motif — it gets reframed into alqode's own CONTROL CORE.

## THE MACHINE LANGUAGE (shared grammar every section obeys = the anti-slop unifier)
Consistency here is what reads as *intentional design* instead of a stack of nice parts.
1. **Material** — liquid chrome (hero) is the raw stock. Sections are dark
   brushed-metal panels: faint machined texture, lit edges, one warm ember rim
   (heat signature). Not flat black voids.
2. **The Spine** — ONE glowing signal line runs vertically down the page (the
   machine's bus/wire). It DRAWS as you scroll (GSAP DrawSVG) and branches into each
   module to power it. The studio "snake" is a horizontal tap off this spine.
3. **Power-on / boot** — each section is a MODULE that boots when the signal reaches
   it: mono status readout flips `IDLE → ONLINE` (ScrambleText), parts snap/assemble
   into place (Flip), edge-lights ignite. Things ASSEMBLE; they never just fade in
   (fade-in is the AI-slop tell we're killing).
4. **Type** — `{brackets}` as load-bearing structural framing. Mono terminal readouts
   for status (`> module.work :: ONLINE · 4 units`). Bold sans for human statements.
   Headlines BOOT in char-by-char (SplitText), like a readout printing.
5. **Reactive** — cursor + scroll reactive everywhere. The machine responds to you;
   hover = acknowledgement.
6. **Sound (optional, off by default)** — a subtle power-on tick/hum on key boots,
   mutable. Only if it earns its place.

## SECTION MAP (each = a module of the one machine + its signature moment)
- **Loader = SYSTEM BOOT** — not a generic 0–100. Terminal boot lines print
  (`alqode.os booting…`, ScrambleText), the spine charges, 0→100 = power level, then
  IGNITE into the hero. (Upgrade the existing loader.)
- **Hero = IGNITION** — KEEP (Hamdaan's favourite; the one thing that's right). Chrome
  core casts molten→solid. Headline boots in (SplitText).
- **Studio = SIGNAL FLOW** — the snake is the live data line carrying the stack; wire
  it visually to the spine so it reads as part of the machine.
- **Capabilities = THE MODULES** — not a list. Six machine modules power on one-by-one
  as the signal hits them: row assembles (Flip), status → ONLINE (ScrambleText), a
  tiny schematic per layer.
- **Work = DEPLOYED UNITS** — each project is a unit shipped to production. KEEP the
  live screenshots; wrap them in machine chrome + live telemetry (● LIVE since YYYY,
  result-as-metric).
- **Founder = CONTROL CORE** — RIP OUT the solar system. The operator at the core: face
  in a chrome/bracket housing, the systems WIRED to him (signal lines core→node,
  pulsing via MotionPath), a control schematic, not free-floating orbits. "The systems
  answer to you."
- **Budget = THE CONFIGURATOR** — keep the slider, make it a machine console: dialing
  output, readout updates like a control panel, the spec assembles.
- **Footer = STANDBY** — machine to standby; contact = "open a channel."

## CHOREOGRAPHY (the actual award-level gap — it's choreography, not chrome)
- Spine draws on scroll (DrawSVG) and triggers each module's boot at the right scroll
  position (ScrollTrigger).
- Transit between modules: the wire carries a pulse down to the next section, which
  then powers on. One continuous directed sequence, not independent reveals.
- SplitText every headline (prints in). ScrambleText every status readout. Flip for
  assembly. MotionPath for pulses travelling the wires.

## TOOLS — GATHERED + CONFIRMED IN HAND (no gap blocks the build)
- **GSAP full suite — FREE since 2025 (Webflow bought GreenSock), ALREADY installed in
  gsap@3.15**: SplitText, DrawSVGPlugin, MorphSVGPlugin, Flip, MotionPathPlugin,
  ScrambleTextPlugin, ScrollSmoother, ScrollTrigger, Observer. (Verified present in
  node_modules.) This is THE toolkit for boot/assemble/wire — and it was barely used.
  Skill: `gsap-plugins` covers all of it.
- R3F + drei + @react-three/postprocessing (installed) — chrome hero + bloom/aberration.
- Lenis (installed) — smooth scroll, already GSAP-ticker synced.
- Design skills: impeccable, taste-skill, emil-design-eng, humanizer.
- Evaluate-only-if-earned (NOT blockers): `howler` for the optional boot hum; brushed
  metal texture is hand-doable (SVG/CSS), no lib needed.
- **Honest gap finding:** the gap was never tools. It was (a) art direction and (b)
  using GSAP at 10%. Both fixed by this plan.

## BUILD ORDER (deployable-better each step; verify + tsc each step)
1. **Machine foundation** — material tokens (brushed-metal panel, edge-light, ember),
   a `StatusReadout` mono component, register GSAP plugins. The SPINE signal line
   (DrawSVG on scroll) down the page.
2. **Loader → SYSTEM BOOT** + hero headline SplitText boot.
3. **Founder → CONTROL CORE** (remove solar system; wired schematic).
4. **Capabilities → MODULES power-on** (Flip + ScrambleText + schematic).
5. **Work → DEPLOYED UNITS** (machine chrome + telemetry around the screenshots).
6. **Budget → CONFIGURATOR console.** Footer → STANDBY.
7. **Mobile pass** (the machine, designed for mobile — 99% of traffic) + **perf**
   (PerformanceMonitor auto-downgrade, dpr clamp, lazy, Lighthouse) + **PREVIEW DEPLOY.**

## DEPLOY GATE (the point Hamdaan made: 10 hrs is fine, undeployable is not)
Ships only when deployable-first-try: `tsc` green, 0 console errors, mobile designed,
Lighthouse mobile 90+, preview deploy on Vercel for sign-off BEFORE main. main stays
v3.1 until he signs off.
