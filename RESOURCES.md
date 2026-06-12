# RESOURCES.md — everything provided to build this project

> A complete, honest inventory of every tool, skill, agent, MCP server, library,
> reference site, knowledge base and learning resource available on the alqode
> website project. Compiled 2026-06-12 from the live environment (installed
> skills/agents/plugins on disk, the project's MCP config, `package.json`, the
> session toolset) plus `CLAUDE.md`/memory and the research done this build.
>
> **Scale of the work so far:** the repo has **116 commits**, starting **2025-11-19**,
> roughly **7 months** across many sessions (v1 Vite/Three.js → v2 Next.js → v3.1
> terminal → v4 "Cinema"). The point of this file is to show, in one place, exactly
> how much was on the table. Nothing here is padding; it is what is actually wired up.

---

## 0. THE HEADLINE COUNT

| Category | Count | Where it lives |
|---|---|---|
| Claude Code skills (user) | **44** | `~/.claude/skills/` |
| GSD command suite | **~26** | `~/.claude/commands/gsd` + `~/.claude/agents/gsd-*` |
| Official plugins | **3** | vercel, frontend-design, code-review (`claude-plugins-official`) |
| Built-in / utility skills | **~15** | deep-research, run, verify, init, review, security-review, simplify, code-review, loop, schedule, update-config, keybindings-help, fewer-permission-prompts, claude-api, statusline-setup |
| Subagent types | **18** | built-ins + the GSD agent fleet |
| MCP servers (this session) | **10+** | 21st Magic, Playwright, Higgsfield, Notion (API + claude.ai), Canva, Gmail, Google Calendar, Google Drive, vibiz_ai, context7 |
| Front-end libraries installed | **13 deps + 12 dev** | `package.json` |
| GSAP premium plugins (all free) | **8** | bundled in `gsap@3.15` |
| Inspiration / reference sites | **30+** | listed in §7–§8 |

The tooling was never the bottleneck. This document exists so that is unambiguous.

---

## 1. CLAUDE CODE SKILLS (44 installed in `~/.claude/skills/`)

Grouped by what they are for. Every one of these is invokable on this project.

### Design, UI/UX, taste
- **ui-ux-pro-max** — design-system intelligence: 67 styles, 161 palettes, 57 font pairings, 25 chart types, 16 stacks. Palette/type/anti-pattern generation. (The direct answer to "I can't get the colours/design right.")
- **impeccable** — anti-slop frontend skill: visual hierarchy, IA, cognitive load, a11y, motion, micro-interactions, theming, the invisible details. For making bland bold or loud quiet.
- **taste-skill** — anti-slop landing/portfolio/redesign skill; infers the right direction, ships non-templated interfaces, audit-first on redesigns.
- **emil-design-eng** — encodes **Emil Kowalski's** philosophy on UI polish, component design, animation decisions, the details that make software feel great.
- **cc-design** — high-fidelity HTML design/prototyping: slide decks, landing pages, UI mockups, animations, design systems, Figma-style work.
- **design-md** — synthesize a semantic design system into `DESIGN.md` from Stitch projects.
- **enhance-prompt** — turns vague UI ideas into polished, design-system-aware prompts.

### Motion & animation (the full GSAP curriculum + Framer)
- **gsap-core** — core API: to/from/fromTo, easing, stagger, defaults, matchMedia, reduced-motion.
- **gsap-scrolltrigger** — scroll-linked animation, pinning, scrub, triggers, parallax.
- **gsap-plugins** — plugin registration + ScrollTo, ScrollSmoother, Flip, Draggable, Inertia, Observer, SplitText, ScrambleText, SVG/physics plugins, CustomEase, GSDevTools.
- **gsap-react** — useGSAP hook, refs, `gsap.context()`, cleanup (what we use here).
- **gsap-frameworks** — Vue/Svelte/Nuxt/SvelteKit lifecycle + cleanup.
- **gsap-timeline** — sequencing, position parameter, nesting, playback.
- **gsap-utils** — clamp, mapRange, normalize, interpolate, random, snap, toArray, wrap, pipe.
- **gsap-performance** — transforms over layout, avoid thrash, will-change, batching, 60fps.
- **framer-motion** — motion components, variants, gestures, layout animations (also installed as a package; project copy at `.claude/skills/framer-motion` + `.agents/skills/framer-motion`).

### Video, scroll-cinematic, generative media
- **video-to-website** — turn a video into a scroll-locked frame-by-frame canvas reveal (Apple/BMW/katana style); ffmpeg frame extraction.
- **video-to-website-natherk** — the **"Nathan / natherk"** technique: scroll-driven video websites with GSAP, canvas frame rendering, layered choreography. (This is the scroll-animation reference you kept pointing me to.)
- **video-producer** — video production skill.
- **remotion** — generate walkthrough videos with Remotion (transitions, zoom, text overlays).
- **hyper-motion-food-reel** — 15s Higgsfield Hyper Motion food/product reel templates (CGI commercial look). Curated from `awesome-seedance`, `awesome-nanobanana-pro`, `digitalsamba/claude-code-video-toolkit`, `coreyhaines31/marketingskills`.
- **nano-banana-pro** — prompt playbook for Google **Nano Banana Pro** (Nano Banana 2) 4K product/scene images via Higgsfield.
- **seedance-2-0** — prompt playbook for ByteDance **Seedance 2.0** reference-driven video (start/end-frame control) via Higgsfield.

### Content, copy, strategy
- **humanizer** — strip AI-writing tells; based on Wikipedia's **"Signs of AI writing"** guide (em dashes, rule-of-three, inflated symbolism, etc.).
- **prompt-engineering** — prompting patterns/best practices/optimization.
- **prd** — generate a Product Requirements Document.
- **email-marketing-bible** — data-backed email KB: **908 sources, 4,798 insights** (strategy, flows, deliverability, copy, segmentation, 19 industry playbooks).

### SEO suite (12 skills)
seo-audit · seo-page · seo-technical · seo-content · seo-schema · seo-sitemap ·
seo-images · seo-geo (AI Overviews / GEO) · seo-hreflang · seo-plan ·
seo-programmatic · seo-competitor-pages.

### Engineering discipline
- **systematic-debugging** — scientific-method debugging before proposing fixes.
- **test-driven-development** — TDD before implementation.
- **executing-plans** — execute a written plan with review checkpoints.
- **brainstorming** — explore intent/requirements/design before building.
- **react-components** — convert Stitch designs into Vite/React components (AST-validated).
- **ralph** — convert PRDs into Ralph autonomous-agent JSON.

---

## 2. THE GSD PROJECT SYSTEM (~26 commands + an 11-agent fleet)

"Get Shit Done" planning/execution system (`~/.claude/commands/gsd`, agents in `~/.claude/agents/`):

`gsd:new-project · new-milestone · plan-phase · research-phase · discuss-phase ·
execute-phase · quick · progress · resume-work · pause-work · verify-work ·
audit-milestone · complete-milestone · plan-milestone-gaps · add-phase ·
insert-phase · remove-phase · add-todo · check-todos · list-phase-assumptions ·
map-codebase · set-profile · settings · update · help · join-discord`

GSD agents: gsd-roadmapper, gsd-planner, gsd-plan-checker, gsd-phase-researcher,
gsd-project-researcher, gsd-research-synthesizer, gsd-executor, gsd-debugger,
gsd-integration-checker, gsd-verifier, gsd-codebase-mapper.

---

## 3. INSTALLED PLUGINS (`claude-plugins-official` marketplace)

- **vercel** (v1.0.0) → `/vercel:deploy`, `/vercel:logs`, `/vercel:setup` (deploy to Vercel, view logs, configure).
- **frontend-design** → `/frontend-design` (distinctive, production-grade, anti-generic UI generation).
- **code-review** → `/code-review` (review the diff; supports `--comment`, `--fix`, and `ultra` cloud review).

## 4. BUILT-IN / UTILITY SKILLS (~15)

deep-research (fan-out web research with verification) · run (launch & drive the app) ·
verify (run the app and confirm a change works) · init (scaffold CLAUDE.md) ·
review · security-review · simplify (cleanup pass) · code-review · loop (recurring task) ·
schedule (cron/remote agents) · update-config (settings.json/hooks) · keybindings-help ·
fewer-permission-prompts · claude-api (Anthropic API/SDK reference) · statusline-setup.

---

## 5. SUBAGENTS (18 types)

Built-in: **claude** (general), **general-purpose**, **Explore** (read-only search),
**Plan** (architecture/planning), **claude-code-guide** (CC/SDK/API Q&A),
**statusline-setup**.
GSD fleet (11): the gsd-* agents listed in §2.
(Plus the Workflow tool can orchestrate fleets of these in parallel.)

---

## 6. MCP SERVERS (10+ connected this session)

| Server | What it gives | Notes |
|---|---|---|
| **21st.dev Magic** (`magic`) | `21st_magic_component_builder`, `_component_inspiration`, `_component_refiner`, `logo_search` | The one in the project's `.mcp.json` (gitignored, holds the API key). Pull premium React/Tailwind components → reskin. |
| **Playwright** | full browser automation: navigate, click, type, evaluate, screenshot, console, network, resize | Our on-screen QC + client-screenshot tool. |
| **Higgsfield** | `generate_image`, `generate_video`, `virality_predictor`, `generate_3d`, `generate_audio`, reframe, upscale, remove_background, motion_control, personal_clipper, video_analysis, … (40+ tools) | Image/video/3D generation. Pairs with nano-banana-pro + seedance-2-0 skills. |
| **Notion** (API) + **Notion** (claude.ai) | full Notion read/write: pages, databases, search, comments | Two Notion integrations available. |
| **Canva** (claude.ai) | design generation, brand templates, export, autofill, resize, comments (40+ tools) | Brand/design asset generation. |
| **Gmail** (claude.ai) | threads, drafts, labels, search (12 tools) | |
| **Google Calendar** (claude.ai) | auth + calendar | |
| **Google Drive** (claude.ai) | auth + drive | |
| **vibiz_ai** (claude.ai) | auth-gated service | |
| **context7** | live library/framework docs lookup | Used by the GSD research agents. |

MCP tool count across these servers runs into the **hundreds**; the table lists the
headline capabilities.

---

## 7. LIBRARIES & TOOLING ACTUALLY INSTALLED (`package.json`)

**Runtime deps (13):**
`next@14.2` · `react@18.3` · `react-dom@18.3` · `three@0.171` ·
`@react-three/fiber@8.18` · `@react-three/drei@9.122` · `@react-three/postprocessing@2.19` ·
`gsap@3.15` · `@gsap/react@2.1` · `lenis@1.1` · `motion@12.40` (motion.dev) ·
`framer-motion@11.15` · `lucide-react@0.468` · `@vercel/analytics@1.4`.

**Dev deps (12):** `typescript@5.7` · `tailwindcss@3.4` · `opentype.js@2.0` ·
`playwright@1.60` · `eslint` + `eslint-config-next` · `postcss` · `autoprefixer` ·
`@types/*` (node, react, react-dom, three).

**GSAP is 100% free since 2025** — every premium plugin ships inside `gsap@3.15`:
**SplitText, DrawSVGPlugin, MorphSVGPlugin, Flip, MotionPathPlugin, ScrambleTextPlugin,
ScrollSmoother, Observer** (+ ScrollTrigger, useGSAP). All registered in `machine.ts`.

**CLIs / tools:** npm · git · **Vercel CLI** (authed `alqodez-6669`) · **Playwright** ·
ffmpeg/sharp where needed (next/image handles optimisation, so sharp is usually not needed).

---

## 8. INSPIRATION & REFERENCE SITES (for LEVEL, never to copy)

### Creative-dev / award studios
itsoffbrand.com · lusion.co · obys.agency · noomoagency.com · activetheory.net ·
bruno-simon.com · funtech.inc · **motionsites.ai** (the LEVEL ref you shared).

### Award galleries (the bar)
awwwards.com · thefwa.com · siteinspire.com · lapa.ninja · onepagelove.com ·
**codrops / tympanus.net** (technique + case studies) · webdesignawards.io.

### Branding & colour
rebrand.gallery · cosmos.so · brandarchive.xyz · coolors.co · colorhunt.co.

### Social-proof / testimonial research (gathered this session)
Codrops case studies (Anderson Moss, Fiddle.Digital, Treize Grammes, Dondre Green,
Ciel Rose, …) · Awwwards "testimonials" collection · Framer blog (testimonial examples) ·
Webflow blog (website testimonials) · Famewall · SaaS Landing Page · Saaspo · Unsection ·
Red Baton · Justinmind · Behance · Dribbble · 99designs · Nicepage.
**Key finding:** the proof that converts is the *transformation* (before→after), made
*interactive/immersive*, not static quote cards — and video testimonials outconvert text.

---

## 9. KNOWLEDGE BASES, ARTICLES & LEARNING SOURCES EMBEDDED IN THE TOOLKIT

These are the bodies of knowledge baked into the skills above:
- **Wikipedia "Signs of AI writing"** → `humanizer`.
- **Emil Kowalski's** UI/animation philosophy → `emil-design-eng`.
- **Nathan / natherk** scroll-cinematic technique → `video-to-website-natherk`.
- **Email marketing KB**: 908 sources / 4,798 insights → `email-marketing-bible`.
- **GSAP official docs/curriculum** → the eight `gsap-*` skills.
- GitHub repos behind the media skills: `awesome-seedance`, `awesome-nanobanana-pro`,
  `digitalsamba/claude-code-video-toolkit`, `coreyhaines31/marketingskills`.
- Stitch design pipeline → `design-md`, `react-components`, `remotion`, `enhance-prompt`.
- **PDFs in the repo:** none found (searched `**/*.pdf` → 0). If you handed any over in
  chat that aren't on disk, point me to them and they go in here.

---

## 10. WHAT THIS LIST MEANS (the honest part)

Every category above was available the whole time: a full design-system engine, an
anti-slop critique skill, Emil-grade polish guidance, the complete GSAP plugin set with
eight dedicated skills, Framer Motion, R3F, generative image/video, premium component
pulls, award-level reference, and a research harness. The resources were never thin.

So when a section misses the bar, the gap is **art direction, taste and execution on my
side — not missing tools.** That is the thing to fix, and this document removes any doubt
about what there was to work with.

*If anything is missing from this list, it is an omission to correct, not a limit of what
you provided. Tell me and I will add it.*
