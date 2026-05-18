# CLAUDE.md

> **This is the ONLY documentation file for this project.**
> If the codebase is wiped, this file alone should be enough to rebuild everything.
> Read this completely before making any changes.

---

## TABLE OF CONTENTS

1. [Project Identity](#1-project-identity)
2. [URLs & Access](#2-urls--access)
3. [Tech Stack](#3-tech-stack)
4. [Commands](#4-commands)
5. [Deployment](#5-deployment)
6. [File Structure (Complete)](#6-file-structure-complete)
7. [Brand Kit](#7-brand-kit)
8. [Single-Page Architecture](#8-single-page-architecture)
9. [Section-by-Section Blueprint](#9-section-by-section-blueprint)
10. [Content Source of Truth](#10-content-source-of-truth)
11. [Animation System](#11-animation-system)
12. [Scroll System](#12-scroll-system)
13. [Performance Contract](#13-performance-contract)
14. [Responsive Breakpoints](#14-responsive-breakpoints)
15. [SEO & Metadata](#15-seo--metadata)
16. [Images & Assets](#16-images--assets)
17. [How To Update Content](#17-how-to-update-content)
18. [Code Quality Standards](#18-code-quality-standards)
19. [Known Gotchas](#19-known-gotchas)
20. [Version History](#20-version-history)
21. [Testing Checklist](#21-testing-checklist)
22. [Future Roadmap](#22-future-roadmap)

---

## 1. PROJECT IDENTITY

| Field | Value |
|-------|-------|
| **Project Name** | Alqode Website |
| **Domain** | alqode.com |
| **Type** | Digital Systems Agency - Single-page conversion site |
| **Goal** | Convert visitors to WhatsApp leads |
| **Target Audience** | 90% mobile (South African SMBs) |
| **Owner** | Mohammed Hamdaan Dhaler |
| **Role** | Founder of Alqode |
| **Location** | Cape Town, South Africa |
| **Email** | alqodez@gmail.com |
| **WhatsApp** | +27 68 539 4482 (primary CTA) |
| **Instagram** | @alqode.dev |
| **GitHub** | alqode-dev |

### What This Site Does (v3.1)
- Single-page agency portfolio targeting WhatsApp lead generation
- **9 sections** (after merges): Hero → ClientLogos → TechMarquee → TheBuild → Work → About → System → Quickstart → Talk → Footer
- **Builder × Scene** visual direction: terminal/automation builder aesthetic (Direction A) + cinematic scroll-driven craft moments (Direction C)
- Dark theme (#0a0a0a) with terminal green (#10b981) primary, live-amber (#FFB81C) for active states
- About section is the ONLY light-background section (#f5f5f0) — editorial break with founder motto stamp at bottom
- Signature interactions:
  - Hero terminal "boot" sequence (typewriter + streamed log lines + italic-serif bracketed headline)
  - TheBuild pinned scroll-driven 5-node automation pipeline (GSAP, desktop only)
  - Work as horizontal scroll carousel of deployment cards
  - Custom `{ · }` cursor on desktop pointer devices
  - Cursor-following spotlight on Work + System tiles
  - Mobile sticky WhatsApp FAB
- No 3D, no WebGL, no particles — but GSAP ScrollTrigger is now used for TheBuild's pinned scroll
- All WhatsApp links UTM-tagged via `waUrl(source, text?)` helper

---

## 2. URLS & ACCESS

### Live Sites
| Environment | URL |
|-------------|-----|
| **Production** | https://alqode.com |
| **Backup/Preview** | https://alqode-website.vercel.app |

### Dashboards
| Service | URL |
|---------|-----|
| **GitHub Repo** | https://github.com/alqode-dev/alqode-website |
| **Vercel Dashboard** | https://vercel.com/alqodes-projects/alqode-website |
| **Namecheap DNS** | https://ap.www.namecheap.com/Domains/DomainControlPanel/alqode.com/advanceddns |

### DNS Configuration (Namecheap)
| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | 76.76.21.21 | Automatic |
| CNAME | www | cname.vercel-dns.com. | Automatic |

---

## 3. TECH STACK

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.18 | App Router, SSR, Image optimization, dynamic import for code-split TheBuild |
| **React** | 18.3.1 | UI framework |
| **TypeScript** | 5.7.2 | Strict mode |
| **Tailwind CSS** | 3.4.17 | Utility-first styling, extended palette + custom keyframes + custom timing functions |
| **Framer Motion** | 11.15.0 | Nav menu slide-in animation |
| **Lenis** | 1.1.18 | Smooth scroll, synced with GSAP ticker |
| **GSAP** | 3.15+ | **NOW USED in v3.0**: ScrollTrigger for TheBuild pinned section, ticker drives Lenis raf |
| **Lucide React** | 0.468.0 | Tree-shakeable icons |
| **@vercel/analytics** | 1.4.1 | Production analytics |

### Fonts (next/font/google)
- **Space Grotesk** — `font-sans` — body, UI, labels
- **Instrument Serif** — `font-display` — italic section headings, hero headline, project names, motto
- **JetBrains Mono** — `font-mono` — system tags, status pills, terminal boot output, form labels

### What We DON'T Use
- No Three.js / WebGL / Canvas
- No particles / physics / 3D models
- No heavy ScrollMagic / Locomotive (Lenis + GSAP suffices)
- No external CSS frameworks (Tailwind only)
- No CMS API calls at build time (all content hardcoded in `src/lib/constants.ts`)
- No backend (form submits to WhatsApp, not a server)

---

## 4. COMMANDS

```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Production build (includes TypeScript check)
npm run start      # Serve production build locally
npm run lint       # ESLint check
```

### Build Stats (as of v3.1, May 2026)
```
Route                    Size       First Load JS
/                        ~67 kB     ~204 kB
/_not-found              138 B      87.5 kB
/opengraph-image         0 B        0 B (edge runtime)
/sitemap.xml             0 B        0 B

Shared JS: 87.3 kB
TheBuild chunk: code-split via next/dynamic, loaded on demand
```
**Target: <200KB gzipped first load. Current: ~204KB.**
The 4KB over-target is the floor cost of the Lenis × GSAP ticker integration which is required for TheBuild's pinned ScrollTrigger to work alongside smooth scroll. Can't go lower without breaking that feature.

---

## 5. DEPLOYMENT

| Component | Service |
|-----------|---------|
| **Hosting** | Vercel (Hobby tier) |
| **Domain** | Namecheap (alqode.com) |
| **CDN** | Vercel Edge Network |
| **SSL** | Vercel auto-provisioned |
| **CI/CD** | Push to `main` = auto-deploy |

Every push to `main` triggers a Vercel deployment. PRs get preview URLs.

---

## 6. FILE STRUCTURE (COMPLETE) — v3.0

```
alqode-website/
├── public/
│   ├── favicon.svg                    # {A} icon, green brackets on void bg
│   ├── robots.txt                     # Allow all, links sitemap
│   └── images/
│       ├── founder.jpg                # Founder photo (About)
│       ├── masjid-notify.webp         # Masjid Notify screenshot (Work)
│       ├── faida-automation.webp      # FAIDA screenshot (Work)
│       ├── bochi-cafe.webp            # Bochi Croffle screenshot (Work)
│       ├── bochi.webp                 # Bochi fallback
│       ├── faida.webp                 # FAIDA fallback
│       └── clients/                   # Owner photos for testimonials
│           ├── bochi-owner.png
│           ├── faida-owner.png
│           └── trophy-owner.png
│
├── scripts/
│   └── compress-images.js             # Sharp-based one-shot PNG → WebP conversion
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root: 3 fonts (Space Grotesk, Instrument Serif, JetBrains Mono), metadata, Service+FAQ+Org JSON-LD, LenisProvider, Analytics
│   │   ├── page.tsx                   # Home assembly. ScrollProgress + CursorGlow + CursorFrame + Nav + 7 sections + Footer + ScrollToTop + WhatsappFab. TheBuild is dynamically imported (code-split).
│   │   ├── globals.css                # Tailwind + CSS easing variables + scanline overlay + spotlight-card + cursor-frame-active hide + prefers-reduced-motion + focus-visible
│   │   ├── not-found.tsx              # 404
│   │   ├── sitemap.ts                 # Dynamic XML sitemap
│   │   └── opengraph-image.tsx        # Edge runtime 1200x630 OG with terminal-green accents
│   │
│   ├── components/
│   │   │   --- Section components (7) ---
│   │   ├── nav.tsx                    # Sticky nav (Work / About / Process / Contact + WhatsApp CTA), mobile hamburger
│   │   ├── hero.tsx                   # Terminal "boot" sequence + italic-serif headline with { } bracketed line 2 + CTAs + LiveStatus mockup offer + Bracketed metadata footer
│   │   ├── client-logos.tsx           # "Building for businesses across SA + UAE" — 3 hand-traced SVG logos (Faida, Bochi, Trophy SA) single-row mobile, brand-color on hover
│   │   ├── tech-marquee.tsx           # CSS-only infinite scroll of all 16 tech logos w/ brand colors (Next.js, React, TS, Python, Tailwind, Supabase, n8n, Airtable, Vercel, Node, Meta, GitHub, JSON, WordPress, WooCommerce, PayFast text-tint)
│   │   ├── the-build.tsx              # NEW v3.0 — THE SIGNATURE: pinned GSAP ScrollTrigger section. 5 nodes (Form → Automation → WhatsApp → Calendar → Revenue) activate as you scroll. Mobile fallback: auto-play on entry, no pin.
│   │   ├── work.tsx                   # 4 deployment cards (Masjid Notify, FAIDA, Bochi Croffle, Trophy SA) in 2-col grid. Each card: scanline-overlay screenshot + live-status badge + deploy ID overlay + integrated user-feedback footer (testimonial) OR community-deployment footer (Masjid Notify). Cursor-following spotlight on hover.
│   │   ├── about.tsx                  # Light-bg break section. `> founder.profile` tag + italic-serif heading + founder photo + 3 paragraphs + credentials strip + "Work with us" CTA. useScrollRevealDramatic.
│   │   ├── system.tsx                 # NEW v3.0 — merged Process + Retainer. Header → Beat A: "first weeks" 4-step pipeline → transition marker → Beat B: "every month after" subscription dashboard panel (4 pillar tiles with accent borders) → closer + CTA.
│   │   ├── quickstart.tsx             # "Start fast" — "Get a mockup (24h)" + "Get a quote (1h)" dual-CTA cards. Big italic-serif timing badges.
│   │   ├── talk.tsx                   # NEW v3.0 — merged FAQ + Contact. Header + 2-col layout: FAQ accordion (left, 5/12) + WhatsApp primary CTA + terminal-styled form with typing animation (right, 7/12) + location + email footer.
│   │   ├── footer.tsx                 # 3-col: logo + nav + connect (social icons)
│   │   │   --- Primitives (v3.0) ---
│   │   ├── primitives/bracketed.tsx   # <Bracketed> wraps content in {alqode}-style { } terminal-green brackets
│   │   ├── primitives/live-status.tsx # <LiveStatus variant="live|active|alert|ok" pulse?> — dot + mono label; pulse is opt-in
│   │   ├── primitives/mono-tag.tsx    # <MonoTag variant="terminal|amber|white|muted"> — small uppercase mono label
│   │   │   --- Atmosphere + utility ---
│   │   ├── client-logos-svg.tsx       # Hand-traced FaidaIcon + BochiIcon (basket-weave) + TrophyBadgeIcon + ClientMiniLogo composite for testimonials
│   │   ├── tech-icons.tsx             # 16 inline SVG brand logos + TECH_COLORS map (PayFast = text-tint, no icon)
│   │   ├── cursor-glow.tsx            # Desktop ambient radial green glow following mouse
│   │   ├── cursor-frame.tsx           # NEW v3.0 — custom desktop cursor: { · } bracket pair tracking pointer. Expands on hover over interactive elements. Hides native cursor via html.cursor-frame-active.
│   │   ├── scroll-progress.tsx        # NEW v3.0 — 2px terminal-green fixed top bar tracking document scroll progress
│   │   ├── scroll-to-top.tsx          # Fixed button after 600px scroll
│   │   ├── whatsapp-fab.tsx           # Sticky floating green WhatsApp circle (mobile only, appears after 200px scroll). Tailwind animate-ping halo.
│   │   └── lenis-provider.tsx         # Lenis smooth scroll wrapped in GSAP × ScrollTrigger sync (gsap.ticker drives Lenis.raf, lenis.on('scroll', ScrollTrigger.update))
│   │
│   └── lib/
│       ├── constants.ts               # ALL copy — SITE, NAV_LINKS, HERO (boot/headline/CTAs/mockup/metadata), CLIENTS, QUICKSTART, PORTFOLIO (with deployedSince + category per project), TESTIMONIALS, ABOUT, PROCESS, RETAINER, THE_BUILD, FAQ, CONTACT, FOOTER. Exports waUrl(source, text?) helper for tracked WhatsApp links.
│       ├── animations.ts              # useScrollReveal + useScrollRevealDramatic (IntersectionObserver-based stagger reveals)
│       └── decrypt.ts                 # useDecryptOnHover (legacy — only used in About v2.x; new Hero dropped it)
│
├── CLAUDE.md                          # THIS FILE
├── package.json                       # Deps: next 14, react 18, tailwind 3.4, framer-motion, lenis, gsap, lucide-react, @vercel/analytics
├── tsconfig.json                      # TypeScript strict, @/* alias
├── tailwind.config.ts                 # Brand palette (void/terminal/live-amber/signal-red/bone/muted/...), 3 font families (sans/display/mono), snap/out-quart/spring-soft easings, live-pulse/scanline/fade-up animations
├── postcss.config.mjs                 # Tailwind + autoprefixer
├── next.config.mjs                    # Image formats: avif + webp
├── .eslintrc.json                     # next/core-web-vitals
└── .gitignore                         # Next.js patterns
```

---

## 7. BRAND KIT (v3.1)

### Colors
| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| **void** | `#0a0a0a` | `bg-void`, `text-void` | Page background, CTA text |
| **terminal** | `#10b981` | `bg-terminal`, `text-terminal` | Accent green, CTAs, live status, headline highlights |
| **live-amber** *(v3.0)* | `#FFB81C` | `bg-live-amber`, `text-live-amber` | Active/in-progress states (e.g., The Build active nodes, community deployments) |
| **signal-red** *(v3.0)* | `#FF4D4D` | `bg-signal-red`, `text-signal-red` | Alerts, errors. Used sparingly — currently no production usage; reserved. |
| **bone** *(v3.0)* | `#F5F1EA` | `bg-bone`, `text-bone` | Editorial alternative warm off-white (intended for editorial moments; About uses `light-bg` which is functionally identical) |
| **white** | `#ffffff` | `text-white` | Primary text on dark |
| **muted** | `#666666` | `text-muted` | Secondary text, labels |
| **light-bg** | `#f5f5f0` | `bg-light-bg` | About section background |
| **light-muted** | `#444444` | `text-light-muted` | Body text on light bg |
| **card-bg** | `#161616` | `bg-card-bg` | Card backgrounds |
| **border** | `#2a2a2a` | `border-border` | Card/section borders |
| **dim-bg** | `#111111` | `bg-dim-bg` | Footer + node bg |

### Typography (Trinity)
| Element | Font | Weight | Tailwind | Usage |
|---------|------|--------|----------|-------|
| Body / UI | Space Grotesk | Variable | `font-sans` | Default for body, paragraphs, labels |
| **Display** *(v3.0)* | Instrument Serif (italic) | 400 | `font-display` | All section h2 headings (italic by default), hero headline, project names, motto |
| **Mono** *(v3.0)* | JetBrains Mono | 400/500/700 | `font-mono` | System tags (`> deployed.services`), MonoTag primitive, status pills, terminal boot output, form labels via Bracketed |

All fonts loaded via `next/font/google` in `layout.tsx` with `display: "swap"`. CSS variables wired through `<html>` className: `--font-space-grotesk`, `--font-instrument-serif`, `--font-jetbrains-mono`.

### Transition timing curves (CSS vars + Tailwind tokens)
- `--ease-snap` / `ease-snap` — `cubic-bezier(.16, 1, .3, 1)` — Linear/Vercel-style snap. Primary easing. Replaces `ease-out` in all v3 components.
- `--ease-out-quart` / `ease-out-quart` — `cubic-bezier(.25, 1, .5, 1)`
- `--ease-spring-soft` / `ease-spring-soft` — `cubic-bezier(.34, 1.56, .64, 1)` — slight overshoot

### Custom animations
- `animate-live-pulse` — 2.4s scale 1→2.2 + opacity 0.35→1 ease-snap loop. Used on live status halos. Opt-in only via `<LiveStatus pulse>`.
- `animate-scanline` — 3s linear translateY -100% → 100% (defined but currently unused; reserved for future use)
- `animate-fade-up` — 0.6s entry: translateY 12px → 0 + opacity 0 → 1
- `animate-cursor-blink` — 530ms 0→1 opacity loop (legacy from v2, used in form typing cursor)
- `animate-ping` — Tailwind default. Used on mobile WhatsApp FAB only.
- `.marquee-track` — 30s linear infinite translateX 0→-50% (Tech marquee)

### Logo
- Display format: `{alqode}` — green brackets, white text
- Code: `<span className="text-terminal">{"{"}</span>alqode<span className="text-terminal">{"}"}</span>`
- Favicon: `public/favicon.svg` — `{A}` icon, green brackets on void background

### v3 visual signature elements
- **{alqode}-style brackets** as structural element via `<Bracketed>` primitive. Wrap section labels, status pills, metadata, motto labels.
- **Mono uppercase tags** via `<MonoTag>` primitive: section identifiers like `> deployed.services`, `▸ user feedback`, `/sys.01`.
- **Italic-serif section headings** at `clamp(2rem,5.5vw,4rem)` or larger.
- **Scanline overlays** on Work card screenshots (subtle, 18% black at 3px intervals, mix-blend-mode multiply).
- **Cursor-following spotlight** on hover for Work cards + System dashboard tiles (450px radial green at 9% opacity tracking mouse position via CSS variables).
- **Custom `{ · }` cursor** (CursorFrame) replaces native cursor on desktop pointer devices.

### Section text sizes (responsive — v3.1)
- Section h2 (italic serif): `text-[clamp(2rem,5.5vw,4rem)]` (32–64px)
- Hero headline (italic serif): `text-[clamp(2.25rem,7.5vw,5.5rem)]` (36–88px)
- About motto (italic serif rotated): `text-[clamp(1.75rem,5vw,3.5rem)]` (28–56px)
- Section subline: `text-sm md:text-base text-muted leading-relaxed`
- Body: `text-sm` (14px) to `text-base` (16px)
- Mono tags: `text-[10px]` to `text-xs` (10–12px) tracking-[1px] uppercase
- Status pill text: `text-[10px]` to `text-xs`

---

## 8. SINGLE-PAGE ARCHITECTURE (v3.1)

The site is one page (`src/app/page.tsx`). Builder × Scene direction.

**Global overlays (rendered outside <main>, fixed-positioned):**
- `<ScrollProgress />` — 2px terminal-green bar at top of viewport, fills as you scroll
- `<CursorGlow />` — desktop only ambient mouse-following radial green
- `<CursorFrame />` — desktop only custom cursor: `{ · }` brackets tracking pointer
- `<Nav />` — sticky top nav
- `<ScrollToTop />` — fixed bottom-right after 600px scroll
- `<WhatsappFab />` — mobile only sticky bottom-right WhatsApp circle

**Section order (inside <main>):**

```
┌─────────────── Nav (sticky, z-50) ────────────────┐
│ {alqode} logo   Work About Process Contact   CTA  │
│ Mobile: logo + small CTA + hamburger              │
└───────────────────────────────────────────────────┘

┌─────────────── Hero ─────────────────────────────┐
│ Terminal "Boot" sequence:                         │
│   ▸ alqode.init  [typed character-by-character]  │
│   ✓ business scanned                              │
│   ✓ friction mapped                               │
│   ✓ system online · accepting projects            │
│                                                   │
│ Italic-serif headline (clamp 2.25rem-5.5rem):    │
│   We don't build websites.                        │
│   { We build machines that make you money. }      │
│   (line 2: terminal green, bracketed in mono)     │
│                                                   │
│ Subline + Primary CTA (WhatsApp) + Secondary      │
│ ● LiveStatus mockup offer (pulse)                 │
│ Bracketed metadata strip: {CT}{UAE}{booking·may}  │
│ Background: dot-grid + terminal glow + mouse-     │
│   tracking dot-grid-glow (desktop)                │
│ min-h: 88vh mobile / 100vh desktop                │
└───────────────────────────────────────────────────┘
                   gradient-divider

┌─────────────── ClientLogos ──────────────────────┐
│ "Building for businesses across SA + UAE"         │
│ 3 hand-traced SVG logos in single row             │
│ Mobile: smaller, no wrap. Desktop: bigger         │
│ Monochrome → brand color + scale on hover         │
└───────────────────────────────────────────────────┘

┌─────────────── TechMarquee ──────────────────────┐
│ CSS-only infinite horizontal scroll               │
│ 16 tech logos with brand colors                   │
│ PayFast: text-only pill (no icon)                 │
│ Border-y, paused on hover                         │
└───────────────────────────────────────────────────┘

┌─────────────── TheBuild ─────────────────────────┐
│ ** HIDDEN ON MOBILE (hidden lg:block) **          │
│                                                   │
│ Signature pinned scroll moment (GSAP ScrollTrigger)│
│                                                   │
│ Header:                                           │
│   { The Build }                                   │
│   Watch a system being deployed.                  │
│                                                   │
│ 5 nodes activated as user scrolls (pinned):       │
│   [Form] → [Automation] → [WhatsApp] → [Cal] → [+]│
│   Each node: idle (muted gray) → active (amber    │
│   pulse) → done (solid terminal green).           │
│   SVG connecting lines draw between nodes.        │
│                                                   │
│ Bottom: 0% → 100% deployment counter (italic      │
│ serif big) + progress bar terminal→amber gradient │
└───────────────────────────────────────────────────┘

┌─────────────── Work (#work) ─────────────────────┐
│ Header:                                           │
│   > deployed.services                             │
│   Built by {alqode}  { N active }                 │
│   Real systems. Real businesses. Real voices.    │
│   ← → arrow buttons (desktop)                     │
│                                                   │
│ HORIZONTAL SCROLL CAROUSEL:                       │
│   Each card 86vw mobile / 440-540px desktop       │
│   scroll-snap: x mandatory                        │
│   Scrollbar hidden via .scrollbar-hide            │
│                                                   │
│ Each "deployment card":                           │
│   • Screenshot (200-230px h) with scanline overlay│
│   • Top-left: LiveStatus { live · since YYYY }    │
│     (or amber community · since YYYY for Masjid)  │
│   • Top-right (desktop): [deploy:id-NN] MonoTag   │
│   • On hover: Open ↗ CTA lifts in bottom-right    │
│   • Italic-serif project name (28px)              │
│   • Green result line + description               │
│   • Tag pills (green bg) + tech pills (brand      │
│     color for text-only pills like PayFast)       │
│   • Footer: integrated user-feedback testimonial  │
│     OR { community deployment } for Masjid Notify │
│   • Cursor-following spotlight on hover           │
│                                                   │
│ Handles N projects gracefully (5th, 6th...)       │
└───────────────────────────────────────────────────┘

┌─────────────── About (#about) ───────────────────┐
│ ** LIGHT BACKGROUND (#f5f5f0) **                  │
│                                                   │
│ > founder.profile                                 │
│ The person behind the code  (italic serif)        │
│                                                   │
│ Desktop: photo 40% left, text 60% right           │
│ Mobile: photo above, text below                   │
│ 3 paragraphs (was 5, tightened):                  │
│   1. Bold+highlight intro (founder identifier)    │
│   2. Standalone punch: "So I built the systems."  │
│   3. Body: what {alqode} exists to do             │
│ Bottom of text col: credentials strip + CTA       │
│   { Cape Town · SA + UAE · Booking now }          │
│   [ Work with us → ]                              │
│                                                   │
│ FOUNDER MOTTO STAMP (bottom of section):          │
│   [ founder.motto ]  (mono uppercase label)       │
│   "Our job is to make you so successful,          │
│    your competitors run out of business."         │
│   (italic serif huge, rotated -1deg, terminal     │
│    green slash underneath)                        │
└───────────────────────────────────────────────────┘

┌─────────────── System (#system) ─────────────────┐
│ > system.lifecycle                                │
│ Build. Stay. Compound.  (italic serif)            │
│                                                   │
│ Beat A: "▸ first weeks · how we build" tag        │
│   4 numbered process nodes in horizontal row      │
│   (desktop) / stacked (mobile), gradient line     │
│   connecting them on desktop                      │
│                                                   │
│ Beat B: "▸ every month after · how we stay" tag   │
│   Subscription dashboard panel:                   │
│   • Top bar: LiveStatus "subscription · active"   │
│     (pulse) + MonoTag "monthly · ongoing"         │
│   • 2x2 grid of pillar tiles:                     │
│     - Different left-border accent per tile       │
│       (terminal, amber, terminal/70, amber/70)    │
│     - /sys.01-04 mono labels                      │
│     - Italic serif title + body description       │
│     - Cursor-following spotlight on hover         │
│                                                   │
│ Closer: "Our job isn't to ship a site and         │
│   disappear." + [ Get me on retainer → ]          │
│ Background: soft terminal radial glow blur        │
└───────────────────────────────────────────────────┘
                   gradient-divider

┌─────────────── Quickstart ───────────────────────┐
│ Start fast                                        │
│ Proof. Not promises.                              │
│ Projects from R8,000                              │
│                                                   │
│ 2 cards: Get a mockup (24h) | Get a quote (1h)    │
│ Big italic-serif timing badges                    │
│ Each clicks WhatsApp with pre-filled message      │
└───────────────────────────────────────────────────┘
                   gradient-divider

┌─────────────── Talk (#contact) ──────────────────┐
│ > talk.to_us                                      │
│ Let's talk.  (italic serif)                       │
│                                                   │
│ 12-col grid (mobile: stacks):                     │
│                                                   │
│ LEFT (5/12): ▸ common questions                   │
│   FAQ accordion (5 items, first open by default)  │
│   Plus/minus toggle, slide-down content           │
│                                                   │
│ RIGHT (7/12):                                     │
│   ▸ fastest path                                  │
│   [WhatsApp full-width green CTA →]               │
│                                                   │
│   ▸ or send a message                             │
│   Form (terminal-styled):                         │
│   • Bracketed mono labels: { name }, { email },   │
│     { project }                                   │
│   • Inputs use card-bg + mono font + terminal     │
│     focus rings                                   │
│   • Typing animation plays on name + project      │
│     fields until user interacts (Cape Town cafe,  │
│     Joburg plumber, Durban boutique, ...)         │
│   • Submit "▸ deploy to WhatsApp" opens WhatsApp  │
│     with all field values pre-filled in message   │
│                                                   │
│   Bottom: location + email mono details           │
└───────────────────────────────────────────────────┘

┌─────────────── Footer ───────────────────────────┐
│ 3-col grid (mobile stacks):                       │
│ Logo + tagline | Navigate links | Connect icons  │
│ Bottom: divider + copyright                       │
└───────────────────────────────────────────────────┘
```

**Gradient dividers** appear between: Hero→ClientLogos, ClientLogos→TechMarquee (implicit via border-y), System→Quickstart, Quickstart→Talk. ClientLogos→TechMarquee→TheBuild→Work→About→System chain has no dividers (smooth flow). About→System chain uses the light→dark color shift as visual divider.

```html
<div className="gradient-divider mx-5" />
```
CSS: `height: 1px; background: linear-gradient(90deg, transparent, #2a2a2a, transparent);`

---

## 9. SECTION-BY-SECTION BLUEPRINT (v3.1)

### 9.1 Nav (`src/components/nav.tsx`)

**Behavior:**
- Fixed top, z-50. Transparent on load, gains `bg-void/80 backdrop-blur-xl border-b border-border/50` after 20px scroll
- Smooth scroll to section on nav link click via `scrollIntoView({ behavior: "smooth" })`

**Desktop (lg+):**
- Logo left, 4 nav links (Work, About, Process, Contact), green CTA "Get a system built" → `waUrl("nav_desktop")`

**Mobile (<lg):**
- Logo left, small CTA `waUrl("nav_mobile")` + hamburger right
- Hamburger opens full-screen overlay (Framer Motion `AnimatePresence`, slide from right, 0.3s tween easeOut)
- Body overflow lock while open
- Links stagger in (0.1s delay each, fade+slide up)
- Full-width "Get a system built" CTA at bottom → `waUrl("nav_mobile_menu")`

### 9.2 Hero (`src/components/hero.tsx`) — Boot v3.0

**Layout:** `min-h-[88vh] md:min-h-screen flex items-center dot-grid`. Mouse-tracking dot-grid-glow (desktop only). Background `glow-terminal` radial.

**Animation sequence (runs once on mount):**
1. **Boot command line** types character-by-character at 60ms/char: `▸ alqode.init` (▸ in terminal green, rest in white/90, blinking cursor while typing)
2. **Streamed boot lines** appear sequentially 280ms after command done, then 180ms between:
   - `✓ business scanned`
   - `✓ friction mapped`
   - `✓ system online · accepting projects`
   (All in `text-terminal/80`, mono, with transitionX from `-6px` to `0` on appear)
3. **Headline reveals word-by-word** 420ms after last boot line:
   - Line 1 in italic serif (font-display): `We don't build websites.` — words stagger at 60ms each, translateY 14px → 0, opacity 0 → 1
   - Line 2 in italic serif terminal-green, wrapped in mono `{` `}` brackets that fade in at start/end of line 2
4. **Subline** fades in 250ms after last word
5. **CTAs** fade 180ms after subline
6. **Mockup offer (LiveStatus with pulse)** 100ms delay after CTAs
7. **Metadata footer** (3× `<Bracketed>` items in mono + "Founded by Mohammed Hamdaan Dhaler") fades in 200ms after CTAs

**Headline size:** `text-[clamp(2.25rem,7.5vw,5.5rem)]` — much bigger than v2 (was 28-56px, now 36-88px).

**CTAs:**
- Primary: `bg-terminal text-void` "Get a system built" + ArrowRight → `waUrl("hero_primary")`
- Secondary: bordered "See our work" + ArrowDown → `#work` smooth scroll

**Mockup offer line:** `<LiveStatus pulse>` showing "Free mockup in 24h. No obligation." + green `Request a mockup →` mono CTA → WhatsApp with pre-filled text via `HERO.mockupOffer.href`.

**Decrypt-on-hover hook:** REMOVED in v3.0 (didn't fit the compiled/terminal aesthetic).

### 9.3 ClientLogos (`src/components/client-logos.tsx`)

**Position:** Right after Hero. Trust strip.

**Layout:**
- Section padding: `py-14 md:py-20`
- Label: "Building for businesses across SA + UAE" (10px-xs mono uppercase muted)
- 3 logos in **flex-nowrap** single row (no wrap on mobile, fits 375px)
- Gaps: `gap-x-5 sm:gap-x-10 md:gap-x-20 lg:gap-x-24`

**Logo components** (`client-logos-svg.tsx`):
- `<FaidaLogo>` — 8-petal asterisk + house cutout + "faida" wordmark. Brand: `#7B5BE5`. URL: `faida.ae`
- `<BochiLogo>` — basket-weave-textured ellipse + 3 pearl dots + "bochi" wordmark + small "croffle" tagline. Brand: `#7B1818`. URL: `bochinsh.com`
- `<TrophyLogo>` — trophy badge (ring + 5 stars + cup + handles + base) + "Trophy SA" uppercase. Brand: `#B8895A`. URL: `trophysa.co.za`

**Sizing (responsive):**
- Icons: `h-6 sm:h-9 md:h-11` (smaller on mobile to fit single row)
- Wordmarks: `text-base sm:text-2xl md:text-3xl`

**Hover:**
- Default `text-white/55`
- Hover: color → `var(--brand-color)` from inline style, scale-105
- CSS rule `.client-logo-link:hover { color: var(--brand-color); }`

### 9.4 TechMarquee (`src/components/tech-marquee.tsx`)

**Position:** Directly under ClientLogos (no divider between).

**Layout:** `py-5 md:py-6 border-y border-border/30 overflow-hidden`. CSS-only infinite scroll via `@keyframes marquee { translateX 0 → -50% }` on `.marquee-track`, 30s linear infinite. Pauses on hover.

**Content:** 16 tech labels, each with icon (if available in `TECH_ICON_MAP`) tinted to its `TECH_COLORS` brand color. For techs without an icon (PayFast), the text itself gets tinted to its brand color.

**TECHS list:** Next.js, React, TypeScript, Python, Tailwind, Supabase, n8n, Airtable, Vercel, Node.js, Meta, GitHub, JSON, WordPress, WooCommerce, PayFast

### 9.5 TheBuild (`src/components/the-build.tsx`) — Signature pinned scroll v3.0

**HIDDEN ON MOBILE** via `hidden lg:block` class on the section. GSAP/ScrollTrigger never runs on phones. Desktop only.

**Position:** Between TechMarquee and Work.

**Tech:** GSAP `ScrollTrigger.pin` synced with Lenis via `gsap.ticker` (LenisProvider integration).

**Layout (desktop):**
- Pinned wrapper: `min-h-[88vh] lg:min-h-screen flex flex-col justify-center`
- Pin duration: 2200px of scroll (`end: "+=2200"`)
- `scrub: 0.6` — animation tied to scroll position with light smoothing

**Header:** `> The Build` bracketed (mono) tag, italic serif heading "Watch a system being deployed.", subline.

**Pipeline:** 5 nodes from `THE_BUILD.nodes` (Form → Automation → WhatsApp → Calendar → Revenue). Each node card has:
- Number label (`node 01` etc., mono, color shifts: muted idle → amber active → terminal done)
- Status dot (top-right): muted → pulsing amber → solid terminal
- Lucide icon (FileText / Zap / MessageCircle / Calendar / TrendingUp) with bg tint that matches state
- Title + caption
- Bracketed mono status text (`pending` → state-specific verb → completion verb)

**SVG lines:** Connect each node to next. Initially `strokeDasharray = length, strokeDashoffset = length` (invisible). GSAP `tl.to(line, { strokeDashoffset: 0 })` draws them in as scroll progresses.

**Counter & progress bar:** Bottom shows `0% deployed` mono label, big italic-serif percentage (counter), and a thin progress bar `from-terminal via-terminal to-live-amber` gradient. All driven by GSAP onUpdate.

**Closing line:** `✓ Multiply this across every customer. While you sleep.`

**Mobile fallback (if ever shown):** No pin. Triggers on `start: "top 75%"` and auto-plays sequence using same node-state updates + counter animation in 2.5 seconds.

### 9.6 Work (`src/components/work.tsx`) — Carousel v3.1

**Position:** Right after TheBuild on desktop, after TechMarquee on mobile.

**Format:** Horizontal scroll carousel (not a 2x2 grid). Handles N projects gracefully — add a 5th, 10th client and the layout doesn't break. User specifically requested this in v3.1 because grids feel "gallery" and don't scale.

**Header:**
- `> deployed.services` (terminal mono tag)
- Italic-serif "Built by {alqode}" + bracketed `{ N active }` count
- Subline: "Live in production. Real businesses. Real voices." + "← swipe →" hint on desktop
- Desktop only: ← → arrow buttons that `scrollBy(±560)` the track ref

**Carousel mechanics:**
- `<div ref={trackRef} className="overflow-x-auto snap-x snap-mandatory scrollbar-hide">`
- `.scrollbar-hide` utility kills native scrollbar
- Negative horizontal margin + matching padding lets cards bleed to edge while keeping container padding
- Cards: `snap-start flex-shrink-0 w-[86vw] sm:w-[440px] md:w-[500px] lg:w-[540px]`
- Trailing 1px spacer so last card snap-aligns

**Each deployment card (`<DeploymentCard>`):**

Screenshot area (200-230px h, bg-dim-bg, scanline-overlay class):
- Top-left overlay: `<LiveStatus>` showing `live · since {YYYY}` (terminal green) OR `community · since {YYYY}` (amber for Masjid Notify)
- Top-right overlay (desktop): `[deploy:{slug}-{NN}]` MonoTag
- Hover: green "Open ↗" CTA lifts in from bottom-right
- Image: `<Image>` with object-cover, hover scale-1.03, scanline overlay via `.scanline-overlay::after` pseudo-element
- Fallback if no image: gradient placeholder with italic-serif project name centered

Content area:
- Italic-serif project name (28px)
- Green `result` line (terminal, semibold)
- Description (muted)
- Tag pills (terminal/15 bg) + Tech pills (brand color text + border for icon-less techs, or icon-prefix for known ones)

Footer (inside same card, separated by `border-t border-white/[0.06]`):
- IF testimonial exists: `▸ user feedback · verified` mono header, quote text, avatar + name + role + client mini-logo as visit link
- IF no testimonial (Masjid Notify): `{ community deployment } · public access` mono header, then "No client. No invoice. Built and maintained as a service to the community."

**Cursor-following spotlight:** Each card has `spotlight-card` class. `onMouseMove` sets `--mouse-x` / `--mouse-y` CSS vars; `.spotlight-card::before` shows a 450px radial gradient of terminal-green at 9% that tracks the cursor.

**Hover physics:** Card lifts `-translate-y-0.5` + soft green shadow on hover.

**Projects (from constants.ts PORTFOLIO.projects):**
1. **Masjid Notify** — community deployment, since 2025, `/images/masjid-notify.webp`
2. **FAIDA** (UAE) — client, since 2024, `/images/faida-automation.webp` + `/images/faida.webp` fallback
3. **Bochi Croffle** — client, since 2025, `/images/bochi-cafe.webp` + `/images/bochi.webp` fallback
4. **Trophy SA** — client, since 2025, image=null (renders branded placeholder until screenshot is captured)

### 9.7 About (`src/components/about.tsx`) — v3.1 with founder.motto stamp

**THE LIGHT-BACKGROUND SECTION:** `bg-light-bg` (#f5f5f0), text `text-void`.

**Layout:**
- `> founder.profile` mono tag above heading (in void/60 — works on light bg)
- Italic-serif heading "The person behind the code" at `clamp(2.25rem,5.5vw,4rem)`
- Desktop: photo 40% left, text 60% right. Mobile: photo above, text below

**Photo:** Aspect 4:5, rounded-xl, object-cover, `/images/founder.jpg`. onError hides element.

**Paragraphs (3 total in v3.x — was 5 in v2.x):**
1. **Bold + highlight intro:** "I'm Mohammed Hamdaan Dhaler, founder of {alqode}. I build systems for businesses bleeding time and money on things that should run themselves — receptionists who can't answer at lunch, sales teams filling forms software could handle in seconds."
2. **Bold standalone punchline:** "So I built the systems." (text-xl md:text-[22px])
3. **Regular body:** "{alqode} exists to give businesses the tools that actually move the needle — machines that generate leads, automate workflows, and work at 2am when nobody else does. Every project gets the same treatment: built fast, built right, built to last."

**`useScrollRevealDramatic` hook** drives the paragraph cascade: 32px translateY, 0.25s stagger between items, 0.8s duration, threshold 0.15, rootMargin `-80px`.

**Decrypt-on-hover (v2 legacy):** Still applied to revealed paragraphs (`p[data-revealed]`). Desktop hover triggers character-by-character scramble/resolve effect. Only fires after the paragraph has revealed.

**Credentials strip + CTA (bottom of right column):**
- Strip: `Cape Town · SA + UAE · Booking now` (mono uppercase, light-muted)
- Button: black "Work with us" + ArrowRight → `waUrl("about_cta")`

**FOUNDER MOTTO STAMP (v3.1, bottom of section):**
- `[ founder.motto ]` mono label (void/40, 2.5px tracking)
- Big italic-serif quote at `clamp(1.75rem,5vw,3.5rem)`:
  > "Our job is to make you so successful, your competitors run out of business."
- Punch portion ("your competitors run out of business") is `not-italic font-bold text-terminal`
- Entire block rotated `-1deg` via inline transform, `transformOrigin: left center`
- Terminal-green slash underneath: `h-[3px] w-24 md:w-36 bg-terminal/70` also at -1deg

This is the relocated punchline from v3.0 System closer. Moved here because users were scrolling past it in System.

### 9.8 System (`src/components/system.tsx`) — Process + Retainer merged v3.0/v3.1

**Position:** Right after About. Combines the old Process and Retainer sections (cut from 2 sections to 1 to reduce scroll).

**Background:** `section-padding relative overflow-hidden` with centered radial glow `w-[700px] h-[700px] bg-terminal/[0.04] blur-[140px]` for visual differentiation.

**Header:**
- `> system.lifecycle` (mono tag, terminal)
- Italic-serif "Build. Stay. Compound." at `clamp(2.25rem,6vw,4.5rem)`
- Subline: "From first message to live system — and every month after. The full lifecycle, on autopilot."

**Beat A — "▸ first weeks · how we build":**
- Just a MonoTag (no trailing gradient line in v3.1 — removed for less visual noise)
- 4-node pipeline grid (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-5`)
- Each node: numbered circle (terminal border, void bg, terminal-bold number) + title + description
- Desktop only: gradient horizontal line connecting node circles (`from-terminal/60 via-terminal/60 to-terminal/15`)
- Steps from `PROCESS.steps`: Discovery, Design, Build, Support

**Beat B — "▸ every month after · how we stay":**
- MonoTag only (no trailing line in v3.1)
- Subscription dashboard panel: `rounded-2xl border border-border bg-card-bg/60 backdrop-blur-sm p-6 md:p-8`
  - Top bar: `<LiveStatus pulse>` "subscription · active" (size md) + `<MonoTag>` "monthly · ongoing"
  - 2x2 grid of 4 pillar tiles:
    - Each tile has a different left-border accent: terminal / live-amber / terminal/70 / live-amber/70
    - Top of tile: `<MonoTag variant="terminal">/sys.0X</MonoTag>` + `<MonoTag variant="muted">ongoing</MonoTag>`
    - Italic-serif title (xl/2xl) + body description (sm muted)
    - Cursor-following spotlight on hover via `.spotlight-card`
  - Pillars from `RETAINER.pillars`: Always live / Always growing / Always refreshed / Always ahead

**Closer (v3.1 — simplified):**
- Single line: "Our job isn't to ship a site and disappear." (text-base md:text-lg, muted)
- CTA: terminal-green "Get me on retainer" + ArrowRight → `waUrl("retainer")`
- The aggressive motto ("your competitors run out of business") was moved to About in v3.1 because it got buried here.

### 9.9 Quickstart (`src/components/quickstart.tsx`)

**Position:** Between System and Talk.

**Header:**
- "Start fast" mono tag (terminal)
- Italic-serif heading: "Proof. Not promises." at `clamp(2rem,5vw,3.5rem)`
- Subline: "Pick your entry point. Free, fast, no commitment. Projects start from R8,000 — you see what you're getting before you pay a cent."

**Layout:** 2-card grid `md:grid-cols-2` (1-col mobile), each card `p-7 md:p-10 rounded-2xl border border-border bg-card-bg`.

**Each card:**
- Top-right ETA badge: `<Clock size={16} />` + italic-serif huge number ("24h" / "1h") in terminal green at `text-3xl md:text-4xl` extrabold
- Title: extrabold "Get a mockup" / "Get a quote"
- Description (muted)
- Bottom CTA: bold terminal-green text + ArrowRight that expands gap on hover
- Whole card is a link → WhatsApp with pre-filled message via `waUrl("quickstart_mockup", ...)` / `waUrl("quickstart_quote", ...)`

### 9.10 Talk (`src/components/talk.tsx`) — FAQ + Contact merged v3.0/v3.1

**Position:** Final content section before Footer. Replaces separate FAQ and Contact sections (cut to reduce scroll).

**Header:**
- `> talk.to_us` mono tag
- Italic-serif "Let's talk." at `clamp(2.25rem,6vw,4.5rem)`
- Subline: "One message away from a system that changes how your business runs."

**Layout:** `grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12`. Mobile stacks (FAQ above form). Desktop: FAQ left 5/12, form right 7/12.

**LEFT (col-span-5) — FAQ accordion:**
- `▸ common questions` MonoTag (no trailing line in v3.1 — removed)
- Items from `FAQ.items` (5 questions, first open by default)
- Each item: button with question text + Plus/Minus icon. On click, `setOpenIndex` toggles. Content area uses `maxHeight: 500px` + opacity transition.
- Questions cover: speed, cost, geography, retainer, mockup process

**RIGHT (col-span-7):**

Top — "▸ fastest path":
- Full-width green CTA button "Message us on WhatsApp" with MessageCircle icon + mono "→" → `waUrl("talk_whatsapp")`
- Hover: gap expansion

Middle — "▸ or send a message":
- Form (3 fields + submit), terminal-styled:
  - Labels are `<MonoTag>` with `<Bracketed tight>` content: `{ name }`, `{ email }`, `{ project }`
  - Inputs: `bg-card-bg`, `border-border`, `font-mono` for typed text, `focus:border-terminal/60` ring
  - Project field is a 3-row textarea
- **Submit button (v3.1):** "▸ deploy to WhatsApp" with Send icon. Terminal-bordered styling.
- **Form submission (v3.1):** No more mailto. `handleSubmit` builds a message from `name + email + project` values and opens WhatsApp via `waUrl("talk_form", message)`. The form is intentionally a low-friction WhatsApp message builder.

**SIGNATURE TYPING ANIMATION** (preserved from v2):
- On Name + Project fields, animated placeholder text cycles through `CONTACT.typingCycles`:
  - "Cape Town cafe" → "Loyalty system + WhatsApp orders"
  - "Joburg plumber" → "Lead capture + booking automation"
  - "Durban boutique" → "E-commerce store + Instagram sync"
  - "Your business" → "What needs to run itself?"
- Per-cycle sequence: type Name (80ms/char) → 300ms pause → type Project (80ms/char) → 2000ms pause → delete Project (40ms/char reverse) → delete Name (40ms/char reverse) → 500ms pause → next cycle
- Terminal-green 1px cursor blinks on the `activeField` at 530ms via `animate-cursor-blink`
- Async/await with cancellation token. Stops INSTANTLY on any input click/focus (`stopAnimation` sets `ctrl.cancelled = true`).

**Bottom — footer details:**
- MapPin icon + bracketed mono location (`Cape Town, South Africa`)
- Mail icon + clickable email (`mailto:alqodez@gmail.com`)
- In a 2-col grid (1-col on mobile)

### 9.11 Footer (`src/components/footer.tsx`)

**Background:** `bg-dim-bg` (#111111), `border-t border-border`.

**Layout:** 3-column grid (`md:grid-cols-3 gap-8`), stacks on mobile.

**Left — Logo + tagline:**
- {alqode} mark (sm, bold)
- Tagline: "Digital systems agency. Cape Town + UAE."

**Center — Navigate:**
- "NAVIGATE" 10px mono uppercase label
- 4 links: Work, About, Process, Contact (smooth scroll on click)

**Right — Connect:**
- "CONNECT" 10px mono uppercase label
- 4 social links with Lucide icons: WhatsApp (via `waUrl("footer")`), GitHub, Instagram, Email (mailto)

**Bottom:** Divider + centered copyright `© 2026 {alqode}. All rights reserved.`

---

## 10. CONTENT SOURCE OF TRUTH

**ALL site copy lives in `src/lib/constants.ts`.** Components never have hardcoded text.

Exports (v3.1):
- `SITE` — name, domain, title, description, url, founder, location, email, whatsapp, github, instagram
- `waUrl(source, text?)` — **helper function**, not data. Builds `https://wa.me/27685394482?utm_source={source}&text={text}` for tracked WhatsApp links. Every CTA uses this.
- `NAV_LINKS` — array of {label, href} for nav sections (Work, About, Process, Contact)
- `HERO` — `boot.command + boot.lines[]`, `preHeadlineLabel`, `headline`, `headlineAccent`, `subline`, `primaryCta`, `secondaryCta`, `mockupOffer { label, cta, href }`, `metadata[]`, `founderTag`
- `CLIENTS` — label + logos[] (key, name, url, brandColor) for the trust strip
- `QUICKSTART` — tag, heading, subline, options[] (title, description, cta, href, eta)
- `PORTFOLIO` — tag, heading, headingAccent, subline, projects[] with name/deployedSince/category/result/description/tags/tech/image/fallbackImage/url. **`category` is `"community" | "client"`**.
- `TESTIMONIALS` — tag, heading, subline, items[] (client, clientKey, url, name, role, quote, photo) — quotes are signed-off by clients as of session close (verified)
- `ABOUT` — heading, paragraphs[] (3 items in v3.1, was 5), founderImage path
- `PROCESS` — tag, heading, subline, steps[] (4 steps: Discovery/Design/Build/Support). Consumed by `System` section.
- `RETAINER` — tag, heading, subline, pillars[] (4 pillars), closer (line1 only in v3.1 — line2 moved to About motto), cta. Consumed by `System` section.
- `THE_BUILD` — tag, heading, subline, nodes[] (5 nodes with id/label/caption/states), closer
- `FAQ` — tag, heading, items[] (5 question/answer pairs)
- `CONTACT` — heading, subline, whatsappCta, separator, formFields (name/email/project/submit), details (location/email), typingCycles[] (SA-realistic: Cape Town cafe, Joburg plumber, Durban boutique, Your business)
- `FOOTER` — tagline, copyright, navigate[], connect[] with label/href

**Note:** The legacy `SERVICES` export was removed in v3.0 — the old Services section was merged into Process. The legacy `CONTACT.formFields.submit` value is unused in v3.1 (Talk uses its own hardcoded "▸ deploy to WhatsApp" label).

---

## 11. ANIMATION SYSTEM (v3.1)

### Scroll Reveal (`src/lib/animations.ts`)

**`useScrollReveal(ref)`** — IntersectionObserver-based stagger reveal.

How it works:
1. Finds all `.reveal-item` descendants of the ref
2. Initial: `opacity: 0`, `translateY(20px)`, `transition: opacity 0.6s ease, transform 0.6s ease`
3. On entry (threshold 0.1, rootMargin `-50px`): reveals with `index * 0.15s` stagger
4. One-shot — unobserves after reveal

**Used in v3.1:** ClientLogos, Work, System, Quickstart, Talk, About (heading + photo only), and the static parts of TheBuild header.

**`useScrollRevealDramatic(ref, onReveal?)`** — heavier version for About paragraph cascade.
- `translateY 32px → 0`, `0.25s` stagger, `0.8s` duration, `threshold 0.15`, `rootMargin -80px`
- Optional `onReveal(index)` callback fires as each reveal-item appears (About uses this to enable the decrypt-on-hover effect only on already-revealed paragraphs)

### Hero "Boot" Sequence (`src/components/hero.tsx`)

Multi-stage animation via React state + setInterval/setTimeout chain:

1. **Command typewriter:** `▸ alqode.init` typed at `60ms/char` with a blinking 6×14px terminal-green block cursor visible until command completes.
2. **Boot lines stream in** (280ms post-command, then 180ms between):
   - `✓ business scanned`
   - `✓ friction mapped`
   - `✓ system online · accepting projects`
   - Each transitions from `translateX(-6px) opacity-0` → `translateX(0) opacity-1` in 300ms ease-snap.
3. **Headline word-stagger** (420ms after last boot line): each word transitions `translateY(14px) → 0` + opacity 0→1 in 400ms ease-snap, with `60ms` between words. The `{` and `}` mono brackets framing line 2 fade in synced to first/last word of line 2.
4. **Subline** fades in (250ms after last word, 700ms duration).
5. **CTAs** (180ms after subline, 600ms duration).
6. **Mockup offer LiveStatus** (100ms delay after CTAs).
7. **Metadata footer** (200ms after CTAs).

### Contact Form Typing Animation (`src/components/talk.tsx`)

Async/await with cancellation token. Cycles through `CONTACT.typingCycles` until user interacts with any input.

```typescript
const ctrl = animationRef.current; // { cancelled: boolean }

async function typeText(setter, text, speed, field) {
  for (let i = 0; i <= text.length; i++) {
    if (ctrl.cancelled) return;
    setter(text.slice(0, i));
    await sleep(speed);
  }
}
```

Per-cycle: type name 80ms/char → 300ms pause → type project 80ms/char → 2000ms pause → delete project 40ms/char → delete name 40ms/char → 500ms pause → next cycle. Stops INSTANTLY on input focus/change (sets `ctrl.cancelled = true`).

### TheBuild Pinned ScrollTrigger (`src/components/the-build.tsx`) — desktop only

GSAP `ScrollTrigger.pin` synced with Lenis:
- `start: "top top"`, `end: "+=2200"` (2200px of scroll while pinned)
- `pin: pinWrapperRef.current`
- `scrub: 0.6` — animation progress tied to scroll position with light smoothing

Each of 5 nodes gets activated and completed within its `segment = 1/5` of the timeline:
- `tl.call(() => setNodeState(i, "active"), [], i*segment + 0.02)`
- `tl.call(() => setNodeState(i, "done"), [], i*segment + segment*0.55)`
- SVG line to next node: `tl.to(line, { strokeDashoffset: 0, duration: segment*0.5 })` at `doneAt`

Counter + progress bar tied to linear `tl.to({val:0→100, duration:1, onUpdate})`.

**Mobile fallback** (currently hidden via `hidden lg:block` so it never plays on mobile): `start: "top 75%"`, `toggleActions: "play none none none"`, auto-play sequence with 0.5s per node.

### Lenis × GSAP Sync (`src/components/lenis-provider.tsx`)

Critical integration for pinned ScrollTrigger to work alongside smooth scroll:

```typescript
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

This makes Lenis report scroll changes to ScrollTrigger (so pins stay glued) and drives Lenis's raf via gsap.ticker for unified frame timing.

### Nav Menu (Framer Motion)
- Mobile overlay: `initial={{x:"100%"}}`, `animate={{x:0}}`, `exit={{x:"100%"}}`, 0.3s tween easeOut
- Each link: `initial={{opacity:0, y:20}}` with `delay: i*0.1`

### Tech Marquee (CSS-only)
- `@keyframes marquee { 0%{translateX(0)} 100%{translateX(-50%)} }`
- 30s linear infinite, content duplicated for seamless loop
- Pauses on hover via `hover:[animation-play-state:paused]`
- All 16 tech entries rendered, brand-tinted via `TECH_COLORS`
- GPU-accelerated transform, no JS

### Live Pulse (`animate-live-pulse`)
- Scale 1→2.2, opacity 0.35→1, 2.4s ease-snap loop
- Used **opt-in** via `<LiveStatus pulse>` on: hero mockup offer, mobile WhatsApp FAB, The Build active-state nodes (only during scroll-driven activation), System dashboard "subscription · active" status

### Scanline Overlay (`.scanline-overlay` CSS class)
- `::after` pseudo-element with `repeating-linear-gradient` of 18% black at 3px intervals
- `mix-blend-mode: multiply`
- Applied to Work card screenshots — subtle CRT texture

### Cursor Spotlight (`.spotlight-card` CSS class)
- `::before` pseudo-element with `radial-gradient(450px circle at var(--mouse-x) var(--mouse-y), rgba(16,185,129,0.09), transparent 55%)`
- Component updates `--mouse-x` / `--mouse-y` CSS vars on mousemove
- Opacity 0 → 1 on `:hover`, 0.3s ease-snap transition
- Applied to Work deployment cards + System dashboard pillar tiles

### Cursor Frame (`src/components/cursor-frame.tsx`) — desktop only
- Custom `{ · }` cursor follows mouse via raw transform updates per mousemove
- Hovering interactive elements (`a, button, [role=button], input, textarea, label`) expands the frame and the center dot
- On mount, sets `html.cursor-frame-active` class. CSS rule hides native cursor on `(hover: hover) and (pointer: fine)` devices.

### Scroll Progress (`src/components/scroll-progress.tsx`)
- Fixed 2px terminal-green bar at top of viewport
- rAF-throttled scroll listener updates `transform: scaleX(progress/100)` origin-left
- 0.08s linear transition for the scale changes
- `box-shadow: 0 0 8px rgba(16,185,129,0.6)` for soft glow

### Mobile WhatsApp FAB (`src/components/whatsapp-fab.tsx`)
- `lg:hidden fixed bottom-5 right-5 z-50` — mobile only
- Appears after 200px scroll: opacity-100 + translate-y-0 (was opacity-0 + translate-y-4)
- Tailwind `animate-ping` halo at 30% opacity for "live" feel — the ONE place native ping is used

### Cursor Blink (legacy from v2, still used)
```css
@keyframes cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
.animate-cursor-blink { animation: cursor-blink 530ms infinite; }
```
Used in: Hero boot command cursor, Talk form typing cursor.

### prefers-reduced-motion support
`@media (prefers-reduced-motion: reduce)` in globals.css globally caps all `animation-duration` and `transition-duration` to `0.01ms` (effectively instant). Additionally disables: `.animate-live-pulse`, `.animate-cursor-blink`, `.animate-ping`, `.marquee-track`. Users with motion sensitivity preferences get a static site.

---

## 12. SCROLL SYSTEM

### Lenis Smooth Scroll (`src/components/lenis-provider.tsx`)

Wraps entire app in `layout.tsx`. Configuration:
```typescript
new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical",
  gestureOrientation: "vertical",
  smoothWheel: true,
  wheelMultiplier: 1.2,
  touchMultiplier: 1.3,
});
```

Runs via `requestAnimationFrame` loop. Destroyed on unmount.

### Nav smooth scroll
All nav/footer links use `scrollIntoView({ behavior: "smooth" })` with `e.preventDefault()`.

### Scroll-to-top button (`src/components/scroll-to-top.tsx`)
- Appears after 600px scroll
- Uses `window.scrollTo({ top: 0, behavior: "smooth" })`
- Fixed bottom-right, z-40

---

## 13. PERFORMANCE CONTRACT (v3.1)

| Metric | Target | v3.1 Current |
|--------|--------|--------------|
| Lighthouse mobile (all categories) | 90+ | Not yet audited |
| First Load JS | <200KB gzipped | ~204KB (slightly over — Lenis × GSAP ticker integration is the floor) |
| TheBuild GSAP bundle | code-split | ✓ via `next/dynamic` |
| No Three.js/WebGL/particles | Enforced | Yes |
| Scroll-driven animations only on desktop | Enforced | Yes (TheBuild hidden on mobile) |
| Images via Next.js Image component | Enforced | Yes |
| Image format: WebP/AVIF | Enforced | Yes (`next.config.mjs` formats), screenshots converted to WebP |
| Fonts via next/font/google | Zero FOUT | Yes (Space Grotesk + Instrument Serif + JetBrains Mono) |
| Continuously running animations | Restricted | Cursor blink (CSS), tech marquee (CSS transform), `animate-ping` on mobile FAB only, `animate-live-pulse` on 4 opt-in places |
| prefers-reduced-motion respected | Enforced | Yes — `@media (prefers-reduced-motion: reduce)` disables all non-essential animations |
| Custom desktop cursor | Enforced | Hides native cursor only on `(hover:hover) and (pointer:fine)` devices |
| All WhatsApp links UTM-tagged | Enforced | Via `waUrl(source)` helper

---

## 14. RESPONSIVE BREAKPOINTS

Defined in `tailwind.config.ts` under `theme.extend.screens`:

| Token | Width | Usage |
|-------|-------|-------|
| `xs` | 375px | iPhone SE |
| `sm` | 480px | Small phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop (nav switch, bento grid, horizontal timeline) |
| `xl` | 1440px | Wide desktop (3-col portfolio) |

**NOTE:** These are in `extend.screens`, which ADDS to Tailwind defaults. This means default breakpoints (640px `sm`, etc.) are also available but shouldn't be used for consistency.

### Key responsive behaviors:
| Feature | Mobile (<lg) | Desktop (lg+) |
|---------|-------------|----------------|
| Nav | Hamburger + overlay | Horizontal links |
| Services | Stacked cards, inline icons | 2-col: sticky morphing icon + stacked cards |
| Portfolio | 1 col, md: 2 col | 3 col at xl |
| About | Stacked (photo above) | Side-by-side (photo 40% left) |
| Process | Vertical timeline | Horizontal timeline |
| Contact | Same layout | Same layout |
| Footer | Stacked | 3-column grid |
| Cursor glow | Hidden | Visible |

---

## 15. SEO & METADATA

### Page title
`{alqode} | Digital Systems Agency, Cape Town`

### Meta description
`Custom web apps, automation, and smart systems that cut your costs, multiply your output, and never clock out. Founded by Mohammed Hamdaan Dhaler.`

### Open Graph
- Type: website
- Locale: en_ZA
- Image: auto-generated via `opengraph-image.tsx` (1200x630, edge runtime)
- Shows: `{alqode}` logo, "Digital Systems Agency. Cape Town.", "WEB APPS - AUTOMATION - SMART SYSTEMS"

### Twitter Card
- Type: summary_large_image
- Same title + description as OG

### JSON-LD (Structured Data)
Organization schema in `layout.tsx`:
```json
{
  "@type": "Organization",
  "name": "alqode",
  "url": "https://alqode.com",
  "founder": { "@type": "Person", "name": "Mohammed Hamdaan Dhaler" },
  "address": { "addressLocality": "Cape Town", "addressCountry": "ZA" }
}
```

### Sitemap
Generated at `/sitemap.xml` via `src/app/sitemap.ts`. Currently just the homepage.

### robots.txt
Allow all crawlers, references sitemap at `https://alqode.com/sitemap.xml`.

### Favicon
`public/favicon.svg` - `{A}` icon, green brackets on void background, 32x32, 6px corner radius.

---

## 16. IMAGES & ASSETS

### Project images (all provided and in place):
| File | Location | Used in | Description |
|------|----------|---------|-------------|
| `founder.jpg` | `public/images/` | About | Founder headshot (41KB after compression) |
| `masjid-notify.webp` | `public/images/` | Work | Masjid Notify screenshot (40KB) |
| `faida-automation.webp` | `public/images/` | Work | FAIDA n8n workflow screenshot (52KB) |
| `bochi-cafe.webp` | `public/images/` | Work | Bochi Croffle hero page (50KB) |
| `bochi.webp` | `public/images/` | Work fallback | Backup if `bochi-cafe.webp` fails |
| `faida.webp` | `public/images/` | Work fallback | Backup if `faida-automation.webp` fails |
| `clients/bochi-owner.png` | `public/images/clients/` | Work testimonial | Bochi owner headshot (44KB) |
| `clients/faida-owner.png` | `public/images/clients/` | Work testimonial | Faida owner headshot (26KB) |
| `clients/trophy-owner.png` | `public/images/clients/` | Work testimonial | Trophy SA owner headshot (110KB) |

### Trophy SA project image
**Not yet captured.** Currently `image: null` and `fallbackImage: null` in `PORTFOLIO.projects`. `ProjectCard` renders a branded placeholder (italic-serif project name + "LIVE SITE" tag on a void gradient) when no image is available. When a screenshot is captured, drop it as `public/images/trophy-sa.webp` and update the `image` field.

### Legacy images — all deleted in v2.5
Old 3D tech stack PNGs (`express.webp`, `javascript.webp`, `mongo.webp`, etc.) were removed in v2.5 cleanup. No legacy images remain.

### Image handling
- Next.js `<Image>` component with `fill` + `object-cover`
- `sizes` prop on every Image for proper srcset
- `onError` chain: tries `fallbackImage` first, then falls back to branded placeholder
- `next.config.mjs` formats: `["image/avif", "image/webp"]` — Next.js converts at request time
- Heavy screenshots (Bochi, Masjid, FAIDA) were converted from PNG → WebP via `scripts/compress-images.js` (uses `sharp`, one-shot)

### Compression script
`scripts/compress-images.js` — devops utility:
- Resizes images to max 1400×900 (screenshots) or 900×1200 (portraits)
- Converts portfolio PNGs to WebP at quality 82
- Compresses portraits to WebP/JPEG with mozjpeg
- Re-run manually if source PNGs are dropped in `public/images/`. Requires `sharp` (not in default deps; install before running)

---

## 17. HOW TO UPDATE CONTENT (v3.1)

### All content → `src/lib/constants.ts`

**Add a new deployment / portfolio project (5th, 6th client...):**
```typescript
// Append to PORTFOLIO.projects array
{
  name: "Project Name",
  deployedSince: "2026",
  category: "client" as const,  // or "community"
  result: "Punchy outcome line (terminal-green callout in card)",
  description: "Longer description shown below result.",
  tags: ["Tag1", "Tag2", "Tag3"],
  tech: ["React", "Next.js", "WordPress"],  // keys must match TECH_ICON_MAP or TECH_COLORS
  image: "/images/your-screenshot.webp",
  fallbackImage: "/images/your-fallback.webp",
  url: "https://yourclient.com",
}
```
- Drop the screenshot into `public/images/` and run `node scripts/compress-images.js` (after `npm install -D sharp`) to convert PNG → WebP
- The Work section is a horizontal scroll carousel — adding a project just adds another card. No layout breaks.

**Add a new testimonial:**
```typescript
// Append to TESTIMONIALS.items array
{
  client: "Client Name",
  clientKey: "client_key" as const,  // must be in CLIENT_LOGO_MAP if you want a mini-logo
  url: "https://client.com",
  name: "Owner First Name",
  role: "Founder · Client Name",
  quote: "What they said. Verified.",
  photo: "/images/clients/client-owner.png",
}
```
- Add the owner headshot to `public/images/clients/`
- Work.tsx `findTestimonial(projectName)` will auto-match by name

**Add a new client logo to the trust strip:**
1. Add hand-traced SVG icon component to `src/components/client-logos-svg.tsx`
2. Add `<ClientLogo>` wrapper component that pairs icon + wordmark
3. Add to `CLIENT_LOGO_MAP` at bottom of file
4. Append to `CLIENTS.logos` array in constants with `key`, `name`, `url`, `brandColor`

**Add a new tech icon (Work card tech pills + Tech Marquee):**
1. Add SVG component to `src/components/tech-icons.tsx` (must accept `{ className, size, style }` props)
2. Add entry to `TECH_ICON_MAP` at bottom of file
3. Add brand color to `TECH_COLORS` map (hex string) — even if no icon, the text pill will be brand-tinted
4. Use the exact key string in project's `tech` array
5. Append to `TECHS` array in `tech-marquee.tsx` if you want it in the marquee

**Update the Hero boot sequence:**
Modify `HERO.boot.command` and `HERO.boot.lines[]` in constants.ts.

**Update the FAQ items:**
Modify `FAQ.items[]` (5 items max recommended for the accordion UI).

**Update contact typing cycles:**
Modify `CONTACT.typingCycles[]` (each cycle has `name` + `project` strings).

**Update social / WhatsApp links:**
Modify `SITE` object. For tracked WhatsApp links from new components, use `waUrl("source_name")`.

**Update the About founder motto:**
The motto is hardcoded in `src/components/about.tsx` (intentional — it's a unique visual element). If changing, edit the JSX directly.

**Update Process steps / Retainer pillars (System section):**
Modify `PROCESS.steps[]` and `RETAINER.pillars[]` in constants.ts. The System section consumes both.

**Update The Build node pipeline:**
Modify `THE_BUILD.nodes[]` in constants.ts (5 nodes recommended). If you change the count, the `segment = 1 / totalNodes` math in `the-build.tsx` handles it automatically. Make sure each node has matching `states` keys (idle/active/done).

---

## 18. CODE QUALITY STANDARDS

### TypeScript
- Strict mode enabled
- No `any` types
- Null checks required
- Proper typing for all component props

### React Patterns
- All components use `"use client"` directive (client-side interactivity)
- `useRef` for section refs (scroll reveal)
- `useCallback` for memoized handlers (nav)
- Stable keys (never array index as key, except where items have no unique ID)
- Cleanup in all useEffect hooks

### Tailwind
- Mobile-first responsive design
- All colors from brand tokens (no hardcoded hex in components)
- Responsive text via `clamp()` for headings
- `transition-all duration-300` for interactive elements

### Accessibility
- `aria-label` on all sections and interactive elements
- `aria-expanded` on hamburger button
- Proper `label` elements on form fields
- `alt` text on all images
- Semantic HTML (`header`, `nav`, `main`, `section`, `footer`, `article`)

---

## 19. KNOWN GOTCHAS (v3.1)

### Build / tooling
1. **`next.config.ts` NOT supported in Next.js 14** — must use `.mjs` or `.js`. Causes build failure.
2. **Windows `del` doesn't work in bash shell** — use `rm -f` or `rm -rf`.
3. **OG image edge runtime** — `opengraph-image.tsx` has `export const runtime = "edge"` which makes that route dynamic. Expected.
4. **Tailwind `screens` in `extend` adds to defaults** — default `sm: 640px` still exists alongside custom `sm: 480px`. Use custom breakpoints consistently.
5. **Stale `.next` cache on Windows** — large refactors can trigger `EINVAL: readlink` errors. Always `rm -rf .next` before rebuilding after major changes.
6. **Next.js Image blocks SVG by default** — to render SVGs you must either set `dangerouslyAllowSVG: true` in `next.config.mjs` (with CSP) or use a plain `<img>` tag. Currently the few SVG renders use plain `<img>` with eslint comment.

### v3.0/v3.1 specific
7. **Lenis × GSAP ScrollTrigger MUST be synced** — the pinned section in TheBuild won't work without `lenis.on("scroll", ScrollTrigger.update)` + `gsap.ticker.add((t) => lenis.raf(t*1000))` in LenisProvider. Don't change LenisProvider casually.
8. **TheBuild is hidden on mobile via `hidden lg:block`** — the GSAP/ScrollTrigger code still runs in JS but the section is `display: none`, so the pinning is harmless. If you ever want to show it on mobile, the component already has an auto-play fallback in the `isMobile` branch.
9. **Custom cursor uses `html.cursor-frame-active` class** — CursorFrame component sets this on mount. CSS rule `html.cursor-frame-active body { cursor: none }` only fires on `(hover: hover) and (pointer: fine)` devices. Touch devices are unaffected.
10. **`waUrl(source, text?)` is the WhatsApp link helper** — every CTA must use it instead of hardcoding `SITE.whatsapp`. Otherwise UTM tracking is lost.
11. **Contact form submits to WhatsApp, NOT mailto** — `handleSubmit` in Talk builds a message from `name + email + project` and opens WhatsApp via `waUrl("talk_form", message)`. The form is intentionally a low-friction WhatsApp message builder, not an email form.
12. **`<LiveStatus>` pulse is opt-in** — pulses were overused in early v3.0 and pulled back. Only pass `pulse` prop on truly primary signals (hero mockup offer, mobile FAB, The Build active state, System dashboard subscription status). Everywhere else gets a static dot.
13. **`{` and `}` in JSX must be escaped or use template literals** — When writing bracketed text in JSX, use the `<Bracketed>` primitive (which renders `{ ... }` programmatically) instead of literal `{` `}` in JSX (which would be parsed as expression openers).
14. **The motto "competitors run out of business"** — was originally in System closer (v3.0). Moved to About bottom in v3.1 with `-1deg` rotation because it was getting scrolled past. Don't move it back to System.
15. **Form WhatsApp message** — `waUrl(source, text)` URL-encodes the text. WhatsApp's web/app link accepts encoded newlines (`%0A`) which render as line breaks in the message body. Multi-line pre-fills work.

### Lucide / TypeScript
16. **Lucide icon typing** — use `LucideIcon` type from `lucide-react` for icon records, not `React.ComponentType<{size?: number}>`.

### prefers-reduced-motion
17. **Reduced-motion users get a near-static site** — `@media (prefers-reduced-motion: reduce)` in globals.css disables `animate-live-pulse`, `animate-cursor-blink`, `animate-ping`, `.marquee-track`, and caps all transitions/animations to 0.01ms. Test motion changes by toggling the OS reduce-motion setting.

---

## 20. VERSION HISTORY

### v3.1 — Polish pass (May 17 2026)

Same-day follow-up to v3.0. User reviewed the new build on desktop + mobile and flagged specific issues. v3.1 addresses every one.

**What changed:**

- **Work section: 2-col grid → horizontal scroll carousel.** Cards are now `flex-shrink-0` with widths `86vw` (mobile) / 440-540px (desktop), arranged in an `overflow-x-auto snap-x snap-mandatory` track with hidden scrollbar. Desktop gets ← → arrow buttons in the section header that `scrollBy(±560)` the track. Handles N projects gracefully — a 5th client just appends another card.

- **TheBuild hidden on mobile entirely.** User flagged the pinned scroll didn't work right on phones. Added `hidden lg:block` to the section. The GSAP code still runs in JS but the section is `display: none`, so no visible pinning on mobile.

- **Founder motto relocated.** "Our job is to make you so successful, your competitors run out of business." was buried in System closer in v3.0. Moved to the bottom of About in v3.1, stamped at `-1deg` rotation with `[ founder.motto ]` mono label and a terminal-green slash underneath. Now it's the punctuation mark of the founder story, not lost in System.

- **System closer simplified.** With the motto moved out, System now ends on just `"Our job isn't to ship a site and disappear."` + the "Get me on retainer" CTA.

- **Divider noise removed.** User: "too many lines going on." Specifically:
  - System: gradient-line dividers next to `▸ first weeks` and `▸ every month after` labels removed (descriptors merged into the mono tags themselves)
  - System: central `{ ongoing · every month }` transition marker removed entirely
  - Talk: gradient line next to `▸ common questions` removed

- **Contact form submits to WhatsApp, not mailto.** User wanted the form to function as a low-friction WhatsApp message builder, not a real email form. `handleSubmit` now builds a message from `name + email + project` values and opens WhatsApp via `waUrl("talk_form", message)`. Button renamed `"▸ deploy to WhatsApp"`. The typing animation stays — it's the centerpiece interaction.

- **Hover physics on Work cards:** added `-translate-y-0.5` lift + soft green shadow on hover, alongside the existing spotlight effect.

- **`.scrollbar-hide` utility** added to globals.css for the Work carousel track.

**Build:** ~204KB initial JS unchanged.

### v3.0 — Builder × Scene Redesign (May 17 2026)

Comprehensive 7-phase redesign. The site previously read as a "modern dark agency template" (Linear-clone). v3.0 commits to a distinctive **Builder × Scene** direction: terminal/automation builder authenticity (Direction A) + cinematic scroll-driven craft moments (Direction C).

**New design system foundation:**
- 3rd typeface added: JetBrains Mono (system/terminal voice). Trinity is now Instrument Serif (italic headlines) + Space Grotesk (body) + JetBrains Mono (mono).
- Extended color palette: live-amber `#FFB81C` (active/in-progress), signal-red `#FF4D4D` (alert, used sparingly), bone `#F5F1EA` (editorial), alongside existing void + terminal.
- New transition tokens: `ease-snap` (`cubic-bezier(.16, 1, .3, 1)`), `ease-out-quart`, `ease-spring-soft`. CSS variables + Tailwind classes.
- New animations: `live-pulse` (dot halo), `scanline`, `fade-up`.
- Reusable primitives folder:
  - `<Bracketed>` — wraps content in `{ }` mono brackets
  - `<LiveStatus variant pulse?>` — dot + mono label; pulse opt-in (reserved for genuinely live signals)
  - `<MonoTag variant>` — small uppercase mono metadata label
- New `<CursorFrame>` — custom desktop cursor: `{ · }` bracket pair tracking pointer
- New `<ScrollProgress>` — 2px terminal-green fixed top bar

**Page composition shift: 10 sections → 7**
- Hero (rebuilt as terminal "boot" sequence)
- ClientLogos + TechMarquee (trust strip beat)
- TheBuild (NEW signature pinned scroll moment with GSAP)
- Work (rebuilt as "deployed services" with integrated testimonials)
- About (light-bg break, refreshed with mono framing)
- System (NEW — merged Process + Retainer)
- Quickstart (mockup/quote dual-CTA)
- Talk (NEW — merged FAQ + Contact)

**Key new components:**
- `the-build.tsx` — pinned GSAP ScrollTrigger section. 5-node automation pipeline (Form → Automation → WhatsApp → Calendar → Revenue). Each node has idle/active/done states. Scroll progress = node activation. Mobile fallback auto-plays on entry.
- `system.tsx` — merged Process + Retainer into one beat. "▸ first weeks · how we build" pipeline → ongoing marker → "▸ every month after · how we stay" subscription dashboard with accent-bordered pillar tiles.
- `talk.tsx` — merged FAQ + Contact into 2-col layout. FAQ left, WhatsApp CTA + terminal-styled form right. Form inputs use mono font, bracketed labels, terminal focus rings. Typing animation preserved.
- `work.tsx` — full rewrite as deployment cards. Each card: scanline-overlay screenshot, live-status badge `{ live · since 2024 }`, deploy ID `[deploy:faida-02]`, integrated testimonial-as-user-feedback log entry OR community-deployment footer for Masjid Notify. Cursor-following spotlight on hover.

**Removed components (folded into new sections):**
- `services.tsx`, `process.tsx`, `retainer.tsx`, `faq.tsx`, `contact.tsx`, `portfolio.tsx`, `testimonials.tsx`

**Motion polish:**
- Snap easing across new components
- Cursor-following spotlight on Work cards + System dashboard tiles (radial green gradient that tracks mouse position)
- Hover physics: -translate-y-0.5 + soft green shadow on Work cards
- `prefers-reduced-motion` support: disables non-essential animations for accessibility
- `focus-visible` 2px terminal-green ring for keyboard navigation
- Lenis × GSAP ScrollTrigger synced via gsap.ticker (LenisProvider updated)

**Performance:**
- TheBuild code-split via `next/dynamic` (SSR preserved, GSAP-dependent client JS deferred)
- Initial first-load: ~204KB (slight increase from GSAP integration with Lenis ticker)

**Pulse discipline (mid-phase correction):**
- The pulsing dot was overused — became wallpaper. Pulled back to ONLY: hero mockup offer, mobile WhatsApp FAB, The Build active-state nodes (briefly during scroll), System dashboard "subscription · active" status. Everywhere else: static dots or alternative treatments (bracketed mono badges, accent borders).

### v2.5 - Faithful Logos & Quickstart Conversion Layer (May 14 2026)
Two improvements driven by user feedback after first live review.

**What changed:**
- **Client logos** — switched from hand-traced abstract SVGs to faithful brand renders. Bochi + Trophy SA now use the actual brand image files (PNG/JPG) via Next.js Image, rendered inside warm-cream tiles (`#FAF2E3`) with `mix-blend-mode: multiply` so the light image backgrounds blend with the tile. Faida keeps its SVG (user-approved) but rendered consistently in the same tile style. Hover lifts the tile + adds a brand-color outline ring.
- **NEW: Quickstart section** between Services and Portfolio. 2 cards reflecting the founder's actual sales process: "Get a mockup" (24h) and "Get a quote" (1h). Each card links to WhatsApp with a pre-filled message. Heading: "Proof. Not promises." Tag: "Start fast".
- **Retainer closer line 2** updated to "Our job is to make you so successful, your competitors run out of business." (was "...competitors come asking who built it"). Sharper, more aggressive.
- **Hero mockup microline** added (green pulsing dot + "Free mockup in 24h. No obligation. Request a mockup →") under hero CTAs. Clicks to WhatsApp pre-filled.
- **public/images/clients/** — new subfolder holding `bochi-logo.png` and `trophy-sa-logo.jpg`.

**Build stats:** 151KB first load JS (was 150KB, +1KB for Quickstart + mockup microline).

### v2.4 - Social Proof & Retainer Model (May 14 2026)
After a stretch of cold outreach + 3 new client wins, refocused the site on conversion: surface the proof, sell the retainer.

**What changed:**
- **NEW: ClientLogos section** between Hero and Services. 3 hand-traced SVG logos (Faida, Bochi, Trophy SA) with monochrome default → brand color on hover, click-through to live sites.
- **NEW: Retainer section** between Process and Contact. Tag/heading/subline/4 pillars/closer/CTA. Articulates the compounding-success retainer model — "We build. We stay. We compound." Background: soft terminal-green radial glow.
- **Removed: TechMarquee** (replaced by ClientLogos on the page; file deleted). Generic tech-stack flex was lower-conversion than named-client social proof.
- **Portfolio** — added green-accent `result` line per project (the outcome punch above the description). Sharper descriptions. Bochi renamed to "Bochi Croffle" with game-database narrative. FAIDA url now live (faida.ae) with UAE geographic flex.
- **Hero founderTag** — "Founded by Mohammed Hamdaan Dhaler in Cape Town. Building for SA + UAE." (geographic credibility flex)
- **Cleanup:** removed gsap dependency (was unused), deleted 13 legacy webp images from public/images/, deleted FULL_SPEC.md and wireframe.jsx from root.
- **constants.ts** — new `CLIENTS` and `RETAINER` exports. Updated PORTFOLIO with `result` field per project.

**Build stats:** 150KB first load JS (was 148KB, +2KB for two new sections, still well under 200KB target).

### v2.1 - User Feedback Iteration (Feb 10 2026)
Addressed naked-eye audit feedback across 6 areas:

**What changed:**
- Services: Redesigned from flat bento grid to scroll-driven 2-column layout with sticky icon morphing (desktop). Icons changed to Braces/Zap/ShieldCheck. Removed "Learn more" CTA (goes nowhere).
- Process: Each step now fades in individually via its own IntersectionObserver (was all-at-once with setInterval).
- About: Switched to `useScrollRevealDramatic` hook — 32px travel, 0.25s stagger, 0.8s duration for visible paragraph cascade.
- Portfolio: Tech icon SVGs now display actual brand colors via `TECH_COLORS` map and `style` prop.
- Tech Marquee: New CSS-only infinite horizontal scroll of all 14 tech logos with brand colors between Hero and Services.
- CLAUDE.md: Comprehensive update across ~10 sections.

**Build stats:** 145KB first load JS (was 144KB, +1KB from marquee component).

### v2.0 - Next.js Rebuild (Feb 2026)
Complete rewrite from Vite/React/Three.js to Next.js 14 + Tailwind.

**What changed:**
- Deleted entire old codebase (src/, dist/, e2e/, public/models/, Vite configs)
- New Next.js 14 App Router with TypeScript strict mode
- Tailwind CSS replacing all vanilla CSS
- All 3D (Three.js, React Three Fiber, physics) removed
- Space Grotesk font replacing Inter/Syne combo
- IntersectionObserver replacing GSAP ScrollTrigger for scroll animations
- Framer Motion for nav menu only (replacing full GSAP usage)
- Lenis smooth scroll preserved
- Single-page conversion-focused design replacing portfolio showcase

**Why:** The old site was a portfolio with 3D character. The new site is a conversion-focused agency site targeting WhatsApp leads for South African SMBs (90% mobile visitors). Three.js contradicted the Lighthouse 90+ mobile performance contract.

### v1.x - Original Vite Build (Jan 2026 and earlier)
- React 18 + Vite 5 + Three.js + GSAP
- 3D character model with mouse tracking
- Physics-based floating tech stack spheres
- Vanilla CSS with CSS variables
- Multiple bug fixes for mobile scroll, loading text, WhatIDo boxes

**Commits (v1):**
- `003b8a3` initial
- `0b139b2` error-gone
- `538a316` Rebrand to Alqode digital agency
- `ff972a4` Add mobile typewriter effect
- `97e164c` Fix mobile UI bugs
- `3422808` Fix mobile scrolling
- `b9617e9` Fix mobile scroll and loading text overlap
- `c5ed739` Fix mobile contact visibility
- `cb647aa` Add Playwright E2E testing
- `cd1e585` Production readiness fixes + documentation

---

## 21. TESTING CHECKLIST (v3.1)

### Pre-Push
- [ ] `npm run build` passes with zero errors
- [ ] `npm run dev` loads at localhost:3000
- [ ] No console errors / hydration warnings
- [ ] ScrollProgress bar visible at top, fills as you scroll
- [ ] CursorFrame replaces native cursor on desktop pointer devices

### Mobile (375px viewport)
- [ ] Native cursor visible (not replaced) — touch devices
- [ ] No ScrollProgress / CursorGlow / CursorFrame interference
- [ ] **Nav:** hamburger opens overlay, links stagger in, body scroll-locked, CTA at bottom
- [ ] **Hero:** boot sequence types out, headline word-staggers, mockup LiveStatus pulses, metadata strip visible
- [ ] **ClientLogos:** all 3 logos in ONE row (no wrap on 375px), brand-color tap-feedback
- [ ] **TechMarquee:** scrolls horizontally, 16 logos with colors
- [ ] **TheBuild:** NOT VISIBLE (correctly hidden on mobile)
- [ ] **Work:** horizontal scroll carousel, swipe through 4 cards one at a time (86vw each), scanline overlay visible on images, status badges pulse appropriately
- [ ] **About:** photo above text, paragraphs cascade with visible stagger, motto stamp visible at -1deg rotation at bottom, "Work with us" CTA works
- [ ] **System:** pipeline nodes stack (1-col), dashboard panel below with 2 pillar tiles per row (or 1 on tight viewport), each tile has accent left-border, "Get me on retainer" CTA
- [ ] **Quickstart:** 2 cards stack, big 24h/1h timing badges visible, each card links to WhatsApp
- [ ] **Talk:** FAQ first (above form), accordion taps cleanly, form below, typing animation cycles (Cape Town cafe / Joburg plumber / Durban boutique / Your business), "▸ deploy to WhatsApp" submits to WhatsApp with pre-filled message
- [ ] **Footer:** stacks cleanly (logo, navigate, connect)
- [ ] **WhatsappFab:** floating green circle bottom-right, appears after 200px scroll, ping animation visible
- [ ] **Vertical scroll feels natural** (no jank, no pin attempts)
- [ ] All WhatsApp links open with `utm_source` query param

### Desktop (1440px viewport)
- [ ] **Cursor:** native cursor hidden, `{ · }` CursorFrame follows mouse, expands on hover over a/button
- [ ] **CursorGlow:** subtle green radial ambient on Hero (visible in dot-grid)
- [ ] **Nav:** 4 horizontal links + green CTA right
- [ ] **Hero:** boot sequence types, headline reveals word-by-word, `{` `}` brackets fade in around line 2, mockup LiveStatus pulses, metadata bracketed footer
- [ ] **ClientLogos:** 3 logos in wide row, hover shows brand color + scale
- [ ] **TechMarquee:** scrolls, pauses on hover, 16 tech labels with brand colors (PayFast as cyan text-only)
- [ ] **TheBuild:** PINNED on scroll. As user scrolls through ~2200px, the section stays glued and 5 nodes activate sequentially (idle → amber pulse active → solid green done), SVG lines draw between nodes, counter ticks 0% → 100%, progress bar fills
- [ ] **Work:** horizontal scroll carousel with arrow buttons in header, ~2 cards visible at once, scroll snaps, cursor spotlight tracks mouse inside each card, hover lifts card + green shadow + "Open ↗" CTA fades in
- [ ] **About:** photo 40% left + text 60% right, paragraphs cascade with 0.25s stagger, decrypt-on-hover works on revealed paragraphs, credentials strip + "Work with us" CTA, MOTTO STAMP visible at bottom (-1deg rotation, italic serif, terminal slash)
- [ ] **System:** Beat A pipeline = 4 numbered nodes in horizontal row with gradient connecting line, Beat B = subscription dashboard panel with pulsing "subscription · active" status + 4 pillar tiles in 2x2 with distinct left-border accents, cursor spotlight on tiles
- [ ] **Quickstart:** 2 cards side-by-side, giant italic-serif "24h" / "1h" badges in terminal green
- [ ] **Talk:** 2-col layout (FAQ left, CTA + form right), terminal-styled inputs, typing animation cycles, "▸ deploy to WhatsApp" opens WhatsApp with pre-filled message
- [ ] **Footer:** 3-col grid
- [ ] **ScrollToTop:** button appears after 600px scroll
- [ ] All WhatsApp links open with `utm_source` query param

### Animation discipline
- [ ] Pulsing dots ONLY in: hero mockup offer, mobile FAB, TheBuild active state during scroll, System dashboard subscription status (4 places total)
- [ ] All other LiveStatus instances are static (no pulse)
- [ ] Scanline overlay visible on Work card screenshots
- [ ] Cursor spotlight visible inside Work cards + System dashboard tiles on hover
- [ ] Snap easing on all v3 transitions (CTA hovers, card hovers, reveal-items)

### Accessibility
- [ ] Keyboard Tab cycles through focusable elements, terminal-green focus ring visible on each
- [ ] `aria-label` on all sections, hamburger, FAB, decorative SVGs `aria-hidden`
- [ ] `alt` text on all images
- [ ] OS reduce-motion setting → site renders mostly static (no pulses, no marquee, no scroll-driven animations)

### Performance
- [ ] Lighthouse mobile 90+ (all categories) — not yet audited
- [ ] First Load JS ~204KB
- [ ] Images: all <120KB at source
- [ ] Next.js Image WebP/AVIF served via Vercel
- [ ] No layout shift (CLS near 0)

---

## 22. FUTURE ROADMAP (v3.1)

### Outstanding (need user content / external action)
- [ ] **Trophy SA screenshot** — drop into `public/images/` and update `PORTFOLIO.projects[3].image` (currently `null`, renders branded placeholder)
- [ ] **New founder photo** — current is LinkedIn-style headshot; user agreed working/building shot would be more authentic
- [ ] **Proper Bochi + Trophy SA brand SVGs** — user said will hire Fiverr vectorizer when budget allows; current hand-traced versions stay until then
- [ ] **Add 5th client when active** — paying client onboarding; just append to `PORTFOLIO.projects` and the carousel handles it

### Done in v3 sprint (don't redo)
- [x] Contact form: no longer needs Resend wiring — form submits directly to WhatsApp via `waUrl()` (intentional per user preference)
- [x] Testimonials section — built into Work cards inline
- [x] Verified testimonial quotes (user signed off)
- [x] Image compression — bochi-cafe 1.4MB → 50KB, masjid-notify 522KB → 40KB, founder 650KB → 41KB, etc.
- [x] SEO upgrade — title, description, Service + FAQPage + Organization schema
- [x] OG image redesign — terminal-style composition
- [x] Mobile WhatsApp FAB — sticky floating green circle
- [x] UTM tracking on all WhatsApp links via `waUrl()`

### Next round (when user returns)
- [ ] Lighthouse audit + fixes (mobile + desktop)
- [ ] Cross-browser testing (Safari iOS, Chrome Android, Firefox desktop)
- [ ] Consider trimming the 4KB over 200KB initial bundle (likely not possible without breaking TheBuild pin)
- [ ] Section-by-section blueprints in §9 — done for v3.1 but could add more "why this exists" rationale per section

### Future ideas (post-v3.1)
- [ ] Blog / case studies section (`/blog/[slug]`) with proper article schema
- [ ] Individual project detail pages (currently click-out to live sites)
- [ ] Cal.com or Notion CMS integration if Hamdaan wants direct booking
- [ ] Theme toggle (currently dark-only with About light break)
- [ ] More signature scroll moments inspired by The Build (one per section is too much; pick one more strategic place)

---

## QUICK REFERENCE CARD

```
┌─────────────────────────────────────────────────────────────┐
│  ALQODE WEBSITE v3.1 — QUICK REFERENCE                      │
├─────────────────────────────────────────────────────────────┤
│  Dev:        npm run dev                                    │
│  Build:      npm run build                                  │
│  Deploy:     git push origin main (auto-deploys to Vercel)  │
├─────────────────────────────────────────────────────────────┤
│  Copy:       src/lib/constants.ts (ALL site copy + waUrl()) │
│  Sections:   src/components/*.tsx (Hero, Work, System, etc.)│
│  Primitives: src/components/primitives/                     │
│              (Bracketed, LiveStatus, MonoTag)               │
│  Anims:      src/lib/animations.ts + GSAP via LenisProvider │
│  Tech icons: src/components/tech-icons.tsx                  │
│  Image trim: node scripts/compress-images.js (needs sharp)  │
├─────────────────────────────────────────────────────────────┤
│  Direction:  Builder × Scene (terminal + cinematic)         │
│  Fonts:      Space Grotesk · Instrument Serif · JBMono      │
│  Colors:     void #0a0a0a  terminal #10b981                 │
│              live-amber #FFB81C  signal-red #FF4D4D         │
│              bone #F5F1EA                                   │
│  Eases:      ease-snap  ease-out-quart  ease-spring-soft    │
│  Breaks:     xs=375 sm=480 md=768 lg=1024 xl=1440           │
├─────────────────────────────────────────────────────────────┤
│  Sections:   Hero → ClientLogos → TechMarquee → TheBuild*   │
│              → Work (carousel) → About (+motto) → System    │
│              → Quickstart → Talk → Footer                   │
│              (*TheBuild hidden on mobile)                   │
├─────────────────────────────────────────────────────────────┤
│  Live:       https://alqode.com                             │
│  GitHub:     github.com/alqode-dev/alqode-website           │
│  WhatsApp:   wa.me/27685394482   (via waUrl(source) helper) │
└─────────────────────────────────────────────────────────────┘
```

---

*Last Updated: May 17, 2026*
*Version: 3.1 (Polish pass after Builder × Scene redesign)*
