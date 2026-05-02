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

### What This Site Does
- Single-page agency portfolio targeting WhatsApp lead generation
- 7 scroll sections: Hero, Services, Portfolio (Work), About, Process, Contact, Footer
- Dark theme (#0a0a0a) with terminal green (#10b981) accent
- About section is the ONLY light-background section (#f5f5f0)
- Signature contact form typing animation cycles through example companies
- No 3D, no WebGL, no particles - pure performance

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
| **Next.js** | 14.2.18 | App Router, SSR, Image optimization |
| **React** | 18.3.1 | UI framework |
| **TypeScript** | 5.7.2 | Strict mode type safety |
| **Tailwind CSS** | 3.4.17 | Utility-first styling |
| **Framer Motion** | 11.15.0 | Nav menu slide-in animation only |
| **Lenis** | 1.1.18 | Smooth scroll (desktop + mobile) |
| **Lucide React** | 0.468.0 | Tree-shakeable icons |
| **@vercel/analytics** | 1.4.1 | Production analytics |
| **GSAP** | 3.12.7 | Installed but NOT used (kept for potential future use) |

### What We DON'T Use (Performance Contract)
- No Three.js / WebGL / Canvas
- No particles / physics / 3D models
- No heavy animation libraries running continuously
- No GSAP ScrollTrigger (using IntersectionObserver instead - lighter)
- No external CSS frameworks (Tailwind only)
- No CMS API calls at build time (portfolio is hardcoded in constants.ts)

---

## 4. COMMANDS

```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Production build (includes TypeScript check)
npm run start      # Serve production build locally
npm run lint       # ESLint check
```

### Build Stats (as of Feb 2026)
```
Route                    Size       First Load JS
/                        57.6 kB    145 kB
/_not-found              138 B      87.5 kB
/opengraph-image         0 B        0 B (edge runtime)
/sitemap.xml             0 B        0 B

Shared JS: 87.3 kB
```
**Target: <200KB gzipped first load. Current: 145KB.**

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

## 6. FILE STRUCTURE (COMPLETE)

```
alqode-website/
├── public/
│   ├── favicon.svg                    # {A} icon, green brackets on void bg
│   ├── robots.txt                     # Allow all, links sitemap
│   └── images/
│       ├── founder.jpg                # Founder photo (About section)
│       ├── masjid-notify.png          # Masjid Notify screenshot (Portfolio)
│       ├── faida-automation.png       # FAIDA n8n workflow screenshot (Portfolio)
│       ├── bochi-cafe.png             # Bochi Cafe website screenshot (Portfolio)
│       ├── bochi.webp                 # Bochi Cafe fallback image
│       ├── faida.webp                 # FAIDA fallback image
│       └── *.webp                     # Legacy tech stack images (unused, safe to delete)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root: Space Grotesk font, metadata, JSON-LD, LenisProvider, Analytics
│   │   ├── page.tsx                   # Home: assembles CursorGlow + Nav + TechMarquee + 7 sections + Footer + ScrollToTop
│   │   ├── globals.css                # Tailwind directives + dot-grid + glow + cursor-blink + section-padding + container-width + gradient-divider + marquee
│   │   ├── not-found.tsx              # 404 page with "Back to home" CTA
│   │   ├── sitemap.ts                 # Dynamic XML sitemap for alqode.com
│   │   └── opengraph-image.tsx        # Edge runtime OG image (1200x630)
│   │
│   ├── components/
│   │   ├── nav.tsx                    # Sticky nav + mobile hamburger (Framer Motion slide-in)
│   │   ├── hero.tsx                   # Typewriter tag + word-by-word headline stagger + CTAs
│   │   ├── services.tsx               # Scroll-driven 2-col layout with sticky icon morphing (desktop), stacked cards (mobile)
│   │   ├── portfolio.tsx              # 3 project cards with screenshots + SVG tech logos
│   │   ├── about.tsx                  # Light bg section: founder photo left, story right
│   │   ├── process.tsx                # 4-step timeline with individual scroll reveals per step
│   │   ├── contact.tsx                # WhatsApp CTA + signature typing animation form
│   │   ├── footer.tsx                 # 3-column grid: logo, navigate links, social icons
│   │   ├── tech-icons.tsx             # 14 inline SVG brand logos + TECH_COLORS brand color map + style prop support
│   │   ├── tech-marquee.tsx           # CSS-only infinite horizontal scroll of all 14 tech logos with brand colors
│   │   ├── cursor-glow.tsx            # Desktop-only (lg+, no touch) 400px radial gradient follows mouse
│   │   ├── scroll-to-top.tsx          # Fixed button, appears after 600px scroll
│   │   └── lenis-provider.tsx         # Wraps app in Lenis smooth scroll
│   │
│   └── lib/
│       ├── constants.ts               # ALL site copy - SINGLE SOURCE OF TRUTH
│       └── animations.ts              # useScrollReveal + useScrollRevealDramatic hooks (IntersectionObserver)
│
├── CLAUDE.md                          # THIS FILE - complete rebuild blueprint
├── package.json                       # Dependencies and scripts
├── tsconfig.json                      # TypeScript strict config, @/* alias
├── tailwind.config.ts                 # Brand colors, fonts, breakpoints
├── postcss.config.mjs                 # Tailwind + autoprefixer
├── next.config.mjs                    # Image formats: avif + webp
├── .eslintrc.json                     # extends next/core-web-vitals
└── .gitignore                         # Next.js patterns, excludes CLAUDE.md/specs/wireframe
```

---

## 7. BRAND KIT

### Colors
| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| **void** | `#0a0a0a` | `bg-void`, `text-void` | Page background, CTA text |
| **terminal** | `#10b981` | `bg-terminal`, `text-terminal` | Accent green, CTAs, highlights |
| **white** | `#ffffff` | `text-white` | Primary text on dark |
| **muted** | `#666666` | `text-muted` | Secondary text, labels |
| **light-bg** | `#f5f5f0` | `bg-light-bg` | About section ONLY |
| **light-muted** | `#444444` | `text-light-muted` | Body text on light bg |
| **card-bg** | `#161616` | `bg-card-bg` | Card backgrounds |
| **border** | `#2a2a2a` | `border-border` | Card/section borders |
| **dim-bg** | `#111111` | `bg-dim-bg` | Footer background |

### Typography
| Element | Font | Weight | Tailwind |
|---------|------|--------|----------|
| All text | Space Grotesk | Variable | `font-sans` (via CSS variable) |
| Headings | Space Grotesk | 700-800 | `font-bold` / `font-extrabold` |
| Body | Space Grotesk | 400 | default |

Font loaded via `next/font/google` in `layout.tsx` with `display: "swap"` for zero FOUT.

### Logo
- Display format: `{alqode}` - green brackets, white text
- Code: `<span className="text-terminal">{"{"}</span>alqode<span className="text-terminal">{"}"}</span>`
- Favicon: `public/favicon.svg` - `{A}` icon with green brackets on void background

### Section text sizes (responsive)
- Section headings: `text-[clamp(1.375rem,3vw,2rem)]` (22px to 32px)
- Hero headline: `text-[clamp(1.75rem,5vw,3.5rem)]` (28px to 56px)
- Body text: `text-sm` (14px) to `text-base` (16px)
- Labels/tags: `text-xs` (12px) to `text-[10px]`

---

## 8. SINGLE-PAGE ARCHITECTURE

The site is one page (`src/app/page.tsx`) with 7 scroll sections in this exact order:

```
┌─────────────── Nav (sticky, z-50) ───────────────┐
│ {alqode} logo        nav links       CTA button   │
└──────────────────────────────────────────────────┘
┌─────────────── Hero (#hero) ─────────────────────┐
│ Typewriter tag → word-by-word headline → subline  │
│ → Primary CTA (WhatsApp) + Secondary (See work)   │
│ Background: dot-grid + terminal glow               │
└──────────────────────────────────────────────────┘
                   gradient-divider
┌─────────────── Tech Marquee ─────────────────────┐
│ Infinite CSS scroll of 14 tech logos + brand colors│
│ Pauses on hover                                    │
└──────────────────────────────────────────────────┘
                   gradient-divider
┌─────────────── Services (#services) ─────────────┐
│ "What we do" heading                               │
│ Desktop: 2-col sticky icon morphing + stacked cards│
│ Mobile: stacked cards with inline icons            │
└──────────────────────────────────────────────────┘
                   gradient-divider
┌─────────────── Portfolio (#work) ────────────────┐
│ "Built by {alqode}" heading                        │
│ 3 project cards: screenshot + tags + SVG tech logos│
│ Projects: Masjid Notify, FAIDA, Bochi Cafe         │
└──────────────────────────────────────────────────┘
┌─────────────── About (#about) ───────────────────┐
│ ** LIGHT BACKGROUND (#f5f5f0) **                   │
│ "The person behind the code"                       │
│ Desktop: Photo 40% left, text 60% right            │
│ Mobile: Photo stacked above text                   │
│ Bold standalone: "So I built the systems." (xl)    │
└──────────────────────────────────────────────────┘
┌─────────────── Process (#process) ────────────────┐
│ "How it works" heading                              │
│ Desktop: horizontal 4-step timeline with line draw  │
│ Mobile: vertical timeline with connecting line      │
│ Steps: Discovery → Design → Build → Support         │
└──────────────────────────────────────────────────┘
                   gradient-divider
┌─────────────── Contact (#contact) ────────────────┐
│ "Let's build something." heading                    │
│ Full-width WhatsApp CTA (primary conversion)        │
│ "or fill in the form below" separator               │
│ Form: Name + Email + Project (signature typing anim)│
│ Location + email details below                      │
└──────────────────────────────────────────────────┘
┌─────────────── Footer ────────────────────────────┐
│ Logo+tagline | Navigate links | Connect (icons)    │
│ Copyright bar                                      │
└──────────────────────────────────────────────────┘
```

### Gradient dividers
Between Hero→Marquee, Marquee→Services, Services→Portfolio, and Process→Contact. Code:
```html
<div className="gradient-divider mx-5" />
```
CSS: `height: 1px; background: linear-gradient(90deg, transparent, #2a2a2a, transparent);`

---

## 9. SECTION-BY-SECTION BLUEPRINT

### 9.1 Nav (`src/components/nav.tsx`)

**Behavior:**
- Fixed to top, z-50
- Transparent on load, gains `bg-void/80 backdrop-blur-xl border-b border-border/50` after 20px scroll
- Smooth scroll to section on nav link click via `scrollIntoView({ behavior: "smooth" })`

**Desktop (lg+):**
- Logo left, 5 nav links center-right, green CTA button far right
- Links: Services, Work, About, Process, Contact
- CTA: "Get a system built" → opens WhatsApp

**Mobile (<lg):**
- Logo left, small CTA + hamburger icon right
- Hamburger opens full-screen overlay (Framer Motion slide from right, 0.3s ease-out)
- Close X button top-right
- Links stagger in (0.1s delay each, fade+slide up)
- Full-width CTA at bottom of overlay
- Body overflow hidden while menu open

**Key implementation:**
- Framer Motion `AnimatePresence` wraps the overlay for exit animation
- `toggleMenu()` sets `document.body.style.overflow` to "hidden" / ""
- Each mobile link is a `motion.a` with `initial={{ opacity: 0, y: 20 }}`

### 9.2 Hero (`src/components/hero.tsx`)

**Layout:**
- Full viewport height (`min-h-screen`), flex center-left aligned
- Background: dot-grid pattern (24px spacing, 0.04 opacity dots) + green radial glow from left
- Container max-width 1200px, left-aligned text

**Animation sequence (runs once on mount):**
1. **{alqode} tag typewriter:** Characters appear one at a time at 80ms/char with blinking cursor
2. **Cursor disappears** 0.5s after typewriter finishes
3. **Headline word stagger** starts 0.3s after typewriter: each word fades in + slides up 12px at 50ms intervals
   - Line 1: "We don't build websites." (white)
   - Line 2: "We build machines that make you money." (terminal green)
4. **Subline fades in** 0.3s after last headline word (0.7s transition)
5. **CTAs fade in** 0.2s after subline (0.7s transition)
6. **Founder tag** fades in with 0.3s delay after CTAs

**Elements:**
- Tag: `{alqode}` in terminal green, xs text, 2px letter spacing, uppercase
- Headline: `clamp(1.75rem, 5vw, 3.5rem)`, extrabold, max-w-2xl
- Subline: sm/base text, muted color, max-w-md
- Primary CTA: green bg, void text, "Get a system built" + ArrowRight icon → WhatsApp
- Secondary CTA: bordered, white text, "See our work" → scrolls to #work
- Founder tag: xs, muted, "Founded by Mohammed Hamdaan Dhaler. Cape Town."

### 9.3 Services (`src/components/services.tsx`)

**Layout:**
- Dark background, section-padding
- Heading: "What we do" + subline "Three things. We do them extremely well."

**Desktop (lg+): Two-column layout with sticky icon morphing**
- Left column (200px): Sticky icon area at `top: calc(50vh - 80px)`
  - 160x160 container with all 3 icons overlaid
  - Active icon: `opacity: 1, scale: 1` / Inactive: `opacity: 0, scale: 0.8`
  - CSS transitions (0.5s) for smooth morphing between icons
  - Active card title label below icon
- Right column: 3 cards stacked vertically with `space-y-16`
  - Each card has IntersectionObserver (threshold 0.5, rootMargin `-100px`)
  - When card enters view, it sets `activeIndex` → morphs left icon
- Cards: `bg-card-bg`, `border-border`, `rounded-xl`, `p-8 lg:p-10`
  - Hover: `border-terminal/40` + bottom accent line grows
  - No "Learn more" CTA (removed — goes nowhere)

**Mobile (<lg): Stacked cards**
- Each card has its own inline icon (no morphing, no sticky)
- `gap-3`, `p-5`

**Icons:** Lucide icons mapped via ICONS object:
- Build → `Braces` (curly braces `{}`)
- Automate → `Zap` (lightning bolt)
- Support → `ShieldCheck` (shield)

**Card content (from constants.ts):**
1. **Build** - "Custom web apps, e-commerce stores, websites, and digital experiences. Modern frameworks, clean code, built to scale. Not to break."
2. **Automate** - "Your receptionist or admin goes home at 5. Your machine doesn't. Lead generation, WhatsApp automation, workflow systems that run while you sleep."
3. **Support** - "We don't disappear after launch. As technology evolves, so do your systems. Ongoing improvements, performance upgrades, and scaling support to keep you ahead."

### 9.4 Portfolio / Work (`src/components/portfolio.tsx`)

**Layout:**
- Heading: "Built by {alqode}" (green accent on {alqode})
- Subline: "Real systems. Real businesses. Real results."
- Grid: `md:grid-cols-2 xl:grid-cols-3 gap-4`

**Each project card:**
- `bg-card-bg`, `rounded-xl`, `border border-border`, hover → `border-terminal/30`
- Screenshot area: `h-[160px] md:h-[180px]`, `bg-dim-bg`, object-cover, hover scales to 105%
- External link button: appears top-right on hover (void bg with blur, rounded-full)
- Content padding: `p-5`
- Project name: base, bold
- Description: xs, muted
- Category tags: green bg at 15%, terminal text, rounded, 10px font
- Tech pills: bordered (border-border), muted text, 10px font, WITH SVG brand logo icon left of text

**SVG Tech Icons** (`src/components/tech-icons.tsx`):
14 inline SVG brand logos with brand colors: Meta (#0866FF), n8n (#EA4B71), TypeScript (#3178C6), Python (#3776AB), Next.js (#fff), Tailwind (#06B6D4), Vercel (#fff), React (#61DAFB), Node.js (#339933), GitHub (#fff), JSON (#F7DF1E), GSAP (#88CE02), Supabase (#3ECF8E), Airtable (#18BFFF). Mapped via `TECH_ICON_MAP` record, colored via `TECH_COLORS` map + `style` prop on SVG icons.

**Projects (from constants.ts):**

1. **Masjid Notify**
   - Tags: WhatsApp API, Automation, Community
   - Tech: Next.js, TypeScript, Supabase, Tailwind, React (SVG logos)
   - Image: `/images/masjid-notify.png` (no fallback)
   - URL: https://masjid-notify.vercel.app

2. **FAIDA**
   - Tags: Automation, Finance, UAE
   - Tech: Python, n8n, JSON, Airtable (SVG logos)
   - Image: `/images/faida-automation.png`
   - Fallback: `/images/faida.webp`
   - URL: none

3. **Bochi Cafe**
   - Tags: Web Design, Mobile-first, F&B
   - Tech: Next.js, React, Tailwind, Vercel (SVG logos)
   - Image: `/images/bochi-cafe.png`
   - Fallback: `/images/bochi.webp`
   - URL: https://bochinsh.com

### 9.5 About (`src/components/about.tsx`)

**THE ONLY LIGHT-BACKGROUND SECTION:** `bg-light-bg` (#f5f5f0), text `text-void` (#0a0a0a)

**Layout:**
- Heading: "The person behind the code"
- Desktop (lg+): Photo 40% left (`lg:w-[40%]`), text 60% right (`flex-1`)
- Mobile: Photo above, text below (stacked `flex-col`)

**Photo:**
- Aspect ratio 4:5, `rounded-xl`, `object-cover`
- Image: `/images/founder.jpg`
- On error: hides image element

**Text paragraphs** (each is a `reveal-item` using `useScrollRevealDramatic` for dramatic stagger):
- translateY: 32px (more travel), stagger: 0.25s (wider gaps), duration: 0.8s (slower)
- Threshold: 0.15, rootMargin: `-80px` (triggers later for visible cascade)

Paragraphs have 3 styles based on `bold` and `highlight` flags:
1. **Bold + highlight (intro):** `text-void font-semibold text-[15px] md:text-base` - "I'm Mohammed Hamdaan Dhaler, founder of {alqode}, based in Cape Town."
2. **Regular (body):** `text-light-muted text-sm md:text-[15px]` - story paragraphs
3. **Bold standalone (punch line):** `text-void font-bold text-xl md:text-[22px]` - "So I built the systems."

**{alqode} rendering:** Uses `renderText()` helper that splits on `{alqode}` and renders it with `text-terminal font-semibold`.

**Full paragraphs:**
1. (bold+highlight) "I'm Mohammed Hamdaan Dhaler, founder of {alqode}, based in Cape Town."
2. (regular) "I started building because I saw businesses bleeding time and money on things that should run themselves..."
3. (bold standalone) "So I built the systems."
4. (regular) "{alqode} exists to give businesses the tools that actually move the needle..."
5. (regular) "Every project I take on gets the same treatment: built fast, built right, built to last..."

### 9.6 Process (`src/components/process.tsx`)

**Layout:**
- Heading: "How it works"
- Subline: "From first message to live system. No fluff, no delays."

**Desktop (lg+): Horizontal timeline**
- `grid grid-cols-4 gap-6`
- Horizontal connecting line: absolute, `top-[18px]`, spans full width
- Line draws from 0% to 100% width on scroll (green gradient: terminal to terminal/40)
- Number circles: 36x36, rounded-full, terminal border, void bg, terminal text
- Circles animate in sequence: opacity + scale tied to line progress

**Mobile: Vertical timeline**
- Flex layout with timeline column (circles + connecting lines) on left, content on right
- Vertical connecting lines between circles, fill from top to bottom tied to scroll progress
- Padding: `pt-1.5 pb-6` per step

**Animation:** Each step has its own IntersectionObserver (threshold 0.3, rootMargin `-100px`):
- Steps fade in individually as user scrolls past each one (not all at once)
- Each step: `opacity 0→1`, `translateY(20px→0)`, 0.6s ease transition
- `revealedSteps` boolean array tracks which steps have appeared
- Line progress = `(revealedCount / 4) * 100` with CSS `transition: width/height 0.6s ease`
- Number circles: `scale(0.8)→scale(1)` + `opacity 0.3→1` on reveal
- Heading/subline still use standard `useScrollReveal` with `reveal-item` class

**Steps (from constants.ts):**
1. **01 Discovery** - "You tell us the problem. We figure out the fastest, cleanest solution..."
2. **02 Design** - "We map it out before we code. Architecture, user flow, and visual direction..."
3. **03 Build** - "Fast execution, clean code. You see progress in days, not months..."
4. **04 Support** - "Launch is the beginning, not the end. We stay on retainer..."

### 9.7 Contact (`src/components/contact.tsx`)

**Layout:** max-w-xl centered

**Elements (top to bottom):**
1. Heading: "Let's build something."
2. Subline: "One message away from a system that changes how your business runs."
3. **WhatsApp CTA (primary):** Full-width green button, MessageCircle icon, "Message us on WhatsApp" → wa.me/27685394482
4. Separator: "or fill in the form below" (centered, xs, muted)
5. **Contact form** with 3 fields + submit button
6. Details: MapPin icon + "Cape Town, South Africa", Mail icon + email

**Form fields:**
- Name: text input, label "Name"
- Email: email input, label "Email", placeholder "your@email.com"
- Project: textarea (3 rows), label "Tell us about your project"
- Submit: full-width bordered button, "Send"

**Form submission:** mailto: fallback (v1). Opens email client with pre-filled subject + body.

**SIGNATURE TYPING ANIMATION (the key interaction):**
- Name and Project fields have animated placeholder text
- Animation cycles through 4 company examples:
  1. Name: "Airbnb" → Project: "Automate our guest bookings"
  2. Name: "Tesla" → Project: "Build a 3D product showcase"
  3. Name: "Nike" → Project: "Scale our e-commerce system"
  4. Name: "Your company" → Project: "Your next big idea"

**Typing animation sequence per cycle:**
1. Type Name field (80ms/char) - cursor blinks on Name field
2. Pause 300ms
3. Type Project field (80ms/char) - cursor moves to Project field
4. Pause 2000ms (cursor stops blinking)
5. Delete Project field (40ms/char, reverse) - cursor on Project
6. Delete Name field (40ms/char, reverse) - cursor on Name
7. Pause 500ms
8. Loop to next cycle

**Cursor:** 1px wide, terminal green, blinking at 530ms (CSS animation), appears on `activeField`

**STOPS INSTANTLY** on any user interaction (click/focus on any form field). Sets `isInteracted = true` and `animationRef.current.cancelled = true`. Clears animated text. Never restarts.

**Implementation:** Async/await with cancellation token pattern. `sleep()` checks `ctrl.cancelled` before resolving. All setters update React state for the overlay text.

### 9.8 Footer (`src/components/footer.tsx`)

**Background:** `bg-dim-bg` (#111111), `border-t border-border`

**Layout: 3-column CSS grid** (`md:grid-cols-3 gap-8`), stacked on mobile

**Left column - Logo + tagline:**
- {alqode} logo (sm, bold, green brackets)
- Tagline: "Digital systems agency. Cape Town." (xs, muted)

**Center column - Navigate:**
- Label: "NAVIGATE" (10px, muted, uppercase, tracking-wider)
- Links: Services, Work, About, Process, Contact
- Smooth scroll on click (same as nav)
- Style: xs, white, hover terminal

**Right column - Connect:**
- Label: "CONNECT" (10px, muted, uppercase, tracking-wider)
- Links with Lucide brand icons:
  - WhatsApp (MessageCircle icon) → wa.me/27685394482
  - GitHub (Github icon) → github.com/alqode-dev
  - Instagram (Instagram icon) → instagram.com/alqode.dev
  - Email (Mail icon) → mailto:alqodez@gmail.com
- External links open in new tab, email uses mailto:

**Bottom:** Divider (`border-t border-border`) + centered copyright: "© 2026 {alqode}. All rights reserved."

---

## 10. CONTENT SOURCE OF TRUTH

**ALL site copy lives in `src/lib/constants.ts`.** Components never have hardcoded text.

Exports:
- `SITE` - name, domain, title, description, url, founder, location, email, whatsapp, github, instagram
- `NAV_LINKS` - array of {label, href} for nav sections
- `HERO` - tag, headline, headlineAccent, subline, primaryCta, secondaryCta, founderTag
- `SERVICES` - heading, subline, cards[] with icon/title/body
- `PORTFOLIO` - heading, headingAccent, subline, projects[] with name/description/tags/tech/image/fallbackImage/url
- `ABOUT` - heading, paragraphs[] with text/bold/highlight flags, founderImage path
- `PROCESS` - heading, subline, steps[] with num/title/description
- `CONTACT` - heading, subline, whatsappCta, separator, formFields, details, typingCycles[]
- `FOOTER` - tagline, copyright, navigate[], connect[] with label/href

---

## 11. ANIMATION SYSTEM

### Scroll Reveal (`src/lib/animations.ts`)

**`useScrollReveal(ref)`** - Custom hook using IntersectionObserver.

How it works:
1. Finds all `.reveal-item` elements inside the ref
2. Sets initial state: `opacity: 0`, `translateY(20px)`
3. Transition: `opacity 0.6s ease, transform 0.6s ease`
4. On intersection (threshold 0.1, rootMargin `-50px` bottom): reveals with stagger
5. Stagger delay: `index * 0.15s` (0.15s per item per spec)
6. Once revealed, unobserves (one-shot)

**Used in:** Services, Portfolio, Process, Contact sections. Each section wraps content in a ref and applies the hook.

**`useScrollRevealDramatic(ref)`** - Dramatic variant for About section.

Same mechanism as `useScrollReveal` but with more visible cascade:
- `translateY`: 32px (vs 20px)
- Stagger delay: `index * 0.25s` (vs 0.15s)
- Transition duration: 0.8s (vs 0.6s)
- Threshold: 0.15 (vs 0.1)
- rootMargin: `-80px` (vs `-50px`)

**Used in:** About section only.

### Hero Animations (custom, `src/components/hero.tsx`)

All implemented via `useState` + `useEffect` + `setTimeout`/`setInterval`:
- Typewriter: `setInterval` at 80ms, updates `tagText` state
- Word stagger: `setInterval` at 50ms, increments `wordsRevealed` counter
- Subline/CTA: `setTimeout` cascading after previous completes

### Contact Typing Animation (`src/components/contact.tsx`)

Async/await pattern with cancellation:
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

### Nav Menu Animation (Framer Motion)
- Overlay: `initial={{ x: "100%" }}`, `animate={{ x: 0 }}`, `exit={{ x: "100%" }}`
- Duration: 0.3s, tween, easeOut
- Links: `initial={{ opacity: 0, y: 20 }}`, delay: `i * 0.1`

### Process Timeline Animation
- Each step has its own IntersectionObserver (threshold 0.3, rootMargin `-100px`)
- Steps fade in individually as scrolled into view
- Line progress tied to revealed step count: `(revealedCount / 4) * 100`
- CSS `transition: width 0.6s ease` (desktop) / `height 0.6s ease` (mobile)
- Number circles: scale + opacity tied to individual step reveal state

### Services Icon Morphing (desktop only)
- Each card has IntersectionObserver (threshold 0.5, rootMargin `-100px`)
- When card enters view, `activeIndex` state updates
- Left sticky column: 3 overlaid icons with CSS opacity/scale transitions (0.5s)
- Active icon: `opacity: 1, scale: 1` / Inactive: `opacity: 0, scale: 0.8`

### Tech Marquee (`src/components/tech-marquee.tsx`)
- Pure CSS animation: `@keyframes marquee { 0% { translateX(0) } 100% { translateX(-50%) } }`
- 30s linear infinite loop, content duplicated twice for seamless effect
- Pauses on hover via `animation-play-state: paused`
- Shows all 14 tech logos with brand colors from `TECH_COLORS` map
- Performance: GPU-accelerated CSS transform, no JS animation loop

### Desktop Cursor Glow (`src/components/cursor-glow.tsx`)
- Only renders on `lg+` screens with non-touch input
- 400px diameter radial gradient (terminal green at 4% opacity)
- Follows mouse with 0.1s ease-out transition

### Cursor Blink (CSS)
```css
@keyframes cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
.animate-cursor-blink { animation: cursor-blink 530ms infinite; }
```

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

## 13. PERFORMANCE CONTRACT

These are non-negotiable requirements:

| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse mobile (all categories) | 90+ | Not yet audited |
| First Load JS | <200KB gzipped | 145KB |
| No Three.js/WebGL/particles | Enforced | Yes |
| All animations one-shot or scroll-triggered | Enforced | Yes |
| Images via Next.js Image component | Enforced | Yes |
| Fonts via next/font/google | Zero FOUT | Yes |
| No continuously running animations | Enforced | Yes (except cursor blink CSS + tech marquee CSS transform) |

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
| `founder.jpg` | `public/images/` | About section | Founder headshot, black tee, neutral bg |
| `masjid-notify.png` | `public/images/` | Portfolio | Masjid Notify feature showcase + tech badges |
| `faida-automation.png` | `public/images/` | Portfolio | n8n workflow (ADIB Bank automation pipeline) |
| `bochi-cafe.png` | `public/images/` | Portfolio | Bochi Cafe hero page with illustrations |

### Fallback images:
| File | Purpose |
|------|---------|
| `bochi.webp` | Bochi Cafe fallback if main image fails |
| `faida.webp` | FAIDA fallback if main image fails |

### Legacy images (unused, can be cleaned up):
`express.webp`, `javascript.webp`, `mongo.webp`, `mysql.webp`, `next.webp`, `next1.webp`, `next2.webp`, `nextBL.webp`, `node.webp`, `node2.webp`, `react.webp`, `react2.webp`, `typescript.webp` - These were for the old 3D tech stack spheres.

### Image handling
All images use Next.js `<Image>` component with:
- `fill` + `object-cover` for responsive sizing
- `sizes` prop for proper srcset generation
- `onError` handler with fallback logic
- Automatic AVIF/WebP optimization via `next.config.mjs`

---

## 17. HOW TO UPDATE CONTENT

### All content → `src/lib/constants.ts`

**Add a new portfolio project:**
```typescript
// Add to PORTFOLIO.projects array
{
  name: "Project Name",
  description: "What you built and the result.",
  tags: ["Tag1", "Tag2"],
  tech: ["React", "Next.js"],  // Must match keys in TECH_ICON_MAP
  image: "/images/project-screenshot.png",
  fallbackImage: "/images/project-fallback.webp",
  url: "https://example.com",  // or null
}
```

**Add a new tech icon** (for portfolio pills and marquee):
1. Add SVG component to `src/components/tech-icons.tsx` (must accept `{ className, size, style }` props)
2. Add entry to `TECH_ICON_MAP` at bottom of file
3. Add brand color to `TECH_COLORS` map (hex string)
4. Use the exact key string in project's `tech` array

**Update social links:**
Modify `SITE` object and `FOOTER.connect` array in constants.ts.

**Update contact typing cycles:**
Modify `CONTACT.typingCycles` array in constants.ts.

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

## 19. KNOWN GOTCHAS

1. **`next.config.ts` NOT supported in Next.js 14** - Must use `.mjs` or `.js`. The `.ts` extension causes build failure.

2. **Windows `del` command** doesn't work in bash shell - use `rm -f` or `rm -rf` instead.

3. **OG image uses edge runtime** - `opengraph-image.tsx` has `export const runtime = "edge"` which makes that route dynamic. This is expected.

4. **Tailwind `screens` in `extend`** adds to defaults, doesn't replace them. Default `sm: 640px` still exists alongside custom `sm: 480px`. Use custom breakpoints consistently.

5. **Lucide icon typing** - Use `LucideIcon` type from `lucide-react` for icon records, not `React.ComponentType<{size?: number}>`.

6. **GSAP installed but unused** - `gsap` is in package.json but no component imports it. Kept for potential future use. Using IntersectionObserver for scroll reveals instead (lighter weight, same visual result).

---

## 20. VERSION HISTORY

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

## 21. TESTING CHECKLIST

### Pre-Push
- [ ] `npm run build` passes with zero errors
- [ ] `npm run dev` loads at localhost:3000
- [ ] No console errors
- [ ] All 7 sections visible in correct order

### Mobile (375px viewport)
- [ ] Nav hamburger opens and closes
- [ ] Scroll works after menu close
- [ ] Hero typewriter + word stagger plays
- [ ] Services cards stack with inline icons
- [ ] Portfolio cards single column
- [ ] About photo above text
- [ ] Process steps fade in individually on scroll
- [ ] Tech marquee scrolls horizontally
- [ ] Contact typing animation cycles
- [ ] WhatsApp CTA links correctly
- [ ] Footer stacks cleanly

### Desktop (1440px viewport)
- [ ] Nav shows horizontal links + CTA
- [ ] Hero animation sequence plays fully
- [ ] Services sticky icon morphs as cards scroll (Braces → Zap → Shield)
- [ ] Tech marquee scrolls, pauses on hover
- [ ] Portfolio 3-column grid
- [ ] About side-by-side (photo left, text right)
- [ ] Process steps fade in one by one, line draws to each
- [ ] About paragraphs cascade with visible 0.25s stagger gaps
- [ ] Portfolio tech pills show colored brand icons
- [ ] Contact typing animation cycles
- [ ] Cursor glow follows mouse
- [ ] Footer 3-column grid
- [ ] Scroll-to-top button appears

### Performance
- [ ] Lighthouse mobile 90+ (all categories)
- [ ] First Load JS under 200KB
- [ ] Images loading via Next.js Image (WebP/AVIF)
- [ ] No layout shift (CLS near 0)

---

## 22. FUTURE ROADMAP

### Immediate (before launch)
- [x] Add 4 required images to `public/images/` (done: founder.jpg, masjid-notify.png, faida-automation.png, bochi-cafe.png)
- [x] Add JSON to FAIDA tech stack in constants.ts
- [x] Expand tech stacks across all projects to showcase breadth
- [ ] Lighthouse audit + fixes
- [ ] Cross-browser testing

### Post-launch
- [ ] Wire contact form to Resend API (replace mailto)
- [ ] Notion CMS integration for portfolio (ISR with `revalidate: 3600`)
- [ ] Analytics review after 1 week live

### Future
- [ ] Blog/case studies section
- [ ] Individual project detail pages
- [ ] Testimonials section
- [ ] Dark/light theme toggle

---

## QUICK REFERENCE CARD

```
┌─────────────────────────────────────────────────────────────┐
│  ALQODE WEBSITE v2.0 - QUICK REFERENCE                     │
├─────────────────────────────────────────────────────────────┤
│  Dev:            npm run dev                                │
│  Build:          npm run build                              │
│  Deploy:         git push main (auto-deploys to Vercel)     │
├─────────────────────────────────────────────────────────────┤
│  Content:        src/lib/constants.ts (ALL copy here)       │
│  Components:     src/components/*.tsx                       │
│  Styling:        Tailwind classes (no separate CSS files)   │
│  Animations:     src/lib/animations.ts (useScrollReveal*)   │
│  Tech icons:     src/components/tech-icons.tsx              │
├─────────────────────────────────────────────────────────────┤
│  Colors:         void=#0a0a0a  terminal=#10b981             │
│  Font:           Space Grotesk (via next/font/google)       │
│  Breakpoints:    xs=375 sm=480 md=768 lg=1024 xl=1440      │
├─────────────────────────────────────────────────────────────┤
│  Live:           https://alqode.com                         │
│  GitHub:         github.com/alqode-dev/alqode-website       │
│  WhatsApp:       wa.me/27685394482                          │
└─────────────────────────────────────────────────────────────┘
```

---

*Last Updated: February 10, 2026*
*Version: 2.1 (User Feedback Iteration)*
