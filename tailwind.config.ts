import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        /* ── shadcn/ui design tokens (CSS-variable-backed) ──────── */
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        /* ── Natural condition palette ──────────────────────────── */
        sage: {
          50:  "#f1f6f3",
          100: "#dce9e2",
          200: "#bad4c6",
          300: "#93b8a4",
          400: "#6f9d83",
          500: "#508368",
          600: "#3f6c56",
          700: "#335846",
          800: "#2a4839",
          900: "#22392e",
        },
        clay: {
          50:  "#fdf3ef",
          100: "#fae1d3",
          200: "#f5bfa4",
          300: "#ec9470",
          400: "#df6a42",
          500: "#c2502b",
          600: "#a43f21",
          700: "#88321a",
          800: "#6d2817",
          900: "#5a2115",
        },
        honey: {
          50:  "#fdf8ea",
          100: "#faecc7",
          200: "#f4d38d",
          300: "#eab54a",
          400: "#da961e",
          500: "#bf7c0f",
          600: "#9e650c",
          700: "#83510c",
          800: "#69410e",
          900: "#57350f",
        },
        forest: {
          50:  "#edf4ef",
          100: "#d3e8d8",
          200: "#a6d2b2",
          300: "#72b487",
          400: "#429464",
          500: "#277a4a",
          600: "#1e633b",
          700: "#185031",
          800: "#144029",
          900: "#103421",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
