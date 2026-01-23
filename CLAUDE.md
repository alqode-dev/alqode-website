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
- `src/utils/textSplitter.ts` provides text splitting for character/word/line animations (custom replacement for GSAP SplitText)
- Lenis smooth scroll integrated in Navbar.tsx

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
