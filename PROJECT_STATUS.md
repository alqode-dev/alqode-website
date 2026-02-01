# PROJECT STATUS - Alqode Website

> **Last Updated:** February 1, 2026
> **Status:** Production Ready
> **Version:** 1.0.0

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Complete File Structure](#3-complete-file-structure)
4. [Architecture & Data Flow](#4-architecture--data-flow)
5. [Component Documentation](#5-component-documentation)
6. [Custom Hooks](#6-custom-hooks)
7. [CSS Architecture](#7-css-architecture)
8. [Animation Systems](#8-animation-systems)
9. [3D Character System](#9-3d-character-system)
10. [Scroll System (Lenis)](#10-scroll-system-lenis)
11. [Loading System](#11-loading-system)
12. [Contact Form System](#12-contact-form-system)
13. [Session Changes (Feb 1, 2026)](#13-session-changes-feb-1-2026)
14. [How To Update Content](#14-how-to-update-content)
15. [Commands & Deployment](#15-commands--deployment)
16. [Known Behaviors & Edge Cases](#16-known-behaviors--edge-cases)
17. [Future Roadmap](#17-future-roadmap)
18. [Quick Reference Card](#18-quick-reference-card)

---

## 1. PROJECT OVERVIEW

### What Is This?
A premium digital agency portfolio website for **Alqode**, featuring:
- Interactive 3D character model with mouse/touch tracking
- Physics-based floating tech stack spheres
- Smooth scroll animations with GSAP + Lenis
- Mobile-first responsive design
- WhatsApp-integrated contact form with animated placeholders

### Business Info
| Field | Value |
|-------|-------|
| **Business Name** | Alqode |
| **Owner** | Mohammed Hamdaan Dhaler |
| **Role** | Founder |
| **Location** | South Africa |
| **Email** | alqodez@gmail.com |
| **WhatsApp** | +27 68 539 4482 |
| **Instagram** | @alqode.dev |
| **Domain** | alqode.com |

### Live URLs
| Environment | URL |
|-------------|-----|
| Production | https://alqode.com |
| Backup | https://alqode-website.vercel.app |
| Local Dev | http://localhost:5174 |
| Local Preview | http://localhost:4173 |

---

## 2. TECH STACK & DEPENDENCIES

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| TypeScript | 5.5.3 | Type Safety (Strict Mode) |
| Vite | 5.4.1 | Build Tool & Dev Server |

### 3D Graphics
| Technology | Version | Purpose |
|------------|---------|---------|
| Three.js | 0.168.0 | 3D Graphics Engine |
| @react-three/fiber | 8.17.10 | React renderer for Three.js |
| @react-three/drei | 9.120.4 | Three.js helpers (loaders, controls) |
| @react-three/rapier | 1.5.0 | Physics engine for TechStack spheres |
| @react-three/cannon | 6.6.0 | Alternative physics (unused currently) |
| three-stdlib | 2.33.0 | Three.js standard library extensions |

### Animation
| Technology | Version | Purpose |
|------------|---------|---------|
| GSAP | 3.12.7 | Animation library |
| ScrollTrigger | (bundled) | Scroll-based animations |
| Lenis | 1.3.15 | Smooth scrolling |

### UI Components
| Technology | Version | Purpose |
|------------|---------|---------|
| react-fast-marquee | 1.6.5 | Loading screen text marquee |
| react-icons | 5.3.0 | Icon library (Material Design) |

### Analytics & Deployment
| Technology | Version | Purpose |
|------------|---------|---------|
| @vercel/analytics | 1.4.1 | Usage analytics |
| Vercel | - | Hosting (auto-deploy from main) |

### Dev Dependencies
| Technology | Version | Purpose |
|------------|---------|---------|
| @playwright/test | 1.41.0 | E2E Testing |
| ESLint | 9.9.0 | Code linting |
| typescript-eslint | 8.0.1 | TypeScript linting |

---

## 3. COMPLETE FILE STRUCTURE

```
alqode-website/
├── public/
│   ├── alqode-favicon.svg          # Site favicon
│   ├── og-image.png                # Open Graph social image
│   ├── robots.txt                  # SEO robots file
│   ├── sitemap.xml                 # SEO sitemap
│   ├── draco/                      # DRACO decoder for 3D compression
│   │   ├── draco_decoder.js
│   │   └── draco_decoder.wasm
│   ├── images/                     # Project & tech images
│   │   ├── bochi.webp              # Bochi project screenshot
│   │   ├── bochi-logo.jpg          # Bochi logo
│   │   ├── faida.webp              # Faida project screenshot
│   │   ├── faida-logo.jpeg         # Faida logo
│   │   ├── react.webp, react2.webp # TechStack sphere textures
│   │   ├── next.webp, next1.webp, next2.webp, nextBL.webp
│   │   ├── node.webp, node2.webp
│   │   ├── typescript.webp
│   │   ├── javascript.webp
│   │   ├── mongo.webp
│   │   ├── mysql.webp
│   │   └── express.webp
│   └── models/                     # 3D model files
│       ├── character.glb           # Main 3D character model
│       ├── character.enc           # Encrypted model backup
│       ├── char_enviorment.hdr     # Environment lighting map
│       └── encrypt.cjs             # Encryption utility
│
├── src/
│   ├── main.tsx                    # App entry point (React root + ErrorBoundary)
│   ├── App.tsx                     # Root component (LoadingProvider + lazy loading)
│   ├── App.css                     # App-level styles (fallback loader)
│   ├── index.css                   # Global styles (CSS variables, fonts, resets)
│   ├── config.ts                   # ⭐ ALL SITE CONTENT (single source of truth)
│   ├── vite-env.d.ts               # Vite TypeScript definitions
│   │
│   ├── components/
│   │   ├── Navbar.tsx              # Navigation + Lenis initialization
│   │   ├── Landing.tsx             # Hero section with CTAs
│   │   ├── About.tsx               # About section
│   │   ├── WhatIDo.tsx             # Services (3 expandable boxes)
│   │   ├── Career.tsx              # Careers/positions section
│   │   ├── Work.tsx                # Projects horizontal scroll
│   │   ├── WorkImage.tsx           # Project image with hover effects
│   │   ├── TechStack.tsx           # 3D physics spheres (lazy loaded)
│   │   ├── Contact.tsx             # Contact form + WhatsApp integration
│   │   ├── MainContainer.tsx       # Layout orchestrator
│   │   ├── Loading.tsx             # Loading screen + progress logic
│   │   ├── Cursor.tsx              # Custom cursor (desktop only)
│   │   ├── SocialIcons.tsx         # Fixed social icons sidebar
│   │   ├── HoverLinks.tsx          # Animated hover text effect
│   │   ├── ErrorBoundary.tsx       # Error catching wrapper
│   │   │
│   │   ├── Character/              # 3D CHARACTER SYSTEM
│   │   │   ├── index.tsx           # Export wrapper
│   │   │   ├── exports.ts          # Named exports
│   │   │   ├── Scene.tsx           # ⭐ Main Three.js scene setup
│   │   │   └── utils/
│   │   │       ├── character.ts    # Model loading (GLTFLoader, DRACOLoader)
│   │   │       ├── lighting.ts     # Scene lighting setup
│   │   │       ├── animationUtils.ts # Character animations
│   │   │       ├── mouseUtils.ts   # Mouse/touch tracking
│   │   │       ├── resizeUtils.ts  # Responsive resize handling
│   │   │       └── decrypt.ts      # Model decryption utility
│   │   │
│   │   ├── utils/
│   │   │   ├── initialFX.ts        # ⭐ Page load animations + Lenis start
│   │   │   ├── GsapScroll.ts       # ScrollTrigger timeline setup
│   │   │   └── splitText.ts        # Text splitting for animations
│   │   │
│   │   └── styles/                 # Component CSS files
│   │       ├── Navbar.css
│   │       ├── Landing.css
│   │       ├── About.css
│   │       ├── WhatIDo.css
│   │       ├── Career.css
│   │       ├── Work.css
│   │       ├── Contact.css
│   │       ├── Loading.css
│   │       ├── Cursor.css
│   │       ├── SocialIcons.css
│   │       ├── ErrorBoundary.css
│   │       └── style.css           # Shared/general styles
│   │
│   ├── hooks/
│   │   ├── useAnimatedPlaceholder.ts  # ⭐ Typewriter effect for form inputs
│   │   ├── useBreakpoint.ts           # Responsive breakpoint detection
│   │   └── useLoadingProgress.ts      # Loading progress tracking
│   │
│   ├── context/
│   │   └── LoadingProvider.tsx     # Global loading state context
│   │
│   ├── utils/
│   │   ├── textSplitter.ts         # Text animation utility (char/word splitting)
│   │   └── constants.ts            # Shared constants
│   │
│   ├── styles/
│   │   └── tokens.css              # Design tokens (unused currently)
│   │
│   └── data/
│       └── boneData.ts             # Character bone configuration
│
├── tests/                          # Playwright E2E tests
│   └── e2e/
│
├── dist/                           # Production build output
│
├── CLAUDE.md                       # AI assistant instructions
├── PROJECT_STATUS.md               # THIS FILE
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.app.json               # App-specific TS config
├── tsconfig.node.json              # Node-specific TS config
├── vite.config.ts                  # Vite configuration
├── eslint.config.js                # ESLint configuration
├── playwright.config.ts            # Playwright test configuration
├── index.html                      # HTML entry point
├── start-dev.bat                   # Windows dev server launcher
└── run-preview.bat                 # Windows preview server launcher
```

---

## 4. ARCHITECTURE & DATA FLOW

### Component Hierarchy
```
main.tsx
└── StrictMode
    └── ErrorBoundary
        └── App.tsx
            └── LoadingProvider (Context)
                ├── Loading.tsx (shown when isLoading=true)
                └── MainContainer.tsx
                    ├── Cursor.tsx
                    ├── Navbar.tsx (initializes Lenis)
                    ├── SocialIcons.tsx
                    ├── CharacterModel (lazy, desktop only)
                    └── <main id="main-content">
                        ├── Landing.tsx
                        │   └── CharacterModel (lazy, mobile only)
                        ├── About.tsx
                        ├── WhatIDo.tsx
                        ├── Career.tsx
                        ├── Work.tsx
                        ├── TechStack.tsx (lazy)
                        └── Contact.tsx
```

### Data Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                         config.ts                                │
│  (Single source of truth for all content)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
   ┌──────────┐        ┌──────────┐        ┌──────────┐
   │ Landing  │        │   Work   │        │ Contact  │
   │ (tagline)│        │(projects)│        │ (social) │
   └──────────┘        └──────────┘        └──────────┘
```

### Loading Flow
```
1. App mounts → LoadingProvider initializes (isLoading=true)
2. Loading.tsx shown with animated progress bar
3. CharacterModel lazy loads → Scene.tsx mounts
4. Scene.tsx calls setProgress() from Loading.tsx
5. 3D model loads via GLTFLoader
6. progress.loaded() resolves → setLoading(100)
7. Loading.tsx transitions to "Welcome" state
8. initialFX() called → Lenis starts, animations begin
9. setIsLoading(false) → Loading.tsx unmounts
10. Main content visible
```

---

## 5. COMPONENT DOCUMENTATION

### App.tsx
**Purpose:** Root component with lazy loading setup

```typescript
// Key features:
- Lazy loads CharacterModel and MainContainer
- Wraps everything in LoadingProvider
- Shows AppFallback during initial chunk loading
```

### MainContainer.tsx
**Purpose:** Layout orchestrator, decides where 3D character renders

```typescript
// Key logic:
const { isDesktop } = useBreakpoint();

// Desktop (>1024px): Character renders at root level (fixed position)
{isDesktop && children}

// Mobile (≤1024px): Character renders inside Landing (inline)
<Landing>{!isDesktop && children}</Landing>
```

### Loading.tsx
**Purpose:** Loading screen with animated progress bar

```typescript
// State flow:
percent → 100 → loaded=true (600ms) → isLoaded=true (1000ms) → initialFX()

// Exported function:
setProgress(setLoading) → { loaded(), clear() }
- Phase 1: Fast progress 0-30% (50ms intervals)
- Phase 2: Slow crawl 30-90% (300ms intervals)
- loaded(): Quick completion to 100%
- clear(): Force complete (for errors/timeouts)
```

### Navbar.tsx
**Purpose:** Navigation + Lenis smooth scroll initialization

```typescript
// Key exports:
export let lenis: Lenis | null = null;

// Lenis config:
{
  duration: 1.7,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1.7,
  touchMultiplier: 1.3
}

// Mobile menu scroll lock:
// Opening: document.body.style.overflow = "hidden"
// Closing: document.body.style.overflow = ""; overflowY = "auto"
```

### Contact.tsx
**Purpose:** Contact form with WhatsApp integration

```typescript
// Features:
- Animated placeholders via useAnimatedPlaceholder hook
- Form submission copies to clipboard + opens WhatsApp
- Toast notification on success
- Service dropdown from config.services[]
```

### Work.tsx
**Purpose:** Projects section with horizontal scroll

```typescript
// Desktop: Horizontal scroll via GSAP ScrollTrigger pin
// Mobile (≤768px): Vertical stack, no pin

// CTA_BOX_WIDTH = 350 (width of "Ready to be next?" box)
```

### WhatIDo.tsx
**Purpose:** Services section with expandable boxes

```typescript
// Touch devices: Click to expand/collapse
// Desktop: Hover to expand

// Uses ScrollTrigger.isTouch to detect touch capability
```

### TechStack.tsx
**Purpose:** Physics-based floating tech spheres

```typescript
// Uses @react-three/rapier for physics
// Lazy loaded to reduce initial bundle
// Spheres have tech logos as textures
```

---

## 6. CUSTOM HOOKS

### useAnimatedPlaceholder
**Location:** `src/hooks/useAnimatedPlaceholder.ts`

**Purpose:** Creates typewriter effect for form input placeholders

```typescript
interface Options {
  phrases: string[];      // Array of phrases to cycle through
  typingSpeed?: number;   // ms per character (default: 80)
  deleteSpeed?: number;   // ms per character delete (default: 40)
  pauseDuration?: number; // ms pause after typing (default: 2000)
}

interface Return {
  placeholder: string;    // Current text to display
  isAnimating: boolean;   // Whether animation is running
  onFocus: () => void;    // Call on input focus
  onBlur: () => void;     // Call on input blur
  onInput: (hasValue: boolean) => void; // Call when input changes
}

// Key behavior:
// - Never goes below 1 character (prevents fallback flash)
// - Deletes to 1 char, then swaps to first char of next phrase
// - Pauses animation on focus/input
// - Resumes on blur if no user input
```

### useBreakpoint
**Location:** `src/hooks/useBreakpoint.ts`

**Purpose:** Detects current viewport breakpoint

```typescript
const BREAKPOINTS = {
  mobile: 480,   // isMobile: width <= 480
  tablet: 768,   // isTablet: width <= 768
  desktop: 1024, // isDesktop: width > 1024
  wide: 1400     // isWide: width >= 1400
};

// Returns: { isMobile, isTablet, isDesktop, isWide, width }
```

---

## 7. CSS ARCHITECTURE

### Global Variables (index.css)
```css
:root {
  --accentColor: #10b981;      /* Green accent */
  --backgroundColor: #1d1d1d;  /* Dark background */
  --vh: 100svh;                /* Viewport height */
  --cWidth: calc(100% - 30px); /* Container width */
  --cMaxWidth: 1920px;         /* Max container width */

  /* Breakpoints (match useBreakpoint hook) */
  --bp-mobile: 480px;
  --bp-tablet: 768px;
  --bp-desktop: 1024px;
  --bp-wide: 1400px;
}
```

### Typography
```css
/* Body text */
font-family: "Inter", sans-serif;

/* Headings */
font-family: "Syne", sans-serif;

/* Logo */
font-family: "Space Grotesk", sans-serif;
```

### File Mapping
| Component | CSS File |
|-----------|----------|
| Global | `src/index.css` |
| App fallback | `src/App.css` |
| Navbar | `src/components/styles/Navbar.css` |
| Landing | `src/components/styles/Landing.css` |
| About | `src/components/styles/About.css` |
| WhatIDo | `src/components/styles/WhatIDo.css` |
| Career | `src/components/styles/Career.css` |
| Work | `src/components/styles/Work.css` |
| Contact | `src/components/styles/Contact.css` |
| Loading | `src/components/styles/Loading.css` |
| Cursor | `src/components/styles/Cursor.css` |
| SocialIcons | `src/components/styles/SocialIcons.css` |
| ErrorBoundary | `src/components/styles/ErrorBoundary.css` |
| Shared | `src/components/styles/style.css` |

### Responsive Breakpoints
```css
@media (max-width: 375px)  { /* Extra small phones */ }
@media (max-width: 414px)  { /* Small phones */ }
@media (max-width: 480px)  { /* Large phones */ }
@media (max-width: 768px)  { /* Tablets */ }
@media (max-width: 900px)  { /* Small laptops */ }
@media (max-width: 1024px) { /* Tablets/laptops */ }
@media (max-width: 1300px) { /* Medium screens */ }
@media (max-width: 1400px) { /* Large screens */ }
@media (max-width: 1600px) { /* Extra large */ }
@media (min-width: 1400px) { /* Wide screens */ }
```

---

## 8. ANIMATION SYSTEMS

### GSAP Timelines (GsapScroll.ts)

**Character Timeline (Desktop only):**
```
Landing section scroll:
- Character rotation Y: 0 → 0.7
- Camera zoom: z 10 → 22
- Character slides left 25%
- Landing content fades out

About section scroll:
- Camera pulls back: z 75, y 8.4
- Character rotates to face monitor
- Monitor screen turns on
- WhatIDo boxes fade in

WhatIDo section scroll:
- Character slides up and out
```

**Career Timeline:**
```
- Timeline bar grows from 10% to 100% height
- Job cards fade in with stagger
- Career dot animation stops
```

### Initial Load Animations (initialFX.ts)

**Mobile (≤768px):**
```
- Tagline: Typewriter effect (chars reveal with stagger)
- H1, H2: Blur + slide up animation
- Blinking cursor after typing complete
```

**Desktop (>768px):**
```
- All text: Blur + slide up animation
- Characters stagger in sequence
```

**Both:**
```
- Header, icons, nav-fade: Fade in
- Body background: Transitions from #1d1d1d to #0b080c
- Lenis scroll: Starts
```

---

## 9. 3D CHARACTER SYSTEM

### Files
```
src/components/Character/
├── Scene.tsx           # Main scene setup
├── utils/character.ts  # Model loading
├── utils/lighting.ts   # Lights setup
├── utils/animationUtils.ts # Animations
├── utils/mouseUtils.ts # Mouse/touch tracking
└── utils/resizeUtils.ts # Responsive handling
```

### Scene.tsx Key Features

**Renderer Setup:**
```typescript
const renderer = new THREE.WebGLRenderer({
  alpha: true,      // Transparent background
  antialias: true   // Smooth edges
});
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
```

**Camera:**
```typescript
const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
camera.position.set(0, 13.1, 24.7);
camera.zoom = 1.1;
```

**Loading with Timeout:**
```typescript
// 10-second timeout prevents infinite loading
const loadingTimeout = setTimeout(() => {
  console.warn('3D model load timeout - forcing completion');
  progress.clear();
}, 10000);

loadCharacter()
  .then((gltf) => {
    clearTimeout(loadingTimeout);
    // ... setup character
    progress.loaded().then(() => {
      setTimeout(() => {
        light.turnOnLights();
        animations.startIntro();
      }, 500); // 500ms delay for GPU stabilization
    });
  })
  .catch((error) => {
    clearTimeout(loadingTimeout);
    progress.clear(); // Fail gracefully
  });
```

**Mouse Tracking:**
```typescript
// Head bone follows mouse position
handleHeadRotation(
  headBone,
  mouse.x, mouse.y,
  interpolation.x, interpolation.y,
  THREE.MathUtils.lerp
);
```

**Touch Handling:**
```typescript
// 200ms debounce before enabling touch-move tracking
// Prevents accidental head movement during scroll
const onTouchStart = (event) => {
  debounce = setTimeout(() => {
    // Enable touch tracking
  }, 200);
};

const onTouchEnd = () => {
  // Clear debounce FIRST to prevent orphaned handlers
  if (debounce) clearTimeout(debounce);
  // Then cleanup touch handlers
};
```

---

## 10. SCROLL SYSTEM (LENIS)

### How It Works

1. **CSS Base:** `body { overflow: hidden }` disables native scroll
2. **Lenis Init:** `Navbar.tsx` creates Lenis instance
3. **Lenis Start:** `initialFX.ts` calls `lenis.start()` after loading
4. **Overflow Fix:** `initialFX.ts` sets `document.body.style.overflowY = "auto"`

### Configuration (Navbar.tsx)
```typescript
lenis = new Lenis({
  duration: 1.7,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical",
  gestureOrientation: "vertical",
  smoothWheel: true,
  wheelMultiplier: 1.7,
  touchMultiplier: 1.3,
  infinite: false,
});
```

### GSAP Integration
```typescript
// Connect Lenis to ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// Use GSAP ticker for smooth sync
gsap.ticker.add((time) => lenis?.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### Critical Rules
```typescript
// ❌ NEVER do this (breaks scroll):
document.body.style.overflow = "";

// ✅ ALWAYS restore overflowY:
document.body.style.overflow = "";
document.body.style.overflowY = "auto";
```

---

## 11. LOADING SYSTEM

### State Machine
```
Initial → [percent < 100] → Animating progress bar
       ↓
[percent >= 100] → Wait 600ms → loaded=true
       ↓
Wait 1000ms → isLoaded=true
       ↓
Import initialFX → Wait 900ms → Execute → setIsLoading(false)
       ↓
Loading screen unmounts → Main content visible
```

### Progress Function (Loading.tsx)
```typescript
export const setProgress = (setLoading) => {
  // Phase 1: Fast 0-30% (every 50ms, +2%)
  // Phase 2: Slow 30-90% (every 300ms, +1%)
  // loaded(): Quick 90-100% (every 20ms, +5%)
  // clear(): Immediately set to 100%

  return { loaded, clear };
};
```

### Timeout Protection (Scene.tsx)
```typescript
// If model takes >10 seconds, force complete
const loadingTimeout = setTimeout(() => {
  progress.clear();
}, 10000);
```

---

## 12. CONTACT FORM SYSTEM

### Form Fields
1. **Name** - Text input with animated placeholder
2. **Service** - Dropdown from `config.services[]`
3. **Description** - Textarea with animated placeholder

### Animated Placeholders
```typescript
// Name field cycles through:
["Tesla", "Spotify", "Netflix", "Airbnb", "Your Company", "Startup Inc"]

// Description field cycles through:
["Help me automate my quotations", "Build me a professional website", ...]
```

### Submission Flow
```typescript
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const message = `Hi, I'm ${name}.\n\nI need: ${service}\n\nAbout my project: ${description}`;

  // 1. Copy to clipboard (backup)
  try {
    await navigator.clipboard.writeText(message);
  } catch (err) {
    console.warn('Clipboard copy failed');
  }

  // 2. Open WhatsApp
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/27685394482?text=${encodedMessage}`, '_blank');

  // 3. Show success toast
  setIsSuccess(true);
  setShowToast(true);
};
```

---

## 13. SESSION CHANGES (FEB 1, 2026)

### Production Readiness Fixes Applied

| Issue | File(s) Changed | Fix Applied |
|-------|-----------------|-------------|
| Fake loading progress | `Loading.tsx` | Added slow crawl phase (30-90%) to prevent stalling |
| 2.5s artificial delay | `Scene.tsx` | Reduced to 500ms after model load |
| No 3D fallback | `Scene.tsx` | Added 10-second timeout with `progress.clear()` |
| WhatsApp loses data | `Contact.tsx` | Copies message to clipboard before opening WhatsApp |
| Touch handler leak | `Scene.tsx` | Clear debounce timeout FIRST in `onTouchEnd` |
| Mobile horizontal scroll | `Work.css` | Added `overflow-x: hidden` to work section |
| Form placeholder glitch | `useAnimatedPlaceholder.ts` | Complete rewrite - never goes below 1 char |

### Files Modified This Session
```
src/components/Loading.tsx        - Progress bar improvements
src/components/Character/Scene.tsx - Timeout + delay reduction + touch fix
src/components/Contact.tsx        - Clipboard backup + async handler
src/components/styles/Work.css    - Mobile overflow fix
src/hooks/useAnimatedPlaceholder.ts - Complete rewrite for smooth animation
```

### New Files Created This Session
```
src/hooks/useAnimatedPlaceholder.ts - Typewriter effect hook
PROJECT_STATUS.md - This documentation file
```

---

## 14. HOW TO UPDATE CONTENT

### All Content Lives in `src/config.ts`

#### Update Company Info
```typescript
developer: {
  name: "Alqode",
  fullName: "Mohammed Hamdaan Dhaler",
  title: "Founder of Alqode",
  tagline: "I build what others can't.",
  description: "We build digital experiences..."
}
```

#### Add a New Project
```typescript
// In config.projects array:
{
  id: 3,                              // Increment from last
  title: "Project Name",
  category: "Category / Type",
  description: "What you built and the result.",
  technologies: "React, Node.js, etc.",
  image: "/images/project-name.webp", // Add image to public/images/
  url: "https://example.com"          // or null if no live link
}
```

#### Update Services Dropdown
```typescript
services: [
  "Website Development",
  "Web Application",
  "Automation & Workflows",
  // Add more...
]
```

#### Update Social Links
```typescript
contact: {
  email: "alqodez@gmail.com",
  whatsapp: "https://wa.me/27685394482",
  github: "https://github.com/alqode-dev",
  instagram: "https://www.instagram.com/alqode.dev/",
  // ...
}
```

---

## 15. COMMANDS & DEPLOYMENT

### NPM Scripts
```bash
npm run dev      # Start dev server (http://localhost:5174)
npm run build    # Production build (TypeScript check + Vite)
npm run preview  # Preview production build (http://localhost:4173)
npm run lint     # Run ESLint
npm run test     # Run Playwright E2E tests
```

### Windows Batch Files
```bash
start-dev.bat    # Starts dev server (sets Node.js PATH)
run-preview.bat  # Starts preview server (sets Node.js PATH)
```

### Deployment
```bash
# Auto-deploys to Vercel on push to main
git add .
git commit -m "Description"
git push origin main
```

### DNS Configuration (Namecheap)
| Type | Host | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com. |

---

## 16. KNOWN BEHAVIORS & EDGE CASES

### Mobile Menu Scroll Lock
When opening mobile menu, body scroll is locked. When closing, `overflowY: auto` MUST be restored or Lenis breaks.

### 3D Character Visibility
- Desktop (>1024px): Fixed position on right side
- Mobile (≤1024px): Hidden completely (saves performance)

### Work Section Scroll
- Desktop: Horizontal scroll with GSAP pin
- Mobile (≤768px): Vertical stack, no pin

### WhatIDo Boxes
- Desktop: Hover to expand
- Touch devices: Tap to expand/collapse

### Loading Progress
- Starts fast (0-30% in ~1.5s)
- Slows down (30-90% over ~18s max)
- Completes quickly when model actually loads
- 10-second timeout forces completion if model fails

### Form Animated Placeholders
- Never shows empty string (would trigger fallback)
- Deletes to 1 char, then swaps to next phrase's first char
- Pauses on focus, resumes on blur

---

## 17. FUTURE ROADMAP

### High Priority
- [ ] Add more portfolio projects as they're completed
- [ ] Lighthouse performance audit (aim for 90+)
- [ ] Image optimization (proper sizing, lazy load)

### Medium Priority
- [ ] Contact form email integration (not just WhatsApp)
- [ ] Analytics dashboard
- [ ] Blog/case studies section

### Low Priority
- [ ] Multi-language support
- [ ] Dark/light theme toggle
- [ ] More 3D interactions

### Code Quality
- [ ] Increase E2E test coverage
- [ ] Add unit tests for hooks
- [ ] Document all GSAP timelines

---

## 18. QUICK REFERENCE CARD

```
┌─────────────────────────────────────────────────────────────┐
│  ALQODE WEBSITE - QUICK REFERENCE                           │
├─────────────────────────────────────────────────────────────┤
│  Dev server:     npm run dev                                │
│  Build:          npm run build                              │
│  Preview:        npm run preview                            │
│  Deploy:         git push (auto-deploys to Vercel)          │
├─────────────────────────────────────────────────────────────┤
│  Content:        src/config.ts                              │
│  Styles:         src/components/styles/[Component].css      │
│  Scroll init:    src/components/utils/initialFX.ts          │
│  Lenis setup:    src/components/Navbar.tsx                  │
│  3D Scene:       src/components/Character/Scene.tsx         │
│  Form hook:      src/hooks/useAnimatedPlaceholder.ts        │
├─────────────────────────────────────────────────────────────┤
│  Accent color:   #10b981 (green)                            │
│  Background:     #1d1d1d (dark), #0b080c (black)            │
│  Fonts:          Inter (body), Syne (headings)              │
├─────────────────────────────────────────────────────────────┤
│  Desktop:        > 1024px (3D character visible)            │
│  Mobile:         ≤ 768px (vertical layouts)                 │
├─────────────────────────────────────────────────────────────┤
│  ⚠️  NEVER set overflow="" without restoring overflowY     │
│  ⚠️  ALWAYS test mobile scroll before pushing              │
│  ⚠️  3D model has 10s timeout fallback                     │
├─────────────────────────────────────────────────────────────┤
│  Live:           https://alqode.com                         │
│  GitHub:         github.com/alqode-dev/alqode-website       │
│  Vercel:         vercel.com/alqodes-projects/alqode-website │
└─────────────────────────────────────────────────────────────┘
```

---

*This document was generated on February 1, 2026 after a production readiness session.*
*To come back to this project, read this file first to understand the full context.*
