# V4 KICKOFF — read this first, then you know everything in a snap

> Single entry point for a new session on the alqode v4 rebuild. Read this top to
> bottom, then `.planning/V4_BUILD_PLAN.md` (task checklist) and the dated
> `## SESSION 3` blocks in memory `MEMORY.md` for the blow-by-blow.

---

## 1. WHO + WHAT (30-second orientation)

- **Client:** Mohammed Hamdaan Dhaler, founder of **alqode**, a digital studio in
  Cape Town building for South Africa + UAE. He is the sole builder but we do NOT
  say "one person / studio of one" on the site (it caps how big clients think we
  can go). Public framing: **"digital studio", "the whole stack, in house."**
- **Goal:** rebuild alqode.com into an **Awwwards / FWA Site-of-the-Day-level**
  site. He benchmarks against real award winners, not templates. "Average is
  invisible." Being the first South African to win Awwwards is the dream.
- **v3.1 is LIVE on `main`** (Builder × Scene: Instrument Serif + dot-grid +
  terminal green). He considers that the "AI-built default" and wants out.
  **DO NOT TOUCH `main`.** All v4 work is on branch **`v4-cinema`**. Never push to
  or merge into main until he signs off.

## 2. THE HERO CONCEPT (locked, built, working)

Real-time WebGL hero: a **liquid chrome `{alqode}` wordmark** that **melts** between
a molten state and the crisp solid logo as you scroll, **green brackets igniting**
at the end. Cursor-reactive: you can **pull the chrome apart** with your mouse and
it flows back. Rendered live (React Three Fiber + GLSL), NOT pre-rendered video (he
rejected video-scrub as dated/"2016"). Chrome is the color event; green is rationed.
Live at route **`/v4`**.

## 3. EXACTLY WHERE WE ARE (end of session 3)

- **Branch:** `v4-cinema`. **Head commit:** `30360c8` (a docs commit lands on top
  after this). Working tree clean. main untouched (20+ commits ahead, 0 behind).
- **Build is GREEN:** `npx tsc --noEmit` exits 0. (It was failing at session end
  until the final cleanup; see lesson 7.) `npm run dev` floats ports
  (3000/3001/3002 by what's stale) — **read the dev log for the actual port; do
  not assume.** Last ran on 3000.
- **`/v4`** = `<Cursor/>` + `<CinemaHero/>` (WebGL hero) + `<PageSections/>` (page
  body). ~9000px tall.

### Hamdaan's last rating: "solid 5/10, genuine creativity, tip of the iceberg, excited."
Big jump from his earlier "negative 100." He did NOT review the latest batch (color
tokens + differentiated sections + budget slider) before killing the session at 66%
context. **Get his eyes on `/v4` early next session** (but don't sit idle waiting).

### BUILT + verified on screen (0 console errors each):
1. **Hero chrome + melt** (`cinema-hero.tsx`): scroll progress `p` 0→1 drives melt;
   p~0 molten, p~0.7 cast to solid, p~0.85 brackets ignite. `?p=0.5` freezes it.
2. **Pull-apart**: mouse over the solid logo parts the chrome, flows back; fades
   while molten so it never fights the cast.
3. **Custom cursor** (`cursor.tsx`): inertial green dot + lagging ring, grows over
   interactive elements, hides native cursor on fine-pointer devices.
4. **Moody cinematic lighting** (`studio-env.tsx`): cold dark studio, one warm ember
   rim, vignette. Bracket green is deep/saturated at the cast end (he asked for it).
5. **Editorial composition**: headline top-left; corner furniture ({alqode} mark +
   "Digital studio" top-left, Cape Town / SA&UAE top-right, rotated "Real-time WebGL"
   right edge). Not a logo floating in the void.
6. **Color foundation** (`tailwind.config.ts` v4-* tokens): off-white ink not pure
   white, warmer muted gray, two-tone section backgrounds, green rationed, ember as
   rare warm note. Breaks the black+white+green AI triad.
7. **Body sections** (`page-sections.tsx`), all real `constants.ts` content:
   Manifesto ("The whole stack, in house.") → Capabilities ("Six layers, one hand."
   tight numbered index) → Work ("Shipped. Live. Earning." big ALTERNATING editorial
   showcase of the 4 real projects) → Start (budget slider) → Footer.
8. **Budget slider** (`budget-slider.tsx`): drag R0→R30k+, 6 tiers (Free mockup →
   Landing → Brand+site → Commerce → Automation → Full machine, NOT anchored at
   R8k), green→ember fill, live rand figure, each tier swaps copy + pre-fills the
   WhatsApp CTA. Accessible (role=slider, arrow keys).

## 4. WHAT'S NEXT (my decided orchestration order — I am the architect, I decide)

He was explicit: **DON'T ask him "what should I build first."** I orchestrate the
logical dependency order (his coloring-book analogy: ready the colors and know which
goes where BEFORE coloring). Foundation → decoration → first impression:

1. ✅ color/brand system
2. ✅ differentiate body sections
3. ✅ budget-slider ending
4. **⬜ NEXT: studio "snake line" + tech stack.** A cursive SVG line weaving from
   the left, under the manifesto paragraph, back up between the two text columns,
   out to the next section. Threads the eye AND carries the tech we use (Meta,
   Airtable, n8n, Supabase, Next.js, Python, WooCommerce, etc.) — replacing the
   horizontal logo marquee the OLD v3.1 site had. Draw the path on scroll (GSAP,
   DrawSVG-style; the 8 gsap-* skills are installed). His explicit idea.
5. ⬜ intro loader 0→100 that preloads the 3D then a designed reveal into the hero;
   plus hero headline entrance choreography. (Phase 3 "the door.")
6. ⬜ designed mobile (NOT a degraded fallback — 90% of traffic is mobile) + perf
   (PerformanceMonitor auto-downgrade, dpr clamp, Lighthouse) + preview deploy.

Open question to raise eventually (don't block): the hero headline still says
**"One builder."** — given we dropped the one-person framing, does he want it changed?

## 5. HOW HAMDAAN WANTS ME TO WORK (operating model — critical)

- **I am the architect / orchestrator / creative lead.** He handed me full creative
  direction: "my creativity is limited, you made something I thought impossible,
  hang on to whatever needs sorting and how it looks." I drive; he reacts. Don't ask
  him to make design decisions I can make.
- **No check-ins, no pushing screenshots at him mid-work.** Work until a unit is
  complete, then tell him to go view `/v4`. He'll let me work 2-4 hours straight,
  unlimited credits/usage, full access (just name what I need). A "BTW" ping = he's
  checking I'm alive; reply briefly, keep working.
- **Use the installed skills proactively, every visual phase.** He paid for them and
  notices when I don't. Self-remind: do I need `impeccable` (design audit/
  composition/color/motion — lives at `~/.claude/skills/impeccable/`, brand.md is
  the brand register), `taste-skill` (anti-slop), `emil-design-eng` (Emil Kowalski
  polish/feel), the 8 `gsap-*` skills (scroll/timeline/draw), `humanizer` (copy),
  `frontend-design`/`ui-ux-pro-max`? Invoke the fitting one before/while building.
- **He prizes honest pushback and PROOF, not optimism.** His rule: **"hope is not
  the way to go."** If I catch myself saying I *hope* something works, I shipped it
  unverified — VERIFY on screen first. Calling a path a dead end and pivoting is
  right, not failure.
- **No em dashes, no AI-writing tells** in site copy AND chat. Write like a person.
- **When he can't describe what he wants, he gives references/links** — take them
  seriously, WebFetch a few. He thinks in outcomes ("people will throw cash at
  this"); reset him with a plain 3-line recap when he's lost in jargon.
- **Session hygiene:** he kills sessions ~66-75% context to keep a fresh brain.
  Always leave memory + this kickoff fully updated before wind-down.

## 6. TECHNICAL MAP (files + how the hero works)

**Active route** `src/app/v4/page.tsx` → `Cursor`, `CinemaHero` (dynamic ssr:false),
`PageSections`.

**Hero** `src/components/hero-cinema/cinema-hero.tsx`
- Tall scroll track (420vh) + sticky full-screen R3F `<Canvas>`. Scroll progress
  `p` read from `getBoundingClientRect` in ONE rAF loop, written to a module-level
  `view` object (NO React state in the hot path — keeps 3D smooth). `?p=` freezes.
- `view`: `p`, smoothed cursor `mx/my` (+ targets `mxT/myT`), `active`/`activeT`
  (pointer-live gate for the pull-apart).
- Chrome `MeshStandardMaterial` + GLSL via `onBeforeCompile`. The `NOISE_GLSL`
  string declares uniforms + simplex noise + `meltDisplace()` (gentle molten ripple
  along normal) and `displace()` (melt + cursor "part the metal"). **Every uniform
  used in GLSL MUST be declared in NOISE_GLSL AND registered in `uniforms.current`.**
- Uniforms: uTime, uMelt, uIgnite, uAmp, uFreq, uFlow, uSag, uEps, uStir(legacy 0),
  uCursor(vec3), uPush, uReach. Copy layers cross-fade by `p` via DOM-ref opacity.

**Geometry** `src/components/hero-cinema/wordmark-geometry.ts`
- `useMeltGeometry()` loads `public/brand/alqode-wordmark.svg` (SVGLoader →
  ExtrudeGeometry), tessellates (~edge 70), vertex-colours green brackets / white
  letters, merges to one mesh.
- **Brand SVG has NO green fill** — one `<g fill="#111">` of 8 paths `{ a l q o d e }`.
  Brackets = FIRST and LAST path (by index, not colour).
- **Stand the y-down SVG upright IN GEOMETRY** via `flipYUpright()` (negate Y +
  reverse winding + recompute normals), render with POSITIVE scale. A negative mesh
  scale inverts normals → chrome renders BLACK on flat faces.
- `mergeGeometries` from `three/examples/jsm/utils/BufferGeometryUtils.js` (NOT
  three-stdlib, which only has `mergeBufferGeometries`). SVGLoader + TessellateModifier
  ARE in three-stdlib. Scale dynamically from measured `size.x` to ~5.6 world units;
  the SVG viewBox is huge font units, never hardcode.
- **FAT ROUNDED bevel** (bevelSegments 8) on the thin Space-Grotesk strokes is what
  makes the chrome read premium (gives an edge to catch the strip-lights).

**Lighting** `studio-env.tsx` — drei `<Environment>` + `<Lightformer>`s, cold/dark,
vertical "chrome bar" strip-lights, ONE warm ember rim. Material envMapIntensity ~1.05.

**Page body** `page-sections.tsx`. Scroll-reveal via IntersectionObserver setting
`data-shown` — content VISIBLE by default, motion only enhances (never gate
visibility on a JS class; headless/reduced-motion ships blank otherwise).

**Other:** `budget-slider.tsx`, `cursor.tsx` (self-contained). Color tokens in
`tailwind.config.ts` (`v4-bg #060708`, `v4-bg-2 #0b0d10`, `v4-ink #ECEEF2`,
`v4-muted #828a93`, `v4-faint #565d66`, `v4-accent #10b981`, `v4-ember #ff9742`).
Grain + reveal + cursor CSS in `src/app/globals.css`.

**Brand asset** `public/brand/alqode-wordmark.svg` (from Space Grotesk Medium via
Python fonttools — opentype.js gives NaN paths, don't use it).

**Only one v4 route exists: `/v4` (the product).** The old lab routes (`/v4-lab`,
`/v4-melt`, `/v4-liquid`, `/v4-cast`, `/v4-morph`) and their components were deleted
at the end of session 3 (dead, stale, and breaking the build). If you want to
prototype a 3D variant again, make a fresh throwaway route; don't resurrect those.

## 7. HARD-WON LESSONS (do not relearn)

- **The Bash tool is POSIX bash (git-bash), NOT PowerShell** despite the env banner.
  Mixing PowerShell cmdlets into Bash errors AND can cancel the whole parallel tool
  batch. Use bash in the Bash tool, or use the PowerShell tool.
- **After multi-edit shader/uniform changes, VERIFY before committing.** A clean
  `git commit` proves nothing about runtime. Confirm on screen: `brightPx > 0` (logo
  actually rendering) AND 0 console errors. Edits can silently fail (string not
  found) and leave the shader half-wired. To read a WebGL compile error: dump
  `browser_console_messages` to a file, grep `ERROR: 0:` / `VALIDATE_STATUS`. The
  classic failure this session: uniform DECLARATIONS missing from NOISE_GLSL →
  "undeclared identifier" → shader won't compile → blank logo.
- **`npm run dev` does NOT typecheck; `npm run build` does.** The dev server can run
  perfectly green on screen while `tsc` / a Vercel build fails. Before any handoff
  or deploy, run `npx tsc --noEmit` and make it exit 0. (At session-3 end this
  caught a dead invalid prop `disableNormalPass` in the live hero + broken dead lab
  files; both fixed/removed.) `next.config.mjs` has NO `ignoreBuildErrors`, so a
  type error is a real deploy blocker.
- **Lenis owns scroll** (global LenisProvider, layout.tsx). `window.scrollTo()` and
  synthetic WheelEvents are ignored. For real scroll QC use Playwright
  `browser_press_key` End/PageUp/Home (trusted), or `?p=` to freeze. For the real
  mouse (pull-apart), use `browser_run_code_unsafe` with `page.mouse.move(x,y,{steps})`
  (trusted event; synthetic pointer events don't trigger the handler).
- **Canvas sampling:** `gl.readPixels` on the live WebGL context (via
  `browser_evaluate`) is the most reliable brightness check; `canvas.toDataURL` also
  works. brightPx counts pixels with R+G+B > 180.
- **Don't pile up dev servers.** Reuse the running one. If it hangs, PID-kill ONLY
  the `next dev`/npm-run-dev trees for THIS repo path. NEVER blanket-kill node — the
  Playwright/Notion/n8n MCP servers are node too.
- **Screenshot timing:** after editing, HMR recompiles; the first screenshot can be
  BLACK. Navigate, wait ~8s, re-shoot. If the image-read channel dies, fall back to
  a DOM/pixel probe via `browser_evaluate`.
- **Glitched tool results happen:** a Bash `grep`/`git status` sometimes returns
  impossible prose or duplicate lines — it's a corrupted tool result, Read the file
  to confirm, don't "fix" phantom corruption.
- **Displacement amplitude must be a SMALL fraction of feature size** and NEVER
  multiplied by raw pointer-delta. Cranked (size.y*0.55 ≈ 750u) it tore the thin
  letters into flying "strings" = looked broken. Current melt amp size.y*0.08;
  pull-apart size.y*0.12 gated by the active flag.

## 8. INSPIRATION + BRAND (color/brand + polish phases)

He asked: is black/white/terminal-green AI-slop? My honest read: emerald `#10b981`
IS the AI-default accent, but defensible here (chrome is the real color event, green
rationed to brackets + ember). Could nudge the green hue off the exact default or
lean the ember harder. His brand = his call, but delegated to me. WebFetch a few
when doing the brand pass:
- **Branding:** rebrand.gallery, visualjournal.it, bpando.org, cosmos.so,
  brandarchive.xyz, are.na, abduzeedo.com, worldbranddesign.com, the-brandidentity.com,
  mindsparklemag.com
- **Color/gradient:** coolors.co, grabient.com, colorhunt.co, colorkit.co,
  kigen.design/color
- **Award galleries (the bar):** awwwards.com, thefwa.com, siteinspire.com,
  lapa.ninja, onepagelove.com, behance.net, dribbble.com, designspiration.com,
  logoinspirations.co
- **Hero references he gave:** itsoffbrand.com, funtech.inc, lusion.co, obys.agency,
  noomoagency.com, activetheory.net, bruno-simon.com. The gap to award level is
  CHOREOGRAPHY (loader, transitions, reactive motion), not the chrome.

## 9. CONTENT (real, in src/lib/constants.ts)

- `SITE`: WhatsApp wa.me/27685394482, email alqodez@gmail.com, IG @alqode.dev,
  GitHub alqode-dev, Cape Town. **Use `waUrl(source, text?)` for ALL WhatsApp links**
  (UTM tracking); never hardcode.
- `PORTFOLIO.projects` (4, in the Work showcase): Masjid Notify (community 2025),
  FAIDA (UAE finance automation 2024), Bochi Croffle (brand+game+loyalty 2025),
  Trophy SA (WooCommerce 2025, image=null).
- Founder motto to place somewhere in v4: "Our job is to make you so successful,
  your competitors run out of business."

## 10. STACK

three@0.171, @react-three/fiber@8 (React 18 — do NOT upgrade to v9/React19),
@react-three/drei@9, @react-three/postprocessing@2, gsap + @gsap/react, lenis,
three-stdlib. Next.js 14 App Router, TS strict, Tailwind. Higgsfield MCP connected
(~479 credits) for any baked fallback assets — not needed for the live hero.

---

**FIRST MOVES NEXT SESSION:** (1) start dev server, read the actual port. (2) Tell
Hamdaan to view `/v4` and react, but don't sit idle. (3) Begin item 4, the studio
snake-line carrying the tech stack, using the gsap-* skills. Re-read the award/
branding inspiration first ("100 times, learn something new").
