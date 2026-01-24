# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Alqode portfolio website - a React/TypeScript single-page application featuring 3D graphics, scroll-triggered animations, and a physics-based tech stack visualizer.

## Commands

```bash
npm run dev      # Start dev server at localhost:5174
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint code quality check
npm run preview  # Preview production build locally
```

## Architecture

### Tech Stack
- **React 18** with TypeScript (strict mode)
- **Vite** for build tooling
- **Three.js** + React Three Fiber for 3D graphics
- **GSAP** with ScrollTrigger for animations
- **Lenis** for smooth scrolling
- Vanilla CSS with CSS variables (no framework)

### Key Patterns

**Lazy Loading 3D Components**
- `CharacterModel` and `TechStack` use `React.lazy()` + Suspense
- Heavy 3D assets deferred until needed for faster initial load

**Configuration-Driven Content**
- `src/config.ts` is the single source of truth for all content (developer info, projects, skills, about text)
- Update content here without touching component code

**Animation System**
- `src/components/utils/GsapScroll.ts` coordinates scroll-linked GSAP timelines
- `src/components/utils/initialFX.ts` handles initial page load animations (hero section text reveals)
- `src/utils/textSplitter.ts` provides text splitting for character/word/line animations (custom replacement for GSAP SplitText)
- Lenis smooth scroll integrated in Navbar.tsx

**Mobile Typewriter Effect (Hero Tagline)**
The hero tagline ("I build what others can't") uses a typewriter animation on mobile devices for increased visibility and engagement.

- **File**: `src/components/utils/initialFX.ts` (lines 17-79)
- **Breakpoint**: ≤768px viewport width
- **Implementation Details**:
  ```typescript
  // Mobile detection
  const isMobile = window.innerWidth <= 768;

  // Typewriter animation config
  gsap.to(taglineSplitter.chars, {
    opacity: 1,
    duration: 0.05,      // Quick reveal per character
    stagger: 0.08,       // 80ms between each character (typing speed)
    ease: "none",        // Linear for authentic typewriter feel
    delay: 0.5,          // Wait for page to settle
    onComplete: () => taglineElement.classList.add('typing-complete')
  });
  ```
- **CSS Blinking Cursor** (`src/components/styles/Landing.css` lines 318-346):
  - Uses `::after` pseudo-element with `|` character
  - Accent color (#10b981) cursor
  - `cursor-blink` keyframe animation (0.8s infinite)
  - `typing-complete` class triggers fade behavior after animation
- **Desktop Behavior**: Original slide-up + blur animation unchanged (>768px)
- **Mobile Enhancements**: Font-weight 700 for bolder text visibility

**State Management**
- `src/context/LoadingProvider.tsx` provides global loading state via React Context
- Use `useLoading()` hook to access loading state

**Responsive Layout**
- Desktop (>1024px): Full 3D character, complex animations
- Mobile: Simplified layout, character hidden
- `MainContainer.tsx` handles layout switching based on viewport

### Important Files
- `src/config.ts` - All site content configuration
- `src/components/MainContainer.tsx` - Layout orchestrator
- `src/components/Character/` - 3D character model with mouse tracking
- `src/components/utils/GsapScroll.ts` - GSAP ScrollTrigger timeline setup
- `src/components/utils/initialFX.ts` - Initial page load animations (hero text reveals, mobile typewriter)
- `src/context/LoadingProvider.tsx` - Loading state context

### 3D Graphics Structure
- `Character/Scene.tsx` - Three.js scene setup
- `Character/utils/` - Lighting, animations, mouse tracking, resize handling
- `TechStack.tsx` - Physics-based floating tech spheres
- Models stored in `public/models/`, images in `public/images/`

## Code Conventions

- TypeScript strict mode enabled
- Component styles in `src/components/styles/` with matching filenames
- Error boundary wraps entire app in `main.tsx`
- Aria labels required on interactive elements

---

## Bug Fixes & Change Log

### 2026-01-24: Mobile UI Fixes (Commit: 97e164c)

#### Issue 1: WhatIDo Section Boxes Blocking Each Other on Mobile
**Problem:** When a service box was tapped/expanded on mobile, it would block/overlap the other boxes.

**Root Cause:** A conflicting "Touch device support" media query at the bottom of `WhatIDo.css` (lines 457-494) was overriding the existing mobile styles. It set `min-height: auto` and `padding: 25px` for ALL states including `.what-content-active` and `.what-sibling`, conflicting with the proper mobile layouts already defined in `@media (max-width: 900px)`, `(max-width: 550px)`, and `(max-width: 375px)`.

**Fix Applied:**
- **File:** `src/components/styles/WhatIDo.css`
- **Change:** Deleted the entire "Touch device support" media query block (lines 457-494)
- The existing mobile media queries already handle layout correctly with `height: auto` on all boxes

#### Issue 2: Footer (Contact Section) Not Visible on Mobile
**Problem:** Users cannot scroll to the footer/contact section on mobile devices.

**Suspected Cause:** The mobile menu toggle sets `document.body.style.overflow = "hidden"` when opened. If there's any state issue or the menu doesn't properly reset, body overflow stays hidden, preventing scroll to footer.

**Fix Applied:**
- **File:** `src/components/Navbar.tsx`
- **Change:** Added two useEffect hooks:
  ```typescript
  // Cleanup body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Reset overflow when loading state changes
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "";
      setIsMobileMenuOpen(false);
    }
  }, [isLoading]);
  ```

**✅ STATUS: FIXED (Commit: 3422808, refined in subsequent commit)**

**Root Cause Found:** The previous "fix" that tried to bypass Lenis on mobile actually broke scrolling entirely. The real issue was:
1. `initialFX.ts` sets `overflowY: auto` to enable scrolling
2. But `Navbar.tsx` mobile menu was resetting `overflow = ""` when closed
3. This removed the inline style, reverting to CSS `overflow: hidden`
4. Result: scroll broke after using mobile menu

**Correct Fix Applied:**

1. **File:** `src/components/utils/initialFX.ts`
   - Reverted to original simple approach - Lenis works on ALL devices including mobile
   - Lenis has `touchMultiplier: 1.3` which handles touch scrolling
   ```typescript
   export function initialFX() {
     document.body.style.overflowY = "auto";
     if (lenis) {
       lenis.start();
     }
     // ...
   }
   ```

2. **File:** `src/components/Navbar.tsx`
   - Fixed mobile menu overflow handling to preserve scroll after closing
   - When closing menu, now restores `overflowY: auto` instead of clearing all overflow
   ```typescript
   const closeMobileMenu = () => {
     setIsMobileMenuOpen(false);
     document.body.style.overflow = "";
     document.body.style.overflowY = "auto";  // Restore scroll capability
   };
   ```

3. **File:** `src/index.css`
   - Removed the broken mobile scroll override that was conflicting with Lenis

#### Issue 3: Loading Text Overlap on Mobile
**Problem:** "W" from "Welcome" appears next to "L" from "Loading" on small mobile screens.

**Root Cause:** The `--Lsize` variable was too small for mobile (120px and 100px).

**Fix Applied:**
- **File:** `src/components/styles/Loading.css`
- Increased mobile widths:
  - ≤500px: 120px → **140px**
  - ≤375px: 100px → **120px**

### Testing Checklist for Mobile Fixes
- [ ] Footer (Contact section) visible when scrolling down on mobile
- [ ] All 3 WhatIDo boxes fully visible, no overlapping
- [ ] Each WhatIDo box content readable
- [ ] Hamburger menu opens/closes properly
- [ ] Body scrolls normally after menu close
- [ ] Desktop hover effects still work on WhatIDo section
- [ ] Loading screen text displays without overlap on mobile

---

## Known Issues & Future Investigation

*No critical issues at this time.*

### Resolved Issues
- ✅ Footer not visible on mobile - Fixed by using Lenis on all devices + proper overflow handling
- ✅ WhatIDo boxes overlapping on mobile - Fixed by removing conflicting media query (Commit: 97e164c)
- ✅ Loading text overlap on mobile - Fixed by increasing --Lsize values
