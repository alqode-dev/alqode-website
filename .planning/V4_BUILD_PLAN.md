# alqode v4 — Build Plan (the house-cleaning order)

> Strategy: build foundation everything depends on FIRST, then the rooms, finish
> at the front door (the loader — the first thing a visitor hits). Never build a
> thing that forces a redo of a thing already built.

## The bigger picture
A one-screen WebGL hero is not the product. The product is the WHOLE page, in one
dark editorial language, with choreography that makes every beat feel designed.
That is what the reference sites (itsoffbrand, funtech, lusion, obys) win on.

## PHASE 1 — Foundation + hero lock (do first; everything reuses it) ✅ DONE (55d2235)
- [x] Dark editorial palette + type scale already in Tailwind (void/terminal/white/muted)
- [x] Fix: brackets too light at the cast end → deeper saturated green ignite
- [x] Global custom cursor (cursor.tsx) — inertial dot + ring, grows green on hover
- [x] Section rhythm established in page-sections.tsx (max-w-1400, py-[14-20vh], border-t dividers)

## PHASE 2 — The rooms (the page body, dark editorial) ✅ DONE (55d2235)
- [x] Manifesto: "One person. The whole stack."
- [x] Capabilities: "Six layers, one hand." numbered editorial list, not cards
- [x] Work: "Live in production." real PORTFOLIO rows → live sites
- [x] Start: CTA + free mockup, waUrl()
- [x] Footer
- [ ] LATER POLISH: section copy via humanizer, maybe project thumbnails on hover

## PHASE 2.5 — Hamdaan's creative notes (2026-05-31, rated the site 5/10 "potential")
- [x] Interactive "part the chrome" on cursor — pull apart, flows back (his lead idea)
- [x] Drop "one person / studio of one" framing (limits perceived capability)
- [x] STUDIO section snake line (fd6a053): chrome-silver thread drawn on scroll
      (ScrollTrigger scrub), weaves low under the left column + rises through the
      gutter between columns; 9 tech logos (Next/React/TS/Python/n8n/Supabase/
      Airtable/Meta/Woo) ignite to brand colour as the comet head passes. Replaces
      the v3.1 marquee. Desktop overlay + mobile in-flow band (no text overlap).
      Verified 1440 + 390, 0 errors, tsc green.
- [ ] Differentiate section LAYOUTS: "Six layers" and "Live in production" currently
      look identical (numbered list + heading). Give each its own composition.
- [ ] Replace the plain "Tell me what should run itself" ending with an INTERACTIVE
      budget slider: drag R0 upward → at thresholds show what that buys (e.g. ~R1k
      website, ~R5k full e-commerce, ~R8-9k full software). NOT anchored at R8000.
      Examples of "what could run itself" animate in.
- [ ] COLOR: revisit whether black/white/terminal-green reads as AI-slop. My take:
      green #10b981 is the AI-default accent; keep green as the brand tie but make
      it feel earned (rationed to brackets + one warm ember accent already in the
      studio rim). Possible: shift green hue slightly off the default emerald, or
      lean the warm accent harder. Hamdaan's call — it's brand identity.

## PHASE 3 — Choreography (the door — first impression, done once rooms exist)
- [ ] Intro loader 0→100 that preloads the 3D, then a designed reveal into the hero
- [ ] Hero headline entrance + refined scroll hint
- [ ] OPEN Q for Hamdaan: hero headline still says "One builder" — change for
      consistency with the dropped one-person framing?

## PHASE 4 — Mobile + perf + ship
- [ ] Designed mobile (not a degraded fallback)
- [ ] PerformanceMonitor auto-downgrade, dpr clamp, Lighthouse pass
- [ ] Preview deploy for Hamdaan, then (only on sign-off) decide main

## Notes
- Branch v4-cinema only. Never touch main until signed off.
- Copy humanized, no em dashes, no AI tells.
- Hero verdict from Hamdaan: "good enough, I can work with this" (~2.5/10 lenient).
  Concrete fix logged: brackets too light at the end.
