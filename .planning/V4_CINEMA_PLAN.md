# alqode v4 "Cinema" — Sprint Plan

> Created at the end of the v3.1 → v4 pivot session (2026-05-30).
> Read this end-to-end in the new session before doing anything. It IS the brief.

---

## The pivot

**v3.1 (currently live at alqode.com)** is the "Builder × Scene" direction — Instrument Serif italic headlines, JetBrains Mono `>` system tags, terminal green accents, dark dot-grid backgrounds. The user (Hamdaan) flagged that this aesthetic has become the recognizable "Claude Code default" — every AI-built tasteful dev/agency site looks identical now. Friends building with the same tools landed on the same surface. He wants to break out.

**v4 "Cinema"** is the response: scroll-driven cinematic site at award-winning level (Awwwards/FWA target). Hero is a Higgsfield-generated CGI cinematic of liquid chrome morphing into the `{alqode}` brand mark. Playback is locked to scroll. Bold uppercase modern sans replaces Instrument Serif. Light or contrast palette replaces dark+green. Real interactive moments (cursor physics, scroll-locked video, kinetic type) replace the generic dot-grid + scanline atmosphere.

**Positioning evolution:** alqode is NOT just an automation shop. Hamdaan is a one-person studio doing brand, web, e-commerce, motion design, animation, ads/social, automation, SaaS, logo work — every layer of digital presence. "Studio of One" / "one builder, every layer." The hero metaphor must demonstrate that breadth without listing it.

---

## The locked hero concept — "Molten Cast"

A pool of liquid chrome on matte black surface flows in slow motion. As the user scrolls, it solidifies into the `{alqode}` brand mark — chrome curly brackets framing the wordmark, terminal-green inner glow, cinematic hero hold. ~6 seconds of source video, ~120 frames extracted, scroll-locked playback via `<canvas>`.

**Why this concept wins:**
- Single hero object (uncopyable because it's the alqode mark)
- Liquid chrome is what Higgsfield Cinema Studio (Hyper Motion) absolutely nails
- BMW M Competition-style reveal payoff (chrome casts into the brand mark at the end)
- Apple-keynote feel without copying any specific Apple page
- Mobile-parity friendly (single video asset + lighter frame set for small viewports)

---

## Asset generation pipeline

Three Higgsfield generations, total budget ~270 credits (out of 591 available).

### Asset 1 — Start frame (Nano Banana Pro, ~30-50 credits)

Suspended molten chrome droplet mid-flow on matte black, no logo yet. Reference frame for the video model.

Prompt (paste into `mcp__higgsfield__generate_image` with `model: nano_banana_pro`, aspect_ratio: 16:9):

```
Cinematic studio product photography of a suspended pool of liquid molten chrome,
slowly dripping mid-air, captured at the apex of a slow-motion drip. Matte black
background, single warm rim light from upper-right cutting through ambient haze,
shallow depth of field, volumetric lighting. Hyper-reflective chrome surface
catches a single ember-warm highlight. No logo, no text, no people, no hands.
Hyper-realistic, 8k, Apple-commercial cinematography, anamorphic lens, deep negative
space above and below the chrome mass. The chrome material reads as molten and alive
but not splashing — suspended, controlled, premium.
```

### Asset 2 — End frame (Nano Banana Pro, ~30-50 credits)

Solidified `{alqode}` chrome wordmark with terminal-green inner glow.

Prompt:

```
Cinematic studio product photography of the wordmark "{alqode}" rendered in
hyper-polished solid chrome, the curly brackets framing the lowercase letters
a-l-q-o-d-e. The chrome surface catches a single warm rim light from upper-right.
A subtle terminal-green inner glow (hex #10b981) emanates from inside the brackets,
backlighting the letters. Matte black background, single warm key light, volumetric
lighting through ambient haze, hyper-reflective surfaces, deep negative space.
Centered composition, dead-on camera angle, slight elevation hero shot.
No additional text, no people, no hands, no shadows on background.
Hyper-realistic, 8k, Apple-commercial cinematography, anamorphic lens.
```

### Asset 3 — Morph video (Seedance 2.0, ~150-200 credits)

Cinematic morph from start frame to end frame, 6 seconds, 16:9, 1080p.

Tool: `mcp__higgsfield__generate_video` with `model: seedance_2_0`, `medias: [{role: "start_image", value: <start_frame_job_id>}, {role: "end_image", value: <end_frame_job_id>}]`, `aspect_ratio: 16:9`, `duration: 6`, `resolution: 1080p`.

Prompt (Seedance):

```
The suspended liquid chrome droplet slowly flows downward in slow motion,
the molten material spreading and reforming itself in mid-air, gathering
into the shape of two chrome curly brackets and the lowercase letters
"alqode" between them, solidifying into a polished hero wordmark by the
final second. A warm terminal-green glow gradually emerges from inside the
brackets as the form completes. Matte black background, single warm rim
light from upper-right, hyper-reflective chrome surfaces catching the light,
slow controlled motion throughout, no people, no hands, no text appearing
or disappearing other than the final wordmark. Apple-commercial cinematography,
hyper-realistic 8k, anamorphic lens, shallow depth of field, deep negative space.
The final frame is a clean centered hero hold of the {alqode} chrome wordmark
with terminal-green inner glow.
```

---

## Phase plan (after assets render)

**Phase 0 — Render assets (this session's next step)**
1. Load `nano-banana-pro` skill, write the start frame prompt following its anatomy
2. Generate start frame via `mcp__higgsfield__generate_image` (preflight with `get_cost: true` first), get job_id
3. View result with `job_display`. Iterate prompt if needed.
4. Generate end frame, passing start frame `job_id` in `medias[].role: "image"` for consistency, get job_id
5. View result with `job_display`. Iterate prompt if needed.
6. Load `seedance-2-0` skill, write morph prompt describing motion (not scene)
7. Generate morph video via `mcp__higgsfield__generate_video` with `model: seedance_2_0`, `start_image` + `end_image` refs from above, `duration: 6`, `resolution: 1080p`, `mode: std`
8. Poll with `job_status` until done (~60-180s). View with `job_display`.
9. Download video URL to `public/video/molten-cast.mp4`

**Phase 1 — v4 scaffold (~1 day)**
- Decide: branch on existing `alqode-website` repo (v4 branch) or fresh repo
- Strong recommendation: branch on existing repo, keep v3.1 on main until v4 is ready, then squash-merge or replace
- Install npm packages: `@skiper-ui/skiper40` (and explore others), `motion`, `gsap` with ScrollTrigger + SplitText, `lenis`
- Install Tailwind tokens for v4 palette (TBD — likely cream/off-white primary with terminal-green accent retained, or full chrome/black/green)
- Replace Instrument Serif with PP Neue Montreal (or GT America / Söhne / ABC Diatype) for headlines

**Phase 2 — Run video-to-website skill**
- Drop `molten-cast.mp4` into project root
- Tell Claude: "use the video-to-website skill on `public/video/molten-cast.mp4` for the alqode hero"
- Claude (via skill) extracts ~120 frames with ffmpeg, builds canvas + scroll-locked playback + IntersectionObserver text reveals
- Compare against `video-to-website-natherk` skill — A/B which one produces better output
- The skill emphasizes: Lenis smooth scroll, 4+ animation types, staggered reveals, NO Instrument Serif italic headlines, NO dot-grid/scanline atmosphere (the video IS the texture)

**Phase 3 — Surrounding content**
- Hero: "We build machines that make you money." (existing tagline preserved)
- Sub-sections for each craft: Brand, Web, E-commerce, Automation, Motion, SaaS, Ads
- Each section gets a label, italic-bold sans heading, body, CTA
- Right-aligned video canvas on desktop, left-aligned text content

**Phase 4 — Mobile parity**
- Lighter frame set at 1080px wide / 18fps (~5MB total)
- Adaptive DPR scaling on canvas
- Test on real iPhone if possible
- Target ~85 Lighthouse mobile (acceptable for immersive site)

**Phase 5 — Service stations** (if time/budget allow)
- Generate 4-5 supporting Higgsfield videos for each craft section (Brand stamp, Web tilt, E-com checkout, Automation flow, Logo morph)
- Each ~5s, runs on its own scroll segment
- Budget another ~600 credits if pursued (out of session — needs new Higgsfield top-up)

**Phase 6 — Polish + transitions**
- Page transitions (curtain wipes / View Transitions API)
- Sound design (very minimal, mute toggle)
- Reduced-motion fallback (static hero frame + standard text reveals)
- Custom WebGL cursor (if scope allows)

**Phase 7 — Audit + deploy**
- Lighthouse mobile + desktop
- Fix issues from the audit (color contrast, touch targets, etc. — patterns we already fixed in v3.1)
- Push to a v4 branch, deploy preview, share preview URL with Hamdaan
- Submit to Awwwards once shipped to production

---

## Mandatory rules (carried from v3.1 + new for v4)

- **NO Instrument Serif italic** for headlines. That's the AI-built tell we're explicitly breaking out of.
- **NO dot-grid / scanline overlays.** The video IS the texture in v4.
- **NO terminal-green-as-headline-accent overuse.** Reserve green for the brand mark + maybe one accent. The chrome IS the palette.
- **Form still submits to WhatsApp via `waUrl()`** (NOT mailto, NOT Resend).
- **WhatsApp CTAs use UTM tracking** via `waUrl(source, text?)` helper.
- **Mobile parity required** — Hamdaan's audience is 90% mobile. No desktop-only experiences.
- **`prefers-reduced-motion` respected** — scroll-locked playback falls back to static hero frame.

---

## Budget + credits state

- Higgsfield balance at session close: **591 credits** (Plus plan, private workspace)
- Approved spend for asset trio: **~270 credits**
- Reserve buffer: **~320 credits** for re-renders if first attempt isn't right
- Higgsfield uses brother's account credits (Hamdaan doesn't have his own subscription yet)

---

## Skills + tooling installed (verified live)

**Claude skills in `~/.claude/skills/`:**
- 8 official GSAP skills: gsap-core, gsap-react, gsap-scrolltrigger, gsap-timeline, gsap-plugins, gsap-frameworks, gsap-performance, gsap-utils
- **nano-banana-pro** — prompt playbook for Nano Banana Pro image gen (start/end frames). LOAD FIRST when writing image prompts.
- **seedance-2-0** — prompt playbook for Seedance 2.0 video gen (start_image + end_image morph). LOAD FIRST when writing video prompts.
- video-to-website (mine, written from Nate Herk's tutorial transcript + alqode-specific defaults)
- video-to-website-natherk (Nate's actual SKILL.md, downloaded from Skool community on 2026-05-30)
- **impeccable** — 23-command anti-AI-tell design skill from Paul Bakaus. 7 domain references (typography, color, motion, spatial, interaction, responsive, UX writing) + 27 deterministic anti-pattern rules. USE for visual hierarchy / polish / critique phases.
- **emil-design-eng** — Emil Kowalski's UI polish + animation philosophy. USE for component-level animation decisions.
- framer-motion (from Smithery — `tadams95/framer-motion`)
- taste-skill (anti-AI-slop frontend skill)
- humanizer (anti-AI-slop text)
- cc-design (high-fidelity HTML design + prototype)
- hyper-motion-food-reel (Higgsfield Hyper Motion prompt playbook — for cafe/food product reels specifically)
- frontend-design (Anthropic official)
- wireframe-builder, ui-ux-pro-max, brainstorming, prompt-engineering (existing)

**MCPs:**
- **Higgsfield** (`mcp.higgsfield.ai/mcp`) — connected via OAuth, 591 credits ready
- Playwright, Canva, Gmail, Notion, GDrive

**CLI tools:**
- ffmpeg 8.1 (full build, gyan.dev)
- designlang 12.15.0 (extract any site's design tokens — `npx designlang https://apple.com/airpods` etc.)
- gh, npm, vercel, git

**Packages to install when v4 scaffold begins:**
- `@skiper-ui/skiper40` (and other Skiper UI shadcn-registry components)
- `danielpetho/fancy` (kinetic text animations)
- `nolly-studio/cult-ui` (design-engineer shadcn components)
- `moumen-soliman/uitripled` (production shadcn blocks)
- **3D / WebGL stack** (for the cursor-reactive physics + ambient layers):
  - `@react-three/fiber` (pmndrs, 31k★) — THE React renderer for Three.js. Foundation for any 3D work.
  - `@react-three/drei` — companion library, ready-made primitives (cameras, controls, materials, loaders)
  - `three` — peer dep
  - `@react-three/rapier` (optional) — physics for cursor-reactive objects (Lusion-style)
- **Premium effect libraries:**
  - `@shadergradient/react` (ruucm, 1.6k★) — animated WebGL gradients. Use for ambient backdrops in sections WITHOUT the molten cast video (About, Talk). Saves writing custom shaders.
  - `liquid-glass-js` (dashersw, 371★) — Apple-inspired liquid glass UI effects. Direct complement to our chrome aesthetic — apply to buttons / cards / modals in v4.
- Core: `motion` (Framer Motion), `gsap` with `@gsap/react`, `lenis`

**Component marketplaces (browse, then `npx shadcn add ...` or copy):**
- **21st.dev** — community UI components, big library of Marketing Blocks (heroes, pricing, testimonials, CTAs) + standard UI components (130 buttons, 102 inputs, 79 cards, 58 texts). Browse at https://21st.dev — no MCP, just browse-and-copy. Strong source for hero section variants alongside Skiper UI.

---

## What to do in the new session — bootstrap prompt

When the new session opens, the user should paste this prompt:

> Read `.planning/V4_CINEMA_PLAN.md` end-to-end, then read `MEMORY.md`. We're picking up the v4 "Cinema" sprint. Verify the Higgsfield MCP is connected by running `mcp__higgsfield__balance`. Verify ffmpeg is installed. Then enter plan mode and walk me through Phase 0 (asset generation) — show me the three Higgsfield prompts you'll use, confirm budget, then on my go, run all three generations back-to-back.

The new session should NOT re-discuss concept, branding, or design direction. All of that is locked in this document. Plan mode covers execution only — sequence, prompt confirmation, budget approval.

---

*v3.1 (live at alqode.com via main branch) remains the production site until v4 is verified and shipped. Do not push to main during v4 development.*
