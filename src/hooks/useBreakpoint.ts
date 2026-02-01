import { useState, useEffect } from "react";

// Breakpoint constants matching CSS variables in index.css
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1400,
} as const;

export interface BreakpointState {
  isMobile: boolean;    // <= 480px
  isTablet: boolean;    // <= 768px
  isDesktop: boolean;   // > 1024px
  isWide: boolean;      // >= 1400px
  width: number;
}

/**
 * Hook to detect current breakpoint
 * Updates on window resize
 */
export function useBreakpoint(): BreakpointState {
  const [state, setState] = useState<BreakpointState>(() => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1024;
    return {
      isMobile: width <= BREAKPOINTS.mobile,
      isTablet: width <= BREAKPOINTS.tablet,
      isDesktop: width > BREAKPOINTS.desktop,
      isWide: width >= BREAKPOINTS.wide,
      width,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setState({
        isMobile: width <= BREAKPOINTS.mobile,
        isTablet: width <= BREAKPOINTS.tablet,
        isDesktop: width > BREAKPOINTS.desktop,
        isWide: width >= BREAKPOINTS.wide,
        width,
      });
    };

    // Call once on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return state;
}

export default useBreakpoint;
