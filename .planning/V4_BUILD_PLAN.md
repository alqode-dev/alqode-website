# alqode v4 — Build Plan (the house-cleaning order)

> Strategy: build foundation everything depends on FIRST, then the rooms, finish
> at the front door (the loader — the first thing a visitor hits). Never build a
> thing that forces a redo of a thing already built.

## The bigger picture
A one-screen WebGL hero is not the product. The product is the WHOLE page, in one
dark editorial language, with choreography that makes every beat feel designed.
That is what the reference sites (itsoffbrand, funtech, lusion, obys) win on.

## PHASE 1 — Foundation + hero lock (do first; everything reuses it)
- [x] Dark editorial palette + type scale already in Tailwind (void/terminal/white/muted)
- [ ] Fix: brackets too light at the cast end → saturated green, not washed white
- [ ] Global custom cursor (used by the whole page, so build before sections)
- [ ] Shared section shell (max-width, rhythm, heading style) so sections are consistent

## PHASE 2 — The rooms (the page body, dark editorial, real content from constants.ts)
- [ ] Manifesto: one strong statement (who alqode is — studio of one)
- [ ] Capabilities: the six layers (Brand/Web/Commerce/Motion/Automation/Software), editorial, not cards
- [ ] Work: real deployments (Masjid Notify, FAIDA, Bochi Croffle, Trophy SA) from PORTFOLIO
- [ ] Start: the offer (free mockup 24h / quote 1h) + WhatsApp via waUrl()
- [ ] Footer

## PHASE 3 — Choreography (the door — first impression, done once rooms exist)
- [ ] Intro loader 0→100 that preloads the 3D, then a designed reveal into the hero
- [ ] Scroll-reveal entrance motion across sections (GSAP, reduced-motion safe)
- [ ] Hero headline entrance + refined scroll hint

## PHASE 4 — Mobile + perf + ship
- [ ] Designed mobile (not a degraded fallback)
- [ ] PerformanceMonitor auto-downgrade, dpr clamp, Lighthouse pass
- [ ] Preview deploy for Hamdaan, then (only on sign-off) decide main

## Notes
- Branch v4-cinema only. Never touch main until signed off.
- Copy humanized, no em dashes, no AI tells.
- Hero verdict from Hamdaan: "good enough, I can work with this" (~2.5/10 lenient).
  Concrete fix logged: brackets too light at the end.
