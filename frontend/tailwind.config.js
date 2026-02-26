/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "oklch(var(--card) / <alpha-value>)",
          foreground: "oklch(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "oklch(var(--popover) / <alpha-value>)",
          foreground: "oklch(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground) / <alpha-value>)",
        },
        border: "oklch(var(--border) / <alpha-value>)",
        input: "oklch(var(--input) / <alpha-value>)",
        ring: "oklch(var(--ring) / <alpha-value>)",
        chart: {
          "1": "oklch(var(--chart-1) / <alpha-value>)",
          "2": "oklch(var(--chart-2) / <alpha-value>)",
          "3": "oklch(var(--chart-3) / <alpha-value>)",
          "4": "oklch(var(--chart-4) / <alpha-value>)",
          "5": "oklch(var(--chart-5) / <alpha-value>)",
        },
        // Brand tokens — Color Hunt Maroon/Red palette
        // #632626 dark maroon, #9d5353 deep red, #bf8b67 warm tan, #dacc96 light gold
        maroon: {
          50:  "oklch(0.96 0.02 15)",
          100: "oklch(0.90 0.04 15)",
          200: "oklch(0.80 0.06 15)",
          300: "oklch(0.68 0.08 15)",
          400: "oklch(0.56 0.10 15)",
          500: "oklch(0.46 0.10 15)",
          600: "oklch(0.38 0.10 15)",
          700: "oklch(0.30 0.10 15)",
          800: "oklch(0.24 0.09 15)",
          900: "oklch(0.18 0.07 15)",
        },
        tan: {
          50:  "oklch(0.97 0.02 60)",
          100: "oklch(0.93 0.04 55)",
          200: "oklch(0.88 0.05 50)",
          300: "oklch(0.80 0.07 48)",
          400: "oklch(0.72 0.08 46)",
          500: "oklch(0.64 0.08 45)",
          600: "oklch(0.56 0.07 43)",
          700: "oklch(0.48 0.07 42)",
          800: "oklch(0.40 0.06 40)",
          900: "oklch(0.32 0.05 38)",
        },
        gold: {
          50:  "oklch(0.97 0.03 88)",
          100: "oklch(0.94 0.05 87)",
          200: "oklch(0.91 0.06 86)",
          300: "oklch(0.88 0.07 85)",
          400: "oklch(0.84 0.07 85)",
          500: "oklch(0.80 0.08 84)",
          600: "oklch(0.74 0.08 83)",
          700: "oklch(0.66 0.07 82)",
          800: "oklch(0.56 0.06 80)",
          900: "oklch(0.44 0.05 78)",
        },
        cream: {
          50:  "oklch(0.99 0.003 60)",
          100: "oklch(0.97 0.006 60)",
          200: "oklch(0.94 0.010 58)",
          300: "oklch(0.90 0.014 56)",
        },
      },
      fontFamily: {
        serif: ["'Noto Serif Devanagari'", "serif"],
        sans: ["'Noto Sans Devanagari'", "sans-serif"],
        display: ["'Cinzel'", "serif"],
        devanagari: ["'Noto Serif Devanagari'", "'Noto Sans Devanagari'", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "0.75rem",
        "2xl": "1rem",
      },
      boxShadow: {
        card: "0 2px 12px 0 oklch(0.30 0.10 15 / 0.10)",
        "card-hover": "0 6px 24px 0 oklch(0.30 0.10 15 / 0.18)",
        gold: "0 2px 12px 0 oklch(0.84 0.07 85 / 0.30)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};
