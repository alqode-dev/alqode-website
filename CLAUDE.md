# CLAUDE.md — alqode website

> **This is the ONLY documentation file for this project, and the master playbook.**
> If the codebase were wiped, this file alone should be enough to rebuild the site AND
> to build the next client site to the same bar. Read it completely before changing
> anything. It is both the current-state spec (Part A) and the reusable method we
> learned the hard way (Part B).
>
> Last updated: 2026-06-19 · Version: **v4 "Cinema"** — **SHIPPED LIVE** (it is alqode.com).
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
25. **THE HARD-SECTION METHODOLOGY — the 2-strike rule (READ THIS)**
26. Session-9 retrospective: the testimonials thrash + the REJECTED ledger
27. Resource decision tree (reach for these FIRST, not at attempt #9)
28. Get ahead / next session (be top 1%)

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
| framer-motion | 11.15 | powers the client-proof section (per-word flip, parallax); also legacy v3 |
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

6. **Client proof — THE TRANSFORMATION** (`client-proof.tsx`). The testimonials / social-proof
   section, **rebuilt in session 10** (the old 21st.dev quote-cycler is GONE). Proof as the
   machine's core move: each client's system **powering on**. One richly-built chrome unit (panel
   + ember rim + corner brackets) shows the **before** (the problem they walked in on, dim like a
   fault) → an ignition pulse runs the seam → **NOW RUNNING** (what the system actually does, lit,
   big serif). The *result*, not a quoted compliment; the founder rides along as the operator
   (photo + live link), a `BUDGET → PREMIUM` style readout anchors it. Auto-cycles the three; a
   right rail switches them. framer-motion; carries NO client screenshots (the work gallery owns
   "live + earning"); reduced-motion + no-JS rest on the running state with full quotes in an
   sr-only list + Review JSON-LD. Content = `TESTIMONIALS` in constants
   (`client/role/metric/before/after/pull/quote/photo/site`). **Why this kind:** RESOURCES.md §8
   (twice): *proof that converts is the TRANSFORMATION made immersive, not quote cards.* The two
   before→after attempts that failed earlier (§26 #4 drag, #9 kinetic type) failed on execution,
   not concept. **STATUS: SHIPPED LIVE, tired-pass from Hamdaan** ("looks nice, doesn't reach my
   bar but I'll give it a pass, I just wanna move on"). Accepted-not-loved, like the prior version,
   so still a future-improvement candidate — but the KIND is now settled (transformation, not a
   quote). Read **§25 + §26** before touching it.

7. **Control Core** (`control-core.tsx`). LOCKED + liked. The founder section as a wiring
   schematic, NOT a solar system (a copied orbit was ripped out). Operator photo in a
   bracketed chrome housing; 6 tool chips wired in, traces DrawSVG in, MotionPath current
   pulses flow toward the core. The 6 chips CONTINUOUSLY CYCLE through a 16-tool pool.
   Motto beside it: "Our job is to make you so successful, your competitors run out of
   business." + founder credit.

8. **Configurator** (`budget-slider.tsx`). LOCKED + loved. "Tell me what should run
   itself." Drag a slider R0 → R30k+; the budget figure, tier label, and tier copy update
   (e.g. "a store that sells while you sleep"), with a per-tier WhatsApp CTA.

9. **Footer — STANDBY** (`page-sections.tsx`). `module.standby :: CHANNEL OPEN`, the
   problem-led line, "Let's solve a problem" CTA (`waUrl("v4_footer")`), social links.

10. **Floating WhatsApp FAB** (`hero-cinema/whatsapp-fab.tsx`). The only persistent CTA (the
   site is headerless by design — no nav, confirmed). Machine-styled dark chrome pill (not a
   bright green circle): green WhatsApp glyph, compact disc on mobile, reply-time label on
   desktop. Honest live pip (soft pulse + "usually replies in minutes", never a fake "online
   now"). Appears after the first screen. `waUrl("v4_fab", <prefilled message>)`.

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
      capability-modules.tsx · work-gallery.tsx · client-proof.tsx · control-core.tsx
      budget-slider.tsx · studio-snake-line.tsx · machine-spine.tsx · status-readout.tsx
      studio-env.tsx · machine.ts · wordmark-geometry.ts · whatsapp-fab.tsx
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

Production first-load JS: home (v4) ~499 kB — the WebGL hero (three + R3F + GSAP),
dynamically imported behind the loader, plus framer-motion for the client-proof section
(~37 kB of the rise from the earlier 462 kB). This is the deliberate cost of the cinematic
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
`opengraph-image.tsx` (edge, 1200×630 PNG ~146kB — branded `{alqode}` + the money line +
"Free mockup in 24h"; renders pro, verified). `sitemap.ts` lists `/`. `robots.txt` allows all.

**CANONICAL HOST = `https://www.alqode.com` (session 10).** Vercel currently serves **www as
primary**: the bare `alqode.com` 307-redirects to `www`. So `SITE.url`, `metadataBase`, the
explicit canonical (`alternates.canonical`), `sitemap.ts`, and the `robots.txt` Sitemap line
all point at **www** — otherwise the auto-generated `og:image` (built from `metadataBase`)
sits on the bare host and **returns a 307 → 15-byte text/plain**, which silently kills the
WhatsApp/social link preview. **These must stay matched to the Vercel primary domain:** if the
primary is ever flipped to the bare `alqode.com`, flip `SITE.url` back to non-www in the same
change, or the image redirect bug returns (just inverted). The **H1** is an `sr-only`,
keyword-rich line in `page.tsx` (SSR'd) because the hero is `ssr:false` (its visible headline
is a `div`, ref-animated) — keep exactly one H1. To refresh a stale WhatsApp/FB preview cache
after a change, re-scrape the URL in the Facebook Sharing Debugger.

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
- **He vents when I miss.** "I'm done with you / you're so annoying / negative 100" is
  VENTING, not a stop order (he re-engages every time). Zero groveling, zero arguing, zero long
  explanations, zero promises. Don't mirror it. Raise the quality and return with something
  different in KIND. If you're drafting an apology or justification, delete it.
- **Leave docs + memory fully updated before winding down** (he ends sessions for a fresh
  brain and demands a clean handoff — this file is that handoff).

**SHARPENED in session 9 (the testimonials thrash — see §25/§26, internalise these):**
- **He gives a VIBE for LEVEL, never a SPEC to build.** When he says "I saw X I liked", take
  the level, throw away the literal thing, invent original from the resources. **NEVER ask him
  for a reference link / example / "show me what you mean"** on anything creative — it reads as
  dodging the design job he pays me to own, and it enraged him ("you do not get design
  inspiration from me"). Catch yourself about to chase his reference → STOP, pull a premium
  pattern and invent instead.
- **His rating words are FORMAT signals, not styling notes.** "vomit / 1/10 / super ass /
  looked like my v3 / seen it / format is bad" = the KIND of thing is wrong. Name that format
  category and BAN it; do not recolour it. (Recolouring a rejected kind is what cost 8 builds.)
- **Present 1–2 pre-vetted divergent options as a CHOICE, never a stream of single raw bets.**
  The taste skills are the FIRST reviewer; he is the SECOND. Converting his role from rejecter
  to chooser is the biggest relationship saver.

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
- **THE 2-STRIKE RULE (§25) — the executable version of the capabilities lesson above.** If a
  taste-driven section is rejected TWICE, STOP hand-iterating: the format category is wrong, not
  the paint. Switch immediately to premium-pull + divergent judged exploration. This lesson lived
  here as prose and was inert under pressure — it cost ~10 builds on the testimonials (§26).
  It is now a hard gate. Read §25 before touching any rejected section.

## 24. VERSION HISTORY

- **v4 "Cinema" (current — SHIPPED LIVE 2026-06-19):** full rebuild into "THE MACHINE" —
  WebGL molten-chrome hero, system-boot loader, signal-flow snake (25 logos), kinetic
  capabilities, deployed-units work gallery, **client-proof FIELD REPORTS** (21st.dev reskin),
  wired control core, budget configurator, standby footer, floating WhatsApp FAB. R3F + the
  full free GSAP plugin set + Lenis + framer-motion. Headerless by design. Built over many hard
  sessions; **capabilities took 6 attempts, the testimonials/client-proof took ~10** (see §25).
  Migrated `/v4` → `/`, deleted the entire v3 site, merged to `main`. alqode.com IS v4.
- **v3.1 / v3.0 (2026):** "Builder × Scene" dark terminal/automation aesthetic, single
  page, GSAP ScrollTrigger "The Build" pinned section, horizontal work carousel, light-bg
  About with founder motto, merged System/Talk sections. (Superseded by v4; preserved in
  git history.)
- **v2.x:** Next.js rebuild from the original Vite/Three.js portfolio; conversion-focused.
- **v1.x:** original Vite + React + Three.js portfolio.

---

## 25. THE HARD-SECTION METHODOLOGY — the 2-strike rule (READ THIS on any taste-driven section)

> Born from the testimonials thrash (§26): ~10 builds, the first 9 rejected, because the default
> loop was **solo-guess-and-show with no escalation gate.** This turns that lesson from inert
> prose into an executable ladder. A **hard section** = any taste-driven section Hamdaan rejects
> **twice**. The ladder below is not a retry loop.

**THE 8 BEHAVIOUR CHANGES (the whole playbook in 8 lines):**
1. **2-STRIKE RULE:** a taste section rejected twice means the FORMAT CATEGORY is wrong. STOP
   hand-iterating; switch to premium-pull + divergent judged exploration. Trigger is 2, not 9.
2. On a hard section, **pull a premium 21st.dev component for the STRUCTURE first** and reskin
   into the machine language. Hand-carve only signature moments that ARE the product (hero, snake,
   control core).
3. Run a **divergent exploration:** generate 3–4 genuinely DIFFERENT kinds behind `?variant=`,
   self-judge with taste-skill/impeccable/emil, show him only the strongest 1–2 as a CHOICE.
4. Run the **20-min code-free intake** before any hard-section build: load ui-ux-pro-max +
   taste-skill, write the section's ONE unique job, audit the page for redundancy, pull an anchor.
5. **NEVER ask him for a reference link**, and never treat a thing he "liked" as a spec — it's a
   VIBE/LEVEL signal. Take the level, invent original. Asking for refs enrages him.
6. Read his **rating words as FORMAT-category rejection**, not styling notes; name the dead
   category and never recolour it.
7. **Never bolt a gimmick** (waveform, slider, 3D, particles, halos) onto a weak concept. Build
   the static greyscale composition to "strong" FIRST, then animate. Favour asymmetry + one
   dominant focal device over uniform/centered grids.
8. When he vents, **don't grovel/argue/explain** — return with something different in KIND. Keep a
   per-section REJECTED ledger (§26) so no dead format is ever re-pitched.

### The 2-strike rule (the single most important trigger)
- **Strike 1 (first build rejected):** one re-skin allowed — fix hierarchy, type scale, motion,
  composition — and re-show.
- **Strike 2 (second build rejected): HARD STOP on solo hand-building.** Do NOT ship a third
  bespoke variation. Switch methods now. A quote-card stays a quote-card whether it floats, glows,
  or runs in WebGL; bubbles failed as CSS, grander CSS, and R3F — same KIND, three skins, three
  rejections. **Diagnose the KIND and leave that kind entirely.**

### The 20-minute code-free intake (before the first line; mandatory at strike 2)
1. **Load the taste skills — don't just know they exist.** `Skill(ui-ux-pro-max)` for direction +
   an explicit anti-pattern list for THIS section type, then `Skill(taste-skill)`/`Skill(impeccable)`
   as the anti-slop lens. 30 seconds; it changes the output.
2. **Write the section's ONE unique job** — the job no other section can do. (client-proof: "the
   human VOICE / the transformation in WORDS — the work gallery already owns the live sites.")
3. **Redundancy audit.** List what every OTHER section already does. If the new section reuses a
   move already on the page (live-site reveal = work gallery; kinetic-scramble type = capabilities;
   wired schematic = control core; the v3 case-card look is dead), it's auto-rejected — redesign
   before building. (The owner, not the agent, caught the Showfloor/work-gallery dup — never again.)
4. **Pull a premium structural anchor** via `mcp__magic__21st_magic_component_inspiration` /
   `_component_builder`. This is the top-1% baseline; it should be day one, not attempt #10.

### The divergent judged exploration (what to do at strike 2)
- Generate **3–4 structurally DIFFERENT KINDS in parallel** (different *object*, not different
  colours). Real option space for a proof section: (a) kinetic typographic statement, (b) an
  interactive operated machine, (c) a receipt/artifact-of-the-running-system, (d) a premium
  editorial composition, (e) **delete it / fold it smaller and more honest** (always a live option
  on a roster-shaped section).
- Prototype each rough-but-real behind a temporary `?variant=` switch (the move from commit
  `1861d61`), or spin parallel subagents (Workflow) one per direction + a judge agent.
- **Self-judge with the taste skills BEFORE he sees anything.** Gate: "Would a top-1% studio ship
  this? Has he plausibly seen this exact KIND?" Kill the weak ones yourself. **He is the SECOND
  reviewer, never the first.**
- Surface only the strongest 1–2 as a CHOICE ("two directions — which feels like you?").

### Pull-for-structure, reskin-for-soul (the build decision)
- On a hard/supporting section, pull the SKELETON from 21st.dev; spend the whole originality budget
  on the reskin into the machine language (chrome plate, mono readout, `{brackets}`, rationed
  green/ember, GSAP entrance). This is NOT copying a reference (banned) — the source is a generic
  component and the brand transform is total.
- Hand-carve ONLY signature moments that ARE the product (WebGL hero, snake, control core). For
  supporting sections (proof, footers, feature blocks), pull-and-reskin wins.

### Anti-decoration rule
- Never bolt a gimmick instrument (waveform, telemetry console, fake dashboard, drag-to-reveal, 3D
  depth, particles, halos) onto a weak concept to rescue it — he reads it as desperate ("almost
  made me vomit", "worst inventions"). **Motion/3D amplify the underlying composition; amplifying
  average makes louder-average.** Build the static greyscale composition to "strong" first.
- The craft tell he rejects is **uniform density / centered / evenly-weighted / 3-up equal grids.**
  The accepted winner is deliberately ASYMMETRIC with one dominant focal device (a ~34vw ghost case
  number against small mono text + huge negative space). One thing dominates; everything else is quiet.

## 26. SESSION-9 RETROSPECTIVE — the testimonials thrash + the REJECTED ledger

**What happened:** the client-proof / testimonials section took ~10 distinct builds in ONE session.
Hamdaan rejected the first 9 and only "let slide for now" (rated "average") the 10th. **Root cause:
the default loop was solo-guess-and-show with no escalation gate.** Each of the first 8 was ONE idea
built to completion then shown — gambling, not exploring; rejections changed the *paint*, never the
*method*. The two moves that finally worked — pull a premium 21st.dev component + reskin, and run a
divergent multi-agent judged exploration — were available from minute one and used at attempts 9–10
instead of attempt 2. Running attempt-10's pipeline FIRST lands "average-or-better" on build 1; one
judged divergent round closes to accepted = ~2 reviews instead of 10. **This was a PROCESS failure,
not a taste ceiling.** (The §23 capabilities lesson already said "change the KIND" — but as prose it
was inert under pressure; §25 is its executable form.)

**Secondary failures banked:** (1) the premium MCP + 4 taste skills sat idle for 9 attempts while
hand-carving from a blank canvas — and blank-canvas + competent engineering reliably lands at
"competent AI build", his exact rejection bar. (2) No redundancy audit (he caught the Showfloor dup).
(3) He mentioned liking "floating bubbles"; the agent treated a VIBE as a SPEC, asked for the
reference link, and burned ~3 attempts — he erupted "you do not get design inspiration from me".
(4) Grovel/explain responses to his venting taxed the relationship.

**THE REJECTED LEDGER — do NOT re-pitch any of these KINDS for client-proof:**
1. `9955c5e` Quote + headshot woven into work-gallery cards ("field report") — "looked like my v3".
2. `999fe18` "Return-signal" telemetry console + animated waveform + cycling quotes — "1/10, vomit".
3. `66b8a87` Clean editorial "case notes" (problem headline + quote + face) — "the format is really bad".
4. `80924ae` Interactive before→after "power-on" DRAG slider revealing the live site — "made me vomit".
5. `261256a` CSS floating-bubble avatars + speech bubble — weak.
6. `c0a383e` "Grander" floating voices (bigger type, halo, drifting motes, parallax) — "3/10, has potential".
7. `dc317ca` Real WebGL/R3F 3D floating-bubbles scene (depth, bloom, particles) — "super ass, worst inventions".
8. `1861d61` "Showfloor" — descend through each client's REAL live site as the hero — CUT, **duplicated the work gallery**.
9. `1a6369b` "Transform Line" — monumental before→after kinetic type (HOURS→MINUTES scramble) — "very bad, very bad".
10. `412d26f` Premium 21st.dev editorial reskin (ghost case number + pull-quote cycler) — "average, let it slide".
11. *(session 10)* "THE LINE" — one monumental operator pull-quote in big serif + quiet switch index — "none of them look good at ALL".
12. *(session 10)* "THE REGISTER" — art-directed manifest of all three voices at once (lead big, two quiet) — same rejection.
13. `9135f50` **"THE TRANSFORMATION" = the SHIPPED `client-proof.tsx`** — each client's system powers on (before→NOW RUNNING) in a rich chrome unit — **tired-pass: "looks nice, doesn't reach my bar, but move on".**
- **Banned KINDS distilled:** avatar+quote+metric cards (1,3,9); **any big pull-quote in editorial type (10,11,12) — the whole "quote as the hero" family is dead, even fresh skins of it; it also reads as more-of-the-same vs the hero/capabilities/footer which are already big type**; floating-bubble avatars in any tech (5,6,7); a gimmick instrument bolted onto a quote (2,4); the live-site-as-hero (8 = the work gallery's job).
- **The session-10 lesson (re-confirming §25):** I again opened with TWO options of the SAME kind (both pull-quotes) — the exact 2-strike trap. What landed was switching the *object* entirely to the **transformation made immersive** (RESOURCES.md §8, stated twice: that is what converts; quote cards do not). Lead with the transformation, not the compliment. If proof is reopened, do NOT pitch a quote; the open ceiling is richer/more-cinematic execution of the SAME transformation kind.

## 27. RESOURCE DECISION TREE — what to reach for FIRST (so it's not attempt #9)

> The toolkit was NEVER the bottleneck (see RESOURCES.md §10). Art direction + actually *using* the
> resources was. This tree forces the right pull early.

- **Any taste-driven visual section, before the first build →** `Skill(ui-ux-pro-max)` (direction +
  anti-pattern list) → `Skill(taste-skill)`/`Skill(impeccable)` (anti-slop lens). Non-negotiable on a
  hard section.
- **A top-1% structural starting point** (testimonials, pricing, feature blocks, footers, navs) **→
  21st.dev Magic MCP FIRST:** `mcp__magic__21st_magic_component_inspiration` to browse,
  `_component_builder` to pull, `_component_refiner` to iterate, then reskin. **DEFAULT for supporting
  sections — do not hand-carve the skeleton.** `mcp__magic__logo_search` for brand logos.
- **Polish / micro-interactions / the invisible details →** `Skill(emil-design-eng)` + `Skill(impeccable)`,
  AFTER structure is right, BEFORE showing him (adversarial first reviewer).
- **Motion / choreography (the real award-level gap) →** the eight `gsap-*` skills + `Skill(framer-motion)`
  (client-proof uses Framer Motion `useSpring` for the magnetic parallax). All free GSAP plugins registered in `machine.ts`.
- **Signature scroll-cinematic moment →** `Skill(video-to-website-natherk)` + R3F/drei/postprocessing.
  **RESERVE for moments that ARE the product.** (The WebGL 3D bubbles were "worst inventions" because depth
  was thrown at a section that needed WORDS.)
- **Generative assets (a real reel/hero still/portrait) →** Higgsfield MCP + `nano-banana-pro` /
  `seedance-2-0` / `hyper-motion-food-reel`. (Confirm the Higgsfield sub is still live — he was cancelling it.)
- **Copy →** `Skill(humanizer)`; `constants.ts` is the source of truth; every WhatsApp link via `waUrl()`.
- **A genuinely open question** (what proof format converts) **→** `deep-research`, ONCE, early, not as a
  stall. (It already found: proof that converts is the TRANSFORMATION made interactive/immersive; video
  out-converts text; a carousel of avatar quote cards is the canonical generic tell.)
- **On-screen QC →** Playwright MCP; `?p=0..1` freezes hero progress; Lenis owns scroll → `scrollIntoView`.

**The rule that ties it together:** on a hard section the first 20 minutes are skills + a 21st.dev pull +
a redundancy audit, BEFORE the first bespoke line.

## 28. GET AHEAD / NEXT SESSION — be top 1%

1. **`client-proof.tsx` is the FLOOR, not a win.** Status: ACCEPTED-NOT-LOVED ("average, let it slide") —
   the one section not signed off with enthusiasm and the most likely revisit. Flag it at session start.
   Its `TESTIMONIALS` quotes are DRAFT — confirm the real quotes with each owner before any rebuild or wide ads.
2. **If you reopen client-proof, run §25 from step one** — never from a blank canvas; read the §26 REJECTED
   ledger first. Its unique job is the HUMAN VOICE / the transformation in WORDS (the work gallery owns the sites).
3. **Bank the unused award-level proof DIRECTIONS** (kinds to invent originally, not skins): proof-as-state-change
   led by the problem walked in on; the receipt/artifact of the running system (a calendar that books itself, a
   community that returns, a store punching above budget); asymmetric progressive scroll-reveal (never a 3-up grid);
   one monumental operator-to-operator line with the human attached small; or fold-it-away/ambient (with only 3
   clients, fewer-and-stronger can beat any elaborate system). Award finding: **proof that converts is the
   TRANSFORMATION made interactive/immersive, not a quoted compliment; the avatar-quote-card grid is the slop tell.**
4. **Pre-load the §25 hard-section checklist at the top of any new visual work** — the 2-strike gate, the 20-min
   intake, the divergent judged exploration. First move, not a recovery move.
5. **Verify MCP + skills are live before relying on them:** 21st.dev Magic needs the key in gitignored `.mcp.json`
   (NEVER commit) + an app restart; confirm Higgsfield is still subscribed.
6. **Real-device pass on the LIVE site** (now on `main`, `5e3ac8e`): PageSpeed Insights on alqode.com for honest
   mobile perf + CLS (headless Lighthouse perf is unreliable — no GPU). a11y/best-practices/SEO were 100/96/98.
7. **Keep a REJECTED ledger per hard section** in this doc going forward, so no dead format is ever re-pitched.

**Award-craft to bank:** the gap to award level is CHOREOGRAPHY (loader, transitions, reactive motion), not the
chrome; the static composition must be strong UNANIMATED first; deliberate asymmetry + one dominant focal device +
generous negative space is the line between "art-directed" and "tidy template". Sources worth revisiting: Awwwards
testimonial inspiration + judging-criteria guides, creative-agency portfolios built around few clients.

---

*If you're starting a NEW client site from this folder: Part B is the method. Generate
the design system with ui-ux-pro-max, pick an original direction (never copy a ref),
use the full GSAP plugin set + R3F for signature moments, design mobile deliberately,
verify on screen + build before claiming done, and keep ONE doc like this one.*

*And the hardest-won lesson of all (§25): on any taste-driven section, run premium-pull +
divergent judged exploration FROM THE START — two strikes, never ten. The toolkit was never
the bottleneck; using it early, and changing the KIND not the paint, is the whole game.*
