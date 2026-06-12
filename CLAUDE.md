# CLAUDE.md — alqode website

> **This is the ONLY documentation file for this project, and the master playbook.**
> If the codebase were wiped, this file alone should be enough to rebuild the site AND
> to build the next client site to the same bar. Read it completely before changing
> anything. It is both the current-state spec (Part A) and the reusable method we
> learned the hard way (Part B).
>
> Last updated: 2026-06-07 · Version: **v4 "Cinema"** (the live design direction).
>
> **See also `RESOURCES.md`** — the complete inventory of every skill, agent, MCP,
> library, reference site and knowledge base available on this project.

---

## TABLE OF CONTENTS

**PART A — THE SITE (current state)**
1. Project identity
2. URLs, hosting, deploy
3. Tech stack
4. Commands
5. The direction: "THE MACHINE"
6. Page architecture (section by section)
7. The WebGL hero (how it works)
8. The machine system (primitives, spine, status, CSS)
9. Brand kit (v4 tokens, type, easings)
10. Content source of truth
11. File structure
12. Performance + the WebGL tradeoff
13. Accessibility + reduced motion
14. SEO + metadata
15. How to update content

**PART B — THE PLAYBOOK (how we work, reusable for future sites)**
16. Operating model (how Hamdaan works with me)
17. The tool kit (CLIs, MCPs, packages)
18. The skills (which, and when)
19. GSAP is free now (the full plugin set)
20. Inspiration (for LEVEL, never to copy)
21. How we make mobile genuinely good
22. How we test and verify (no "hope")
23. Hard-won lessons (do not relearn)
24. Version history

---

# PART A — THE SITE

## 1. PROJECT IDENTITY

| Field | Value |
|-------|-------|
| Project | Alqode website |
| Domain | alqode.com |
| Type | Digital agency, single-page, conversion-focused |
| Goal | Turn visitors into WhatsApp leads; be Awwwards / FWA level |
| Audience | ~99% mobile, South African SMBs + UAE |
| Owner | Mohammed Hamdaan Dhaler (founder) |
| Location | Cape Town, South Africa (builds for SA + UAE) |
| Email | alqodez@gmail.com |
| WhatsApp | +27 68 539 4482 (the primary CTA, via `waUrl()`) |
| Instagram | @alqode.dev · GitHub: alqode-dev |

**The one hard public-framing rule: the word "studio" is BANNED in all visible copy.**
Public framing is "digital agency" / "every layer in house". Component names and code
comments that contain "studio" (e.g. `StudioSnakeLine`, `StudioEnv`) are internal and
fine; user-facing text must never say it. Grep `-i studio` over `src` before shipping
and check every hit that lands in rendered text.

## 2. URLS, HOSTING, DEPLOY

| Thing | Value |
|------|------|
| Production | https://alqode.com (and alqode-website.vercel.app) |
| Repo | https://github.com/alqode-dev/alqode-website |
| Vercel | https://vercel.com/alqodes-projects/alqode-website (Hobby tier, Edge CDN, auto SSL) |
| DNS | Namecheap. A `@` → 76.76.21.21 · CNAME `www` → cname.vercel-dns.com |

**Deploy = push to `main`.** Every push to `main` auto-deploys to Vercel; PRs get
preview URLs. `vercel.json` is minimal (`{ "framework": "nextjs" }`). No env vars are
required (all content is hardcoded in `src/lib/constants.ts`; the contact path is
WhatsApp, there is no backend). Vercel CLI is authed as `alqodez-6669`; the
`/vercel:deploy` skill can push a preview.

## 3. TECH STACK

| Tech | Version | Purpose |
|------|---------|---------|
| Next.js | 14.2 | App Router, SSR, image optimisation, `next/dynamic` for the hero |
| React | 18.3 | UI |
| TypeScript | 5.7 | strict, no `ignoreBuildErrors` (a type error blocks the Vercel build) |
| Tailwind CSS | 3.4 | styling, extended v4 palette + machine classes |
| three | 0.171 | WebGL hero |
| @react-three/fiber | 8.18 | React renderer for three |
| @react-three/drei | 9.122 | helpers (Environment, useProgress, PerformanceMonitor) |
| @react-three/postprocessing | 2.19 | bloom / chromatic aberration on the hero |
| gsap | 3.15 | the motion engine — ALL premium plugins (now free), see §19 |
| @gsap/react | 2.1 | `useGSAP` hook |
| lenis | 1.1 | smooth scroll, synced to the GSAP ticker |
| motion | 12.40 | (motion.dev, framer-motion successor) springs/gestures where useful |
| framer-motion | 11.15 | legacy nav animation (v3); still installed |
| lucide-react | 0.468 | icons |
| opentype.js | 2.0 | parse the wordmark font for the 3D geometry |
| @vercel/analytics | 1.4 | production analytics |
| playwright | 1.60 | dev-only, used for on-screen QC + capturing client screenshots |

**Fonts** (next/font/google, `display: swap`, wired as CSS vars in `layout.tsx`):
Space Grotesk (`font-sans`), Instrument Serif (`font-display`, italic), JetBrains Mono
(`font-mono`). **We do NOT use:** any CMS, any backend, ScrollMagic/Locomotive.

## 4. COMMANDS

```bash
npm run dev     # dev server (http://localhost:3000). Route: /  (v4)
npm run build   # production build + full tsc + lint (the deploy gate)
npm run start   # serve the production build locally
npm run lint    # eslint
npx tsc --noEmit   # typecheck only (run before every handoff; dev does NOT typecheck)
```

## 5. THE DIRECTION: "THE MACHINE"

alqode builds machines that make money, so **the site IS one machine that boots,
assembles, and runs as you scroll.** It is the product, demonstrated, and it is original
to alqode (nothing borrowed). The shared visual grammar that kills the generic-AI-build
feel:

- **Chrome is raw stock.** The hero wordmark is molten/brushed metal.
- **Brushed-metal panels** with lit edges and at most one warm ember heat-rim per panel.
- **One glowing SPINE** signal line runs down the page (`MachineSpine`, DrawSVG) and a
  pulse travels it.
- Sections **ASSEMBLE / power on** (Flip, clip, slide) and flip a status readout
  `IDLE → ONLINE` (ScrambleText). They never just fade in (fade-in is the slop tell).
- **`{brackets}`** are structural. Mono status lines read like a control panel.
- **Headlines print in** char by char (SplitText). Things react to scroll + cursor.

Hamdaan rated the journey to here as low as 3/10 across earlier sessions and now likes
it. The capabilities section alone was rejected 5 times before the kinetic-statement
solution landed at 6/10 (his highest). See §23 for the lesson that unlocked it.

## 6. PAGE ARCHITECTURE (section by section)

Single page. Route file renders, in order:
`IntroLoader → Cursor → CinemaHero (dynamic, ssr:false) → PageSections → WhatsappFab`.
`PageSections` contains everything from the manifesto down.

1. **Loader — SYSTEM BOOT** (`intro-loader.tsx`). Terminal boot console: lines print in
   lockstep with a 0→100 power meter, blinking cursor. Time-floor ~2.2s blended with
   drei `useProgress`, 5s hard cap. Sets `html.v4-loading` → `html.v4-loaded`; the hero
   headline keys its char-by-char entrance off that class (CSS `.v4-hero-enter` is the
   no-JS fallback). Boot lines live in `BOOT_LINES`.

2. **Hero — IGNITION** (`cinema-hero.tsx`). The signature, LOCKED + loved. Tall scroll
   track + sticky `100dvh` R3F canvas of the molten chrome `{alqode}` wordmark. Three
   copy beats cross-fade by scroll: (A) "Every layer. / Built to earn." over the logo;
   (B) the crafts row "Brand · Web · Commerce · Motion · Automation · Software";
   (C) "We don't build websites. We build machines that make you money." + CTA
   **"Let's solve a problem"** (`waUrl("v4_hero")`). Camera pulls back on portrait so the
   full logo fits. Corner furniture: `{alqode}` mark, "Cape Town / SA & UAE", "Real-time
   · WebGL". See §7.

3. **Manifesto + Snake — SIGNAL FLOW** (`page-sections.tsx` first section +
   `studio-snake-line.tsx`). "The whole stack, in house." + the manifesto paragraph.
   Desktop: 25 brand logos flow continuously along an S-curve path (`PATH_D`,
   `getPointAtLength`, gsap.ticker, 34s loop). Mobile: a compact two-row brand-chip
   marquee (split half/half, opposite directions). Logos defined in the `TECHS` array;
   icons + colours from `tech-icons.tsx`. Adding a logo = add an icon + a `TECHS` entry.

4. **Capabilities — kinetic statement** (`capability-modules.tsx`). NOT a list/grid/
   cards/stack (all rejected). One living line: "from your logo, to your last" + one
   giant word that scrambles (ScrambleText) through the six layers
   (brand → web → commerce → motion → software → automation), each in its accent colour,
   charging a heat-bar and flipping a `L0X / 06 · tag` readout, resolving on
   "automation" to complete the approved heading. Reduced-motion / no-JS rests on
   "automation". The whole block is `aria-hidden`; an sr-only `<h2>` carries the sentence.

5. **Work — DEPLOYED UNITS** (`work-gallery.tsx`). LOCKED + liked. Premium horizontal
   showcase: framed live-screenshot cards with a telemetry bar, bracket corners, live/
   community badge, tech-stack chips. Mobile swipes (peeking next card + "swipe →");
   desktop scrolls + arrows. Real screenshots in `public/images/`.

6. **Control Core** (`control-core.tsx`). LOCKED + liked. The founder section as a wiring
   schematic, NOT a solar system (a copied orbit was ripped out). Operator photo in a
   bracketed chrome housing; 6 tool chips wired in, traces DrawSVG in, MotionPath current
   pulses flow toward the core. The 6 chips CONTINUOUSLY CYCLE through a 16-tool pool.
   Motto beside it: "Our job is to make you so successful, your competitors run out of
   business." + founder credit.

7. **Configurator** (`budget-slider.tsx`). LOCKED + loved. "Tell me what should run
   itself." Drag a slider R0 → R30k+; the budget figure, tier label, and tier copy update
   (e.g. "a store that sells while you sleep"), with a per-tier WhatsApp CTA.

8. **Footer — STANDBY** (`page-sections.tsx`). `module.standby :: CHANNEL OPEN`, the
   problem-led line, "Let's solve a problem" CTA (`waUrl("v4_footer")`), social links.

9. **Floating WhatsApp FAB** (`whatsapp-fab.tsx`). The only persistent CTA (the site is
   headerless by design — no nav, confirmed). Machine-styled dark chrome pill (not a
   bright green circle): green WhatsApp glyph, compact disc on mobile, reply-time label
   on desktop. Honest live pip (soft pulse + "usually replies in minutes", never a fake
   "online now"). Appears after the first screen. `waUrl("v4_fab", <prefilled message>)`.

## 7. THE WEBGL HERO (how it works)

- `cinema-hero.tsx`: tall scroll track + sticky R3F `<Canvas>`. Scroll progress `p` is
  read via `getBoundingClientRect` in ONE rAF loop into a module-level `view` object — NO
  React state in the hot path. `?p=0..1` in the URL freezes progress for deterministic QC
  screenshots. Copy layers cross-fade by `p` via DOM-ref opacity (animate the inner
  `h1`, not the layer wrapper, to avoid conflicts).
- Chrome material: `MeshStandardMaterial` + GLSL injected via `onBeforeCompile`
  (`NOISE_GLSL` declares uniforms + the melt + the cursor pull-apart). Displacement
  amplitude must be a small fraction of feature size — never multiplied by raw pointer
  delta (that made torn "strings" that looked broken).
- `wordmark-geometry.ts`: loads `public/brand/alqode-wordmark.svg` (SVGLoader → Extrude,
  fat rounded bevel), `flipYUpright()` (must render POSITIVE scale or the chrome goes
  black), tessellate, merge. Brackets = first + last path by index.
- `studio-env.tsx`: cold dark environment, vertical strip-lights, one ember rim.
- Perf guards (see §12): lower dpr ceiling on mobile, drei `PerformanceMonitor`
  `onDecline` drops dpr, `Canvas frameloop="never"` when the hero is scrolled out of
  view (IntersectionObserver), `powerPreference:"high-performance"`, sticky uses
  `[height:100dvh]` for iOS Safari.

## 8. THE MACHINE SYSTEM (shared building blocks)

- `machine.ts` — central GSAP plugin registration (`registerMachine()` registers
  useGSAP, ScrollTrigger, DrawSVG, SplitText, ScrambleText, Flip, MotionPath; double
  registration is a no-op). Exports the registered `gsap` + plugins, `prefersReducedMotion()`,
  `MACHINE_EASE = "power3.out"`, and `SCRAMBLE_CHARS`. Import gsap + plugins from here,
  not from `gsap` directly, so registration is guaranteed.
- `status-readout.tsx` — `<StatusReadout label online detail>`: a control-panel line
  `▸ module.x :: ■ ONLINE · detail`. On scroll-in the dot ignites and the status
  scrambles IDLE→ONLINE. Reduced motion → renders ONLINE, lit, static. Content always in
  the DOM.
- `machine-spine.tsx` — the left-rail DrawSVG signal line + travelling pulse.
- CSS (in `globals.css`): `.machine-panel` (brushed-metal gradient + machined grain),
  `.machine-edge` (lit top seam), `.machine-ember-rim` (the single warm rim),
  `.machine-dot` (square pip that ignites green via `data-on`). `.snake-node*` styles the
  flowing logo bubbles. `[data-reveal].reveal` + `data-shown` is the IntersectionObserver
  reveal (content VISIBLE by default — never gate visibility on JS).

## 9. BRAND KIT (v4)

**Colours** (tailwind `theme.extend.colors`):

| Token | Hex | Use |
|------|-----|-----|
| `v4-bg` | #060708 | page background |
| `v4-bg-2` | #0b0d10 | raised panels |
| `v4-ink` | #ECEEF2 | primary text |
| `v4-muted` | #828a93 | secondary text |
| `v4-faint` | #565d66 | mono labels, hairlines |
| `v4-accent` | #10b981 | the rationed green (status, spine, CTAs) |
| `v4-ember` | #ff9742 | the single warm accent (heat-rim) |

Capability layer accents (per-layer): brand #b48ef7, web #5b9df9, commerce #10b981,
motion #ff9742, software #2dd4bf, automation #ec5a8d.

**Type:** Instrument Serif italic (display/headlines), Space Grotesk (body/UI),
JetBrains Mono (status/labels/brackets). **Easings** (tailwind + CSS vars):
`ease-snap` `cubic-bezier(.16,1,.3,1)` (primary), `ease-out-quart`, `ease-spring-soft`.
**Logo:** `{alqode}` — green brackets, white text. Favicon `public/favicon.svg`.

## 10. CONTENT SOURCE OF TRUTH

**All copy lives in `src/lib/constants.ts`.** Components don't hardcode strings (the
capability words, the control-core motto, and the FAB label are the few intentional
inline exceptions). Key exports: `SITE`, `waUrl(source, text?)` (builds the tracked
`https://wa.me/27685394482?utm_source=…&text=…` — EVERY WhatsApp CTA must use it),
plus the section content objects. `tech-icons.tsx` holds `TECH_ICON_MAP` + `TECH_COLORS`.

## 11. FILE STRUCTURE

```
src/
  app/
    page.tsx            # the live home = v4 (IntroLoader, Cursor, CinemaHero, PageSections, WhatsappFab)
    layout.tsx          # fonts, metadata, JSON-LD, LenisProvider, Analytics
    globals.css         # v4 tokens, machine classes, snake styles, reveal primitive
    sitemap.ts · opengraph-image.tsx (edge) · not-found.tsx
  components/
    hero-cinema/        # THE v4 system:
      cinema-hero.tsx · intro-loader.tsx · cursor.tsx · page-sections.tsx
      capability-modules.tsx · work-gallery.tsx · control-core.tsx · budget-slider.tsx
      studio-snake-line.tsx · machine-spine.tsx · status-readout.tsx · studio-env.tsx
      machine.ts · wordmark-geometry.ts · whatsapp-fab.tsx
    tech-icons.tsx      # 25 inline SVG brand logos + TECH_ICON_MAP + TECH_COLORS
    client-logos-svg.tsx · footer.tsx
    primitives/         # bracketed.tsx · live-status.tsx · mono-tag.tsx
    lenis-provider.tsx  # Lenis × GSAP-ticker sync (in layout.tsx)
  lib/
    constants.ts        # all copy + waUrl()
    animations.ts       # scroll-reveal hooks
public/
  brand/alqode-wordmark.svg   # source for the 3D hero geometry
  images/…                    # work screenshots, founder photo, client owner photos
```

`lenis-provider.tsx` IS the ticker-synced version (`lenis.on("scroll",
ScrollTrigger.update)` + `gsap.ticker.add((t)=>lenis.raf(t*1000))` +
`gsap.ticker.lagSmoothing(0)`). **Lenis owns scroll** — don't change this casually or
ScrollTrigger scrub breaks.

## 12. PERFORMANCE + THE WEBGL TRADEOFF

Production first-load JS: home (v4) ~462 kB — the WebGL hero (three + R3F + GSAP),
dynamically imported behind the loader. This is the deliberate cost of the cinematic
direction Hamdaan signed off on; it will NOT score 90 on mobile Lighthouse performance,
and that is an accepted tradeoff. **Be honest about this number; never fake it.**

Measured (2026-06-07, prod build): Accessibility **100**, Best Practices **96**, SEO
**98**. The performance category from a headless run is unreliable because headless
Lighthouse has no GPU and renders the 3D hero in software (SwiftShader) under CPU
throttling — that tanks TBT/Speed-Index in a way a real phone's GPU never would. **Measure
hero performance on a real device or via PageSpeed Insights on the live URL.** Perf guards
are in place (§7). One thing worth a real-device check: CLS (the headless run flagged it,
likely an artifact of the dynamic hero mount vs the loader timing — verify on hardware).

## 13. ACCESSIBILITY + REDUCED MOTION

Lighthouse a11y = 100. Every flourish is guarded by `prefersReducedMotion()` (capabilities
rest on "automation", the snake goes static, the FAB pulse stops, status readouts render
ONLINE). Content is visible without JS (reveals default to shown; the hero headline has a
CSS fallback). Decorative SVGs are `aria-hidden`; the kinetic capability block is
`aria-hidden` with an sr-only heading. Keyboard focus is visible. Images have alt text.

## 14. SEO + METADATA

Title (home): "alqode — Every layer. Built to earn." Description covers brand/web/
commerce/motion/automation/software, in house, Cape Town. `layout.tsx` inherits these and
carries JSON-LD (Organization / ProfessionalService / FAQPage). OG image via
`opengraph-image.tsx` (edge). `sitemap.ts` lists `/`. `robots.txt` allows all.

## 15. HOW TO UPDATE CONTENT

- **Copy:** edit `src/lib/constants.ts`. WhatsApp links: always `waUrl("source")`.
- **Add a work card:** append to the portfolio data + drop a screenshot in
  `public/images/` (capture via Playwright: navigate → Escape popups → screenshot →
  `cp` into public/images → point the data at it; `next/image` re-optimises to webp/avif,
  no sharp needed).
- **Add a snake logo:** add an icon in `tech-icons.tsx` (match `IconProps`), register it
  in `TECH_ICON_MAP` + `TECH_COLORS`, append a `{name, Icon}` to `TECHS` in
  `studio-snake-line.tsx`. The desktop path auto-spaces; the mobile split is half/half.
- **Capability words:** the `CAPS` array in `capability-modules.tsx` (word + tag +
  colour); it resolves on the last entry.

---

# PART B — THE PLAYBOOK (how we work — reusable for the next site)

## 16. OPERATING MODEL (how Hamdaan works with me)

- **I am the architect / creative lead.** I decide the approach and build order. I do
  NOT hand design/UX decisions back to him or make him do homework. When he says "do
  whatever you think is best", I decide and own it.
- **He reviews fresh-eyes and rates /10.** He tells me only what's bad and expects me to
  invent the fix. He wants proactive improvement beyond his list.
- **Never copy a reference.** Reference sites show the LEVEL, not the thing to build. I
  once rebuilt a competitor's "solar system" literally and he was furious ("if I'm
  exactly like him, how do I beat him?"). Use refs for feel; invent something original.
- **"I don't work on hope."** Verify on screen before claiming anything works; ship
  deployable-first-try. 10 hours is fine if it ships; undeployable is the failure.
- **Don't ping mid-build.** Work until a unit is complete, then tell him to look. A "BTW"
  from him = he's checking I'm alive; reply briefly, keep working.
- **He's ~99% mobile.** Mobile must be DESIGNED, not a shrunk desktop.
- **No em dashes, no AI-writing tells**, in site copy and in chat. Write like a person.
- **Never touch `main` / the live site until he gives an explicit final GO.** Work on a
  branch; he takes one last look; then merge.
- **He vents when I miss.** Stay calm, don't argue, don't grovel, just fix it.
- **Leave docs + memory fully updated before winding down** (he ends sessions for a fresh
  brain and demands a clean handoff — this file is that handoff).

## 17. THE TOOL KIT (the gap was never missing tools)

- **CLIs:** npm, git, Vercel CLI (`/vercel:deploy` for previews; authed `alqodez-6669`),
  Playwright (QC + client screenshots). On Windows: the Bash tool is git-bash (POSIX),
  not PowerShell — use PowerShell only for process management.
- **MCPs:**
  - **21st.dev Magic MCP** — wired in `.mcp.json` (GITIGNORED — holds the API key, NEVER
    commit it). Needs an app restart to activate, then `mcp__magic__*` via ToolSearch.
    Pulls premium production-grade React/Tailwind components on demand; the move is pull a
    component → reskin into the machine language → wire with GSAP/Motion. Don't hand-carve
    what a premium source already nails.
  - **Playwright MCP** — the on-screen QC tool (navigate, evaluate, screenshot, console).
  - **Higgsfield MCP** — image/video generation (product reels etc.), if needed.
- **Packages:** see §3. The big unlock for v4 was using GSAP properly (§19) + R3F for the
  hero, not adding exotic libraries.
- **Finding/verifying tools:** WebSearch "<capability> open source 2026" / Codrops /
  Awwwards collections; check `node_modules` for what's already there; confirm a lib's
  claims via a quick WebFetch of its README; install only what earns its place.

## 18. THE SKILLS (which, and when)

Use the installed skills proactively every visual phase (he paid for them and notices
when they're skipped):
- **ui-ux-pro-max** — generate the design system (palette/type/anti-patterns) before a
  visual build; directly fixes "can't get the colours/design right".
- **impeccable / taste-skill / emil-design-eng** — interface polish, anti-slop critique,
  the invisible details.
- **gsap-core / gsap-scrolltrigger / gsap-plugins / gsap-react / gsap-timeline /
  gsap-utils / gsap-performance** — the motion engine reference.
- **framer-motion** — springs/gestures when GSAP isn't the right fit.
- **humanizer** — scrub AI-writing tells from copy.
- **video-to-website-natherk** ("Nathan/natherk") — scroll-driven video/scrubbed reveals,
  the technique reference behind scroll-locked hero ideas.

## 19. GSAP IS FREE NOW (the full plugin set)

GSAP went 100% free in 2025 (Webflow bought GreenSock). Every premium plugin already
ships inside `gsap@3.15`: **SplitText, DrawSVGPlugin, MorphSVGPlugin, Flip,
MotionPathPlugin, ScrambleTextPlugin, ScrollSmoother, Observer.** These ARE the
boot/assemble/wire toolkit — register them once in `machine.ts`. Earlier sessions used
~10% of GSAP (basic ScrollTrigger); the real gap was art direction + underusing GSAP, not
missing tools. Gotcha: **SplitText must be `type:"words,chars"`** (chars-only lets the
browser break mid-word, which caused a "Ever/y la/yer" hero bug).

## 20. INSPIRATION (for LEVEL, never to copy)

Creative-dev: itsoffbrand.com, lusion.co, obys.agency, noomoagency.com, activetheory.net,
bruno-simon.com, funtech.inc, motionsites.ai. Award galleries (the bar): awwwards.com,
thefwa.com, siteinspire.com, lapa.ninja, onepagelove.com, codrops/tympanus.net (technique).
Branding/colour: rebrand.gallery, cosmos.so, coolors.co, colorhunt.co. The gap to award
level is CHOREOGRAPHY (loader, transitions, reactive motion), not the chrome.

## 21. HOW WE MAKE MOBILE GENUINELY GOOD

Mobile is ~99% of traffic, so it's designed, not shrunk. Patterns that worked:
- Mobile-first; design the mobile composition deliberately, then enhance for desktop.
- Use `100dvh` (not `100vh`) for full-height heroes so iOS Safari's URL bar doesn't clip.
- Lower the WebGL dpr ceiling on mobile (≈1.3 vs 1.8 desktop).
- Give a section a DIFFERENT mobile form when the desktop form doesn't fit: the snake is
  a serpentine path on desktop but a two-row chip marquee on mobile; the work gallery
  swipes with a peeking next card; capabilities is typography that SCALES (same boldness),
  not a shrunk slab.
- Stack readouts/labels on mobile so the longest token never clips (the FAB label and the
  capability readout both do this).
- `line-clamp-2 md:line-clamp-none` truncates on mobile while keeping full text in the DOM
  for a11y. Watch `max-w-[Nch]`: `ch` is computed against the element's OWN font-size, so
  put the clamp on the text element, not a wrapper.

## 22. HOW WE TEST AND VERIFY (no "hope")

- **`npx tsc --noEmit` + `npm run build` before any handoff/deploy.** `npm run dev` does
  NOT typecheck, and there's no `ignoreBuildErrors`, so a type or lint error blocks Vercel.
  The production build also runs ESLint — `react/no-unescaped-entities` will fail a raw
  apostrophe in JSX (wrap as `{"Let's talk"}`).
- **Verify on screen with Playwright** before claiming anything works. A clean commit
  proves nothing about runtime. Read 0 console errors on a freshly-restarted dev server.
- **Lenis owns scroll:** `window.scrollTo` and synthetic wheel are ignored. Use
  `element.scrollIntoView({block})` (deterministic) or trusted keys (PageDown ≈ 787px at
  1440×900). After `End`, focus can stick → re-navigate to reset.
- **`?p=0..1`** freezes hero scroll progress for deterministic hero screenshots.
- **Shaders/animations:** confirm pixels actually drew (DOM/pixel probe, brightPx > 0);
  multi-edit shader changes can silently fail (string not found) → blank logo.
- **Screenshot timing:** after an edit HMR recompiles; the first screenshot can be stale/
  black — navigate, wait, re-shoot.
- **Client screenshots:** Playwright navigate → Escape popups → screenshot jpeg → cp into
  `public/images` → point constants at it. `next/image` re-optimises (no sharp).
- **The deploy gate:** tsc green · 0 console errors · mobile designed · build passes ·
  honest perf note · then his explicit GO · then merge to `main`.

## 23. HARD-WON LESSONS (do not relearn)

- **The big one (capabilities):** for a section he keeps rejecting, STOP re-skinning the
  same structure. Five capability redesigns all failed because they were variations of
  "six labelled items" (list, bento grid, selector+panel, 3D layer stack, cross-section
  slab). The problem was the FORMAT CATEGORY, not the styling. When he says "seen it /
  nothing different / competitors have it", change the KIND of thing, remove it, or make
  it an experience. The win was a single kinetic line, not a roster.
- **OneDrive `.next` EPERM/EINVAL:** OneDrive sync corrupts `.next` after a prod build and
  sometimes randomly kills the dev server. Fix: stop the repo's `next` process (PowerShell
  `Get-CimInstance Win32_Process` filtered to cmdline matching `alqode-website` + `next`,
  `Stop-Process`), `rm -rf .next`, start ONE fresh `npm run dev`. NEVER blanket-kill node
  (Playwright/MCP servers are node too). A stale Playwright Chrome holding the profile
  lock → kill only `chrome.exe` matching the `mcp-chrome` profile path.
- **Hydration "text content did not match" after an edit = stale `.next`,** not a real
  bug (curl shows SSR HTML is already the new text). Fresh rebuild clears it. Always take
  the 0-console-errors reading on a freshly-restarted server.
- **`browser_run_code_unsafe` runs in PAGE context** (no Playwright `page` object) — use
  `browser_evaluate` / trusted keys.
- **CSS 3D:** `translateZ` depth needs `transform-style:preserve-3d` on the parent + a
  `perspective` ancestor; `overflow-hidden` clips 3D pop-out. Tailwind has no
  `duration-400` (only 75/100/150/200/300/500/700/1000) — invalid values silently do
  nothing.
- **Displacement amplitude** must be a small fraction of feature size, never raw
  pointer-delta (cranked = torn "strings").
- **Never copy a reference. The word "studio" is banned in copy. No em dashes / AI tells.**

## 24. VERSION HISTORY

- **v4 "Cinema" (current, 2026):** full rebuild into "THE MACHINE" — WebGL molten-chrome
  hero, system-boot loader, signal-flow snake, kinetic capabilities, deployed-units work
  gallery, wired control core, budget configurator, standby footer, floating WhatsApp FAB.
  R3F + the full free GSAP plugin set + Lenis. Headerless by design. Built over multiple
  hard sessions; capabilities took 6 attempts. Shipped to `main` replacing v3.
- **v3.1 / v3.0 (2026):** "Builder × Scene" dark terminal/automation aesthetic, single
  page, GSAP ScrollTrigger "The Build" pinned section, horizontal work carousel, light-bg
  About with founder motto, merged System/Talk sections. (Superseded by v4; preserved in
  git history.)
- **v2.x:** Next.js rebuild from the original Vite/Three.js portfolio; conversion-focused.
- **v1.x:** original Vite + React + Three.js portfolio.

---

*If you're starting a NEW client site from this folder: Part B is the method. Generate
the design system with ui-ux-pro-max, pick an original direction (never copy a ref),
use the full GSAP plugin set + R3F for signature moments, design mobile deliberately,
verify on screen + build before claiming done, and keep ONE doc like this one.*
