# Alqode Digital Agency Website - Project Status

**Last Updated:** January 23, 2026
**Status:** DEPLOYED & LIVE
**Build:** PASSING
**Live URL:** https://alqode.com
**Backup URL:** https://alqode-website.vercel.app

---

## Quick Links

| Resource | URL |
|----------|-----|
| **Live Site** | https://alqode.com |
| **Vercel Dashboard** | https://vercel.com/alqodes-projects/alqode-website |
| **GitHub Repo** | https://github.com/alqode-dev/alqode-website |
| **Namecheap DNS** | https://ap.www.namecheap.com/Domains/DomainControlPanel/alqode.com/advanceddns |

---

## Development Commands

```bash
# Navigate to project
cd "C:\Users\hamda\OneDrive\Desktop\Huzaif-Ahmed-Portfolio-Sixth"

# Start dev server (http://localhost:5174)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## Deployment Details (January 23, 2026)

### Hosting Stack
- **Platform:** Vercel (Hobby/Free tier)
- **Domain Registrar:** Namecheap
- **Domain:** alqode.com
- **SSL:** Auto-provisioned by Vercel
- **CDN:** Vercel Edge Network (global)

### DNS Configuration (Namecheap)
| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | 76.76.21.21 | Automatic |
| CNAME Record | www | cname.vercel-dns.com. | Automatic |

### Auto-Deployment
- **Trigger:** Any push to `main` branch
- **Preview Deployments:** Every PR gets a unique preview URL
- **Build Time:** ~6 seconds

### Git Configuration
```bash
git config user.email "alqodez@gmail.com"
git config user.name "alqode-dev"
```

---

## Mobile UI Issues - TO FIX

### Priority: HIGH

| Issue | Component | Description | Status |
|-------|-----------|-------------|--------|
| 1 | Landing | Hero tagline visibility on mobile | [x] **DONE** - Typewriter effect added |
| 2 | Landing | CTA buttons need mobile sizing | [ ] Pending |
| 3 | Navbar | Menu collapse/hamburger for mobile | [ ] Pending |
| 4 | About | Card grid needs responsive breakpoints | [ ] Pending |
| 5 | WhatIDo | 3-column layout breaks on tablet/mobile | [ ] Pending |
| 6 | Work | Horizontal scroll UX on touch devices | [ ] Pending |
| 7 | TechStack | 3D spheres performance on mobile | [ ] Pending |
| 8 | Contact | Form/info layout on narrow screens | [ ] Pending |
| 9 | Character | 3D model hidden on mobile (verify working) | [ ] Pending |
| 10 | Typography | Font sizes need mobile scale | [ ] Pending |

### Breakpoints to Target
```css
/* Mobile */
@media (max-width: 480px) { }

/* Tablet */
@media (max-width: 768px) { }

/* Small Desktop */
@media (max-width: 1024px) { }
```

### Testing Devices
- [ ] iPhone SE (375px)
- [ ] iPhone 14 Pro (393px)
- [ ] Samsung Galaxy S21 (360px)
- [ ] iPad Mini (768px)
- [ ] iPad Pro (1024px)

---

## Mobile Enhancements Applied (January 23, 2026)

### 1. Hero Tagline Typewriter Effect
**Problem:** Tagline "I build what others can't" not visible enough on mobile devices.

**Solution:** Implemented typewriter animation (mobile only, ≤768px):
- Character-by-character reveal with 80ms stagger
- Blinking cursor (`|`) in accent color (#10b981)
- Font-weight increased to 700 for better visibility
- `typing-complete` class added on animation finish for cursor control
- Desktop animation unchanged (slide-up + blur effect)

**Files Changed:**
- `src/components/utils/initialFX.ts` - Added mobile detection and typewriter GSAP animation
- `src/components/styles/Landing.css` - Added blinking cursor CSS and mobile font-weight

**Test:**
- Mobile (≤768px): Tagline types out letter-by-letter with blinking cursor
- Desktop (>768px): Original animation preserved
- No layout shifts during animation

---

## Quality Fixes Applied (January 18, 2026)

### 1. Event Listener Leak Fix (WhatIDo.tsx)
- Used `Map` to store handler references
- Proper cleanup in useEffect return

### 2. Null Safety (Work.tsx)
- Added null checks for DOM elements
- No more non-null assertions that could crash

### 3. Magic Number Documented (Work.tsx)
- `CTA_BOX_WIDTH = 350` with comment explaining purpose

### 4. Duplicate WhatsApp Removed (Contact.tsx)
- WhatsApp only appears once (in contact info as "Primary")
- Removed from social links section

### 5. Inline Style Replaced (Contact.tsx)
- Created `.contact-brand-highlight` CSS class
- No more `style={{color:'#10b981'}}`

### 6. Manifesto Text in Config (config.ts + Career.tsx)
```typescript
careers: {
    headline: "Building South Africa's Best Digital Team",
    manifesto: "We're not just filling roles...",
    cta: "Join the Mission",
    positionsTitle: "Open Positions"
}
```

### 7. Stable Keys (All Components)
- About.tsx: `key={claim}`, `key={item.title}`
- WhatIDo.tsx: `key={skill.title}`, `key={tool}`
- Career.tsx: `key={exp.position}`

### 8. Error Boundary Added
- New component: `src/components/ErrorBoundary.tsx`
- CSS: `src/components/styles/ErrorBoundary.css`
- Wraps entire app in `main.tsx`
- Graceful error handling with reload button

### 9. Aria Labels Added
- Landing.tsx: Both CTA buttons
- Work.tsx: Portfolio CTA button
- Contact.tsx: WhatsApp, Email, GitHub, Instagram links
- Career.tsx: Join the Mission button

---

## Project Architecture

### File Structure
```
src/
├── components/
│   ├── Character/           # 3D character with mouse tracking
│   │   ├── Scene.tsx
│   │   └── utils/
│   ├── styles/              # Component CSS files
│   ├── utils/
│   │   └── GsapScroll.ts    # ScrollTrigger timeline setup
│   ├── About.tsx
│   ├── Career.tsx
│   ├── Contact.tsx
│   ├── Cursor.tsx
│   ├── ErrorBoundary.tsx
│   ├── Landing.tsx
│   ├── Loading.tsx
│   ├── MainContainer.tsx    # Layout orchestrator
│   ├── Navbar.tsx
│   ├── SocialIcons.tsx
│   ├── TechStack.tsx        # Physics-based floating spheres
│   ├── WhatIDo.tsx
│   ├── Work.tsx
│   └── WorkImage.tsx
├── context/
│   └── LoadingProvider.tsx  # Global loading state
├── utils/
│   └── textSplitter.ts      # Text animation utility
├── config.ts                # ALL SITE CONTENT HERE
├── index.css
└── main.tsx
```

### Key Patterns

**1. Configuration-Driven Content**
- `src/config.ts` is the single source of truth
- Update content without touching components

**2. Lazy Loading 3D**
- `CharacterModel` and `TechStack` use `React.lazy()` + Suspense
- Heavy 3D assets deferred for faster initial load

**3. Animation System**
- GSAP + ScrollTrigger for scroll-linked animations
- Lenis for smooth scrolling
- Custom `textSplitter.ts` for text animations
- Mobile typewriter effect for hero tagline (see below)

**4. Mobile Typewriter Effect (Hero Tagline)**
The hero tagline uses a typewriter animation on mobile for increased visibility.

| Property | Value |
|----------|-------|
| **Breakpoint** | ≤768px viewport width |
| **Animation** | Character-by-character opacity reveal |
| **Typing Speed** | 80ms stagger between characters |
| **Cursor** | Blinking `|` in accent color (#10b981) |
| **Font Weight** | 700 (bolder on mobile) |
| **Desktop** | Original slide-up + blur animation unchanged |

**Files Modified:**
- `src/components/utils/initialFX.ts` (lines 17-79) - Mobile detection + typewriter GSAP animation
- `src/components/styles/Landing.css` (lines 318-346) - Blinking cursor CSS + font-weight

**Implementation:**
```typescript
// Mobile detection
const isMobile = window.innerWidth <= 768;

// Typewriter animation
gsap.to(taglineSplitter.chars, {
  opacity: 1,
  duration: 0.05,      // Quick reveal per character
  stagger: 0.08,       // Typing speed
  ease: "none",        // Linear for authentic feel
  delay: 0.5,
  onComplete: () => taglineElement.classList.add('typing-complete')
});
```

**CSS Cursor:**
```css
.landing-tagline::after {
  content: '|';
  color: #10b981;
  animation: cursor-blink 0.8s infinite;
}
```

**4. Responsive Layout**
- Desktop (>1024px): Full 3D character, complex animations
- Mobile: Simplified layout, character hidden
- `MainContainer.tsx` handles viewport-based switching

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety (strict mode) |
| Vite | Build tooling |
| Three.js | 3D graphics |
| React Three Fiber | React renderer for Three.js |
| GSAP | Animations |
| ScrollTrigger | Scroll-based animations |
| Lenis | Smooth scrolling |
| CSS Variables | Theming (no framework) |

---

## All Modified Files

| File | Changes |
|------|---------|
| `index.html` | Meta tags, favicon, SEO |
| `src/config.ts` | Developer info, about, projects, skills, careers |
| `src/main.tsx` | ErrorBoundary wrapper |
| `src/components/Landing.tsx` | Personal name, tagline, CTAs, aria-labels |
| `src/components/styles/Landing.css` | CTA buttons, responsive styles |
| `src/components/About.tsx` | Founder story, claims, proof, stable keys |
| `src/components/styles/About.css` | Card layouts, proof grid |
| `src/components/WhatIDo.tsx` | 3 categories, event listener fix, stable keys |
| `src/components/styles/WhatIDo.css` | 3-column layout |
| `src/components/Work.tsx` | Descriptions, CTA, null safety, magic number |
| `src/components/styles/Work.css` | CTA styling |
| `src/components/Career.tsx` | Config-driven manifesto, stable keys, aria-labels |
| `src/components/styles/Career.css` | Manifesto styling |
| `src/components/Contact.tsx` | No duplicate WhatsApp, CSS class, aria-labels |
| `src/components/styles/Contact.css` | Brand highlight class |
| `src/components/ErrorBoundary.tsx` | NEW - Error boundary component |
| `src/components/styles/ErrorBoundary.css` | NEW - Error boundary styles |
| `public/alqode-favicon.svg` | NEW - Alqode favicon |
| `public/images/bochi.webp` | NEW - Project image |
| `public/images/bochi-logo.jpg` | NEW - Project logo |
| `public/images/faida.webp` | NEW - Project image |
| `public/images/faida-logo.jpeg` | NEW - Project logo |
| `src/components/utils/initialFX.ts` | Mobile typewriter animation for hero tagline |
| `src/components/styles/Landing.css` | Blinking cursor CSS, mobile font-weight 700 |

---

## Brand Assets

### Colors
```css
--brand-green: #10b981;
--background-dark: #0a0a0a;
--text-primary: #ffffff;
--text-secondary: #a0a0a0;
```

### Typography
- Primary font: System fonts (to be confirmed)
- Logo: `{alqode}` in navbar

### Logo/Favicon
- Location: `public/alqode-favicon.svg`
- Format: SVG for scalability

---

## Contact Information

| Channel | Value |
|---------|-------|
| **Email** | alqodez@gmail.com |
| **WhatsApp** | +27 68 539 4482 |
| **Instagram** | @alqode.dev |
| **GitHub** | github.com/alqode-dev |
| **Location** | South Africa |
| **Response Time** | Within 2 hours |

---

## Verification Checklist

### Deployment
- [x] Code pushed to GitHub (alqode-dev/alqode-website)
- [x] Vercel connected to repo
- [x] Build passes on Vercel
- [x] DNS configured in Namecheap
- [x] SSL certificate active
- [x] alqode.com resolves correctly
- [x] www.alqode.com redirects to alqode.com

### Personal Brand
- [x] Hero: "Mohammed Hamdaan Dhaler, Founder of Alqode"
- [x] Hero: "I build what others can't."
- [x] Hero: CTA buttons work
- [x] About: Founder story section
- [x] About: "20+ hours/week" and specific claims
- [x] About: Proof/results mentioned
- [x] Services: 3 categories (Build, Automate, Support & Scale)
- [x] Portfolio: Problem → result descriptions
- [x] Portfolio: "Ready to be next?" CTA
- [x] Careers: Manifesto headline + positions
- [x] Contact: "Based in South Africa"
- [x] Contact: "We reply within 2 hours"
- [x] Contact: WhatsApp as primary
- [x] Navbar: Still says "{alqode}"

### Code Quality (9/10)
- [x] Event listener leak fixed
- [x] Null safety added
- [x] Magic numbers documented
- [x] No inline styles
- [x] Config-driven content
- [x] Stable keys (no index keys)
- [x] Error boundary protection
- [x] Aria labels for accessibility
- [x] Build passes

### Mobile (TO DO)
- [ ] All breakpoints tested
- [ ] Touch interactions work
- [ ] Performance acceptable on mobile
- [ ] No horizontal overflow
- [ ] Readable typography

---

## Future Enhancements

### High Priority
- [ ] Mobile responsive fixes (see Mobile UI Issues section)
- [ ] Lighthouse performance audit
- [ ] Image optimization (WebP, lazy loading)

### Medium Priority
- [ ] Image loading states for Work section
- [ ] GSAP animations extracted to custom hooks
- [ ] Contact form functionality (if needed)

### Low Priority
- [ ] Analytics integration
- [ ] Blog/content section
- [ ] Multi-language support

---

## Troubleshooting

### Build Fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### DNS Not Propagating
- Wait up to 48 hours (usually 5-30 minutes)
- Check with: https://dnschecker.org/#A/alqode.com
- Clear browser cache

### 3D Model Not Loading
- Check browser console for errors
- Verify `public/models/` contains GLB files
- Check Three.js/R3F compatibility

### Vercel Deploy Stuck
- Check Vercel dashboard for build logs
- Verify `npm run build` works locally
- Check for environment variable issues

---

*This document tracks the Alqode website project from development through deployment.*
*Last deployment: January 23, 2026*
*Working Directory: `C:\Users\hamda\OneDrive\Desktop\Huzaif-Ahmed-Portfolio-Sixth`*
