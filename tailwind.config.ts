import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0a0a0a",
        terminal: "#10b981",
        "live-amber": "#FFB81C",
        "signal-red": "#FF4D4D",
        bone: "#F5F1EA",
        muted: "#8a8a8a",
        "light-bg": "#f5f5f0",
        "light-muted": "#444444",
        "card-bg": "#161616",
        border: "#2a2a2a",
        "dim-bg": "#111111",
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        display: ["var(--font-instrument-serif)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        snap: "cubic-bezier(.16, 1, .3, 1)",
        "out-quart": "cubic-bezier(.25, 1, .5, 1)",
        "spring-soft": "cubic-bezier(.34, 1.56, .64, 1)",
      },
      animation: {
        "live-pulse": "live-pulse 2.4s cubic-bezier(.16, 1, .3, 1) infinite",
        scanline: "scanline 3s linear infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(.16, 1, .3, 1) both",
      },
      keyframes: {
        "live-pulse": {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(2.2)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      screens: {
        xs: "375px",
        sm: "480px",
        md: "768px",
        lg: "1024px",
        xl: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
