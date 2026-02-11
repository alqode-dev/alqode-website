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
        muted: "#666666",
        "light-bg": "#f5f5f0",
        "light-muted": "#444444",
        "card-bg": "#161616",
        border: "#2a2a2a",
        "dim-bg": "#111111",
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
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
