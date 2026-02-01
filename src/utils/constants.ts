/**
 * Application Constants
 * Centralized constants for consistency across the codebase
 */

// Breakpoints (match CSS variables in tokens.css)
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1400,
} as const;

// Animation durations in milliseconds
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 800,
  slowest: 1200,
} as const;

// Z-index scale (match CSS variables in tokens.css)
export const Z_INDEX = {
  base: 1,
  dropdown: 10,
  sticky: 100,
  fixed: 200,
  modalBackdrop: 500,
  modal: 600,
  popover: 700,
  tooltip: 800,
  loading: 9000,
  skipLink: 10000,
} as const;

// Common CSS selectors used across the app
export const SELECTORS = {
  header: ".header",
  main: "main",
  landing: "#landingDiv",
  about: "#about",
  work: "#work",
  contact: "#contact",
  techstack: ".techstack",
  loadingScreen: ".loading-screen",
  mobileMenu: ".navbar-mobile-menu",
} as const;

// Lenis smooth scroll configuration
export const LENIS_CONFIG = {
  duration: 1.7,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical" as const,
  gestureOrientation: "vertical" as const,
  smoothWheel: true,
  wheelMultiplier: 1.7,
  touchMultiplier: 1.3,
  infinite: false,
} as const;

// Character model configuration
export const CHARACTER_CONFIG = {
  cameraPosition: { x: 0, y: 13.1, z: 24.7 },
  cameraFov: 14.5,
  cameraZoom: 1.1,
} as const;

// Loading screen configuration
export const LOADING_CONFIG = {
  initialDelay: 600,
  loadedDelay: 1000,
  fxDelay: 900,
  lightsDelay: 2500,
} as const;
