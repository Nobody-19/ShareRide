import type { Config } from "tailwindcss";

function ramp(name: string, steps: number[]) {
  const scale: Record<string, string> = {};
  for (const step of steps) {
    scale[step] = `oklch(var(--${name}-${step}) / <alpha-value>)`;
  }
  return scale;
}

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "oklch(var(--primary-600) / <alpha-value>)",
          ...ramp("primary", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary-600) / <alpha-value>)",
          ...ramp("secondary", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        },
        success: {
          DEFAULT: "oklch(var(--success-500) / <alpha-value>)",
          ...ramp("success", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        },
        neutral: ramp("neutral", [0, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        ink: "oklch(var(--ink) / <alpha-value>)",
        surface: "oklch(var(--surface) / <alpha-value>)",
        bg: "oklch(var(--bg) / <alpha-value>)",
        card: "oklch(var(--card) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "0.625rem",
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        xs: "0 1px 2px oklch(var(--neutral-900) / 0.04)",
        soft: "0 1px 2px oklch(var(--neutral-900) / 0.03), 0 1px 1px oklch(var(--neutral-900) / 0.04)",
        card: "0 4px 12px oklch(var(--neutral-900) / 0.06), 0 1px 2px oklch(var(--neutral-900) / 0.05)",
        popover: "0 12px 32px oklch(var(--neutral-900) / 0.12), 0 2px 6px oklch(var(--neutral-900) / 0.06)",
      },
      transitionTimingFunction: {
        snap: "cubic-bezier(0.2, 0, 0, 1)",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "rise-in": { "0%": { opacity: "0", transform: "translateY(6px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        "fade-in": "fade-in 0.15s cubic-bezier(0.2,0,0,1) both",
        "rise-in": "rise-in 0.18s cubic-bezier(0.2,0,0,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
