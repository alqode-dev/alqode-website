# V4 KICKOFF — read this first, you'll be in flow in 60 seconds

> Single entry point for a new session on the alqode v4 rebuild. Read this top to
> bottom. Then the authoritative build spec **`.planning/V4_MACHINE_PLAN.md`**, then
> the dated blocks in memory `MEMORY.md` for blow-by-blow. This doc is fully current
> as of head `feb64e0` (2026-06-02).

---

## 0. THE ONE HARD RULE
**All v4 work is on branch `v4-cinema`. NEVER touch, push to, or merge into `main`.**
`main` is the LIVE v3.1 site (alqode.com) and stays untouched until v4 ships and
Hamdaan signs off. Branch is currently 37 commits ahead of main, 0 behind, tree clean.

## 1. WHO + WHAT (30-second orientation)
- **Client:** Mohammed Hamdaan Dhaler, founder of **alqode**, a digital studio in Cape
  Town building for South Africa + UAE. Public framing: **"digital studio", "every
  layer in house"** — do NOT say "one person / studio of one" (caps perceived scale).
- **Goal:** rebuild alqode.com into an **Awwwards / FWA Site-of-the-Day-level** site.
  Benchmark = real award winners, not templates. Dream = first South African to win
  Awwwards. He wants to be the best in SA. "Average is invisible."
- **He is demoralised and impatient** — we've spent ~4 days and he's rated it as low as
  3/10. He compares to competitors on Instagram who use the SAME tools (Claude, Motion,
  Higgsfield) but ship cleaner/faster/mobile-responsive. The gap is NOT talent or secret
  tools — it's that they ASSEMBLE premium parts into a direction instead of hand-carving.
  Internalise that. (See §6 tools.)

## 2. THE LOCKED DIRECTION — "THE MACHINE" (read `.planning/V4_MACHINE_PLAN.md`)
Hamdaan approved this original direction ("I really like the machine one"):
**alqode builds machines that make money, so the SITE IS ONE MACHINE that boots,
assembles, and runs as you scroll.** It's the product, demonstrated. Original to alqode
because it's literally what they sell — nothing borrowed.

**Machine language (the shared grammar that kills the AI-slop feel):** chrome is the raw
stock; sections are brushed-metal panels with lit edges + one ember heat-rim; ONE glowing
SPINE signal line runs down the page (DrawSVG) and powers on each section as a MODULE;
sections **ASSEMBLE** (Flip) and flip status `IDLE→ONLINE` (ScrambleText) — they NEVER
just fade in (fade-in is the slop tell we're deleting); `{brackets}` are structural;
headlines **print in** char-by-char (SplitText); everything cursor/scroll reactive.

**Section map (each = a module):** Loader=SYSTEM BOOT · Hero=IGNITION (KEEP, it's the
good part) · Studio=SIGNAL FLOW (the snake) · Capabilities=MODULES powering on · Work=
DEPLOYED UNITS (keep the screenshots) · Founder=CONTROL CORE (wired schematic — RIP OUT
the current solar-system, it's a copy) · Budget=CONFIGURATOR console · Footer=STANDBY.

## 3. EXACTLY WHERE WE ARE (head `feb64e0`, 2026-06-02)
- Route **`/v4`** = `<IntroLoader/> + <Cursor/> + <CinemaHero/> (WebGL) + <PageSections/>`.
  Dev server floats ports — READ THE DEV LOG for the real port (last was 3001; stale
  servers may also sit on 3000). Build GREEN (`npx tsc --noEmit` exits 0).
- **BUILT + verified on screen this session (0 console errors each):**
  1. Hero — liquid-chrome `{alqode}` wordmark, scroll-melt + cursor pull-apart, green
     brackets ignite. Headline now **"Every layer. One studio."** Hamdaan's favourite;
     KEEP it, only enhance (SplitText boot is the planned upgrade).
  2. Intro loader (`intro-loader.tsx`) — full-screen 0→100 over {alqode} + green bar,
     slide-away reveal, swaps `html.v4-loading`→`v4-loaded` (hero headline `.v4-hero-enter`
     keys off it, stays visible without JS). To be upgraded into the "SYSTEM BOOT".
  3. Studio snake line (`studio-snake-line.tsx`) — 18 brand logos flow continuously
     along an S-curve (gsap.ticker, NOT scroll-scrub), names under each, solid bubbles
     so the line passes behind. SIGNED OFF by Hamdaan.
  4. Work (`page-sections.tsx` + `ProjectVisual`) — 4 projects, framed LIVE screenshots
     alternating L/R, hover zoom. All 4 now have real shots (I captured Bochi + Trophy).
  5. Capabilities — "What we do" eyebrow + premium per-row hover. (To become MODULES.)
  6. Founder (`founder-orbit.tsx`) — face-in-orbit "solar system". **THIS IS THE COPY
     HAMDAAN HATED — REPLACE with the CONTROL CORE per the machine plan.**
  7. Budget slider — drag R0→R30k+, 6 tiers. Good; becomes the CONFIGURATOR.
  8. v4 color tokens in `tailwind.config.ts` (`v4-bg #060708`, `v4-bg-2 #0b0d10`,
     `v4-ink #ECEEF2`, `v4-muted #828a93`, `v4-faint #565d66`, `v4-accent #10b981`,
     `v4-ember #ff9742`).
- **NEXT:** execute `V4_MACHINE_PLAN.md` build order with the now-assembled tool kit (§6),
  starting: lock design system (ui-ux-pro-max) → machine foundation (brushed metal +
  StatusReadout + DrawSVG spine) → loader into SYSTEM BOOT → founder CONTROL CORE → caps
  MODULES → work DEPLOYED UNITS → budget/footer → MOBILE pass → perf → PREVIEW DEPLOY.

## 4. HOW HAMDAAN WANTS ME TO WORK (operating model — CRITICAL, he will end the sub if ignored)
- **I am the architect / creative lead. I decide build order. Don't ask him "what should
  I build first."** He hates being made to do homework.
- **NEVER COPY A REFERENCE.** He gives reference sites to show the LEVEL, not the thing to
  build. I once rebuilt a competitor's "solar system" literally → he was furious ("if I'm
  exactly like him how do I beat competition?"). Use refs for level/feel; invent something
  ORIGINAL to alqode every time.
- **DON'T ask him for more links/tools.** Memory + this doc already hold plenty (§7, §6).
  Asking him to feed me reads as dodging the job. I research/find tools myself (§6).
- **"I don't work on hope."** Verify on screen before claiming anything works. Ship
  DEPLOYABLE-first-try. 10 hours is fine IF it's deployable at the end; undeployable is
  the failure. There's a hard DEPLOY GATE (§9).
- **No check-ins / no pushing screenshots at him mid-build.** Work until a unit is
  complete, THEN tell him to view `/v4` (his tab HMR-auto-updates; just say "refresh and
  look"). A "BTW" ping = he's checking I'm alive; reply briefly, keep working.
- **Use the installed skills proactively every visual phase** (impeccable, taste-skill,
  emil-design-eng, ui-ux-pro-max, gsap-*, framer-motion, humanizer). He paid for them and
  notices when I don't.
- **No em dashes, no AI-writing tells** in site copy AND chat. Write like a person.
- **99% of his traffic is MOBILE.** Mobile must end up DESIGNED, not a degraded shrink.
  He wants desktop locked first, then a real mobile pass.
- **Leave docs + memory fully updated before every wind-down** (he ends sessions to keep
  a fresh brain; he explicitly demands a perfect handoff).

## 5. TECHNICAL MAP (files + how things work)
- Route `src/app/v4/page.tsx` → IntroLoader, Cursor, CinemaHero (dynamic ssr:false),
  PageSections. Metadata title "alqode — Every layer. One studio."
- **Hero** `src/components/hero-cinema/cinema-hero.tsx` — tall scroll track + sticky R3F
  Canvas; scroll progress `p` read via getBoundingClientRect in ONE rAF loop → module-
  level `view` object (NO React state in hot path). `?p=` freezes progress for QC. Chrome
  = MeshStandardMaterial + GLSL via onBeforeCompile (NOISE_GLSL string declares uniforms +
  melt + cursor pull-apart). Copy layers cross-fade by scroll via DOM-ref opacity; layerA
  opacity is set inline by the scroll loop (animate the inner h1, not layerA, to avoid
  conflict). Headline h1 has `.v4-hero-enter`.
- **Geometry** `wordmark-geometry.ts` — loads `public/brand/alqode-wordmark.svg`
  (SVGLoader→Extrude, fat rounded bevel), `flipYUpright()` (render POSITIVE scale or
  chrome goes black), tessellate, merge. Brackets = first+last path by index.
- **Lighting** `studio-env.tsx` — cold dark studio, vertical strip-lights, one ember rim.
- **Loader** `intro-loader.tsx` — time-floor (2.2s) blended with drei `useProgress`, 5s
  cap; classes `v4-loading`/`v4-loaded` on <html>. QC TIP: dev navigate resolves AFTER the
  ~2s loader, so to SEE the loader screen, temporarily bump `MIN` to ~9000ms, screenshot,
  revert.
- **Snake** `studio-snake-line.tsx` — gsap.ticker positions 18 logos along PATH_D (desktop
  overlay) / PATH_M (mobile in-flow band) via getPointAtLength; bubbles styled by
  `.snake-node*` CSS in globals.css. CONTINUOUS, not scroll-gated.
- **Founder orbit** `founder-orbit.tsx` — TO BE REPLACED by the control core.
- **Page body** `page-sections.tsx` — Manifesto+snake, Capabilities, Work (ProjectVisual),
  Founder, Budget (budget-slider.tsx), Footer. Scroll-reveal via IntersectionObserver
  setting `data-shown` (content VISIBLE by default — never gate visibility on JS).
- Tech icons + brand colors: `src/components/tech-icons.tsx` (added WhatsApp/Figma/Framer
  this session — Figma/Framer are hand-drawn approximations, redo properly later).
- **Lenis** `lenis-provider.tsx` (layout.tsx) — IS the gsap-ticker-synced version
  (`lenis.on("scroll", ScrollTrigger.update)` + `gsap.ticker.add`), so ScrollTrigger scrub
  is smooth. Lenis OWNS scroll.

## 6. THE TOOL KIT (gathered + set up — USE it; the gap was never missing tools)
- **21st.dev Magic MCP — wired in `.mcp.json` (GITIGNORED, key inside). NEEDS AN APP
  RESTART to activate**, then ToolSearch `mcp__magic__*` — it pulls premium production-grade
  React/Tailwind components on demand. THE accelerant: pull a component → reskin into the
  machine language → wire with Motion/GSAP. (The 21st-SDK GitHub he linked is an AGENT sdk,
  ignore it. Magic MCP is the component path.) NEVER commit `.mcp.json` (has the API key).
- **GSAP is 100% FREE since 2025** (Webflow bought GreenSock). ALL premium plugins are
  ALREADY in `gsap@3.15` node_modules (verified): SplitText, DrawSVGPlugin, MorphSVGPlugin,
  Flip, MotionPathPlugin, ScrambleTextPlugin, ScrollSmoother, Observer. I was using ~10% of
  GSAP. These ARE the machine toolkit (boot/assemble/wire). Skill `gsap-plugins`.
- **`motion`** (motion.dev, framer-motion successor) — INSTALLED (motion@12.40). Springs/
  gestures/layout. Skill `framer-motion`.
- **`ui-ux-pro-max`** — ALREADY a project skill. Invoke it to generate the machine design
  system (palette/type/anti-patterns). Directly fixes his recurring "can't get colors/
  design right" complaint. USE IT before the next visual build.
- R3F + drei + @react-three/postprocessing (installed) — chrome + bloom/aberration.
- **HOW TO FIND/VERIFY TOOLS (he said "everything is online, no excuses"):** WebSearch for
  "<capability> open source 2026" / Codrops / Awwwards collections; check `node_modules`
  for what's already there (`ls node_modules/<pkg>`); confirm a lib's claims with a quick
  WebFetch of its repo README; install with npm only what earns its place.
- Google-Drive file he shared (mcp_token URL) is auth-gated — couldn't WebFetch; ask him to
  paste contents if it matters.

## 7. INSPIRATION (use for LEVEL, never to copy)
- **Hero/creative-dev refs:** itsoffbrand.com, funtech.inc, lusion.co, obys.agency,
  noomoagency.com, activetheory.net, bruno-simon.com. The gap to award level is
  CHOREOGRAPHY (loader, transitions, reactive motion), not the chrome.
- **Award galleries (the bar):** awwwards.com, thefwa.com, siteinspire.com, lapa.ninja,
  onepagelove.com, codrops (tympanus.net) for technique.
- **Branding/color:** rebrand.gallery, cosmos.so, brandarchive.xyz, coolors.co, colorhunt.co.
- 2026 award trends: WebGL/3D, bold typography, assemble-on-scroll, spatial audio, extreme
  Core-Web-Vitals perf.

## 8. HARD-WON LESSONS (do not relearn)
- **Bash tool is POSIX bash (git-bash), NOT PowerShell** despite the env banner. Don't mix
  PowerShell cmdlets into the Bash tool.
- **`npm run dev` does NOT typecheck; run `npx tsc --noEmit` before any handoff/deploy** (no
  `ignoreBuildErrors`, so a type error blocks the Vercel build).
- **Lenis owns scroll** — `window.scrollTo`/synthetic wheel are ignored. For QC scroll, use
  Playwright trusted keys: PageDown/PageUp (~787px/press at 1440×900), ArrowDown/Up (~40-50px,
  for fine framing), End/Home. After `End`, keyboard focus can stick (PageUp stops working) →
  re-`navigate` to reset. `?p=` freezes hero progress.
- **Verify shaders/animations on screen before committing** — a clean `git commit` proves
  nothing about runtime. Confirm brightPx>0 (via `gl.readPixels`/DOM probe) + 0 console
  errors. Multi-edit shader changes can silently fail (string not found) → blank logo.
- **Screenshot timing:** after an edit, HMR recompiles; the FIRST screenshot can be stale/
  black/mid-reload. Navigate, wait, re-shoot. If image-read channel dies, DOM/pixel probe via
  `browser_evaluate`.
- **next/image re-optimizes any source to webp/avif at serve** — sharp NOT needed. Captured
  Bochi + Trophy live homepages with Playwright (navigate → Escape to kill popups →
  screenshot jpeg → `cp` to public/images → point constants at it). REUSE this for client shots.
- **Don't pile up dev servers.** Reuse the running one; if it hangs, PID-kill ONLY the
  `next dev` tree for THIS repo path — NEVER blanket-kill node (Playwright/other MCP servers
  are node too). To kill a stale Playwright Chrome holding the profile lock, kill chrome.exe
  procs matching the mcp-chrome profile path (safe — not node).
- **NEVER copy a reference** (the big one — see §4).
- **Displacement amplitude must be a small fraction of feature size**, never multiplied by raw
  pointer-delta (cranked = torn "strings", looked broken).

## 9. THE DEPLOY GATE (the point he hammered)
Ships ONLY when deployable-first-try: `tsc` green, 0 console errors, MOBILE designed,
Lighthouse mobile 90+, then a Vercel PREVIEW deploy for his sign-off. main stays v3.1 until
he signs off. Use `/vercel:deploy` skill for the preview.

## 10. FIRST MOVES NEXT SESSION (be in flow immediately or he cancels)
1. Confirm 21st Magic MCP is live: ToolSearch `mcp__magic__*`. If absent, the restart didn't
   load it — check `.mcp.json` exists + tell him.
2. Read `.planning/V4_MACHINE_PLAN.md` (authoritative build spec).
3. Start the dev server, read the actual port from its log, `npx tsc --noEmit` to confirm green.
4. Invoke `ui-ux-pro-max` to lock the machine design system (palette/type) — fixes the
   colors/design fumbling.
5. Execute the machine build order: foundation (brushed metal + StatusReadout + DrawSVG spine)
   → SYSTEM BOOT loader → CONTROL CORE founder (replace orbit) → caps MODULES → work units →
   budget/footer → MOBILE → perf → PREVIEW DEPLOY. Pull premium 21st components, reskin into
   the machine, wire with Motion + full GSAP. Verify each step on screen + tsc. No hope.
