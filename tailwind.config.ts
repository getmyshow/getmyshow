import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Eventbrite Warm Discovery System
        eb: {
          linen: "var(--color-warm-linen)",
          aubergine: "var(--color-aubergine-ink)",
          plum: "var(--color-plum-depth)",
          mist: "var(--color-soft-mist)",
          iris: "var(--color-electric-iris)",
          ember: "var(--color-ember-orange)",
          smoke: "var(--color-smoke)",
          cloud: "var(--color-cloud-veil)",
          silver: "var(--color-pale-silver)",
        },
        // Brand & Accent Colors
        brand: {
          indigo: "var(--color-indigo)",
          "indigo-dark": "var(--color-indigo-dark)",
          charcoal: "var(--color-charcoal)",
          saffron: "var(--color-saffron)",
        },
        surface: {
          bg: "var(--bg-app)",
          card: "var(--surface-card)",
          elevated: "var(--surface-elevated)",
          border: "var(--surface-border)",
        },
        text: {
          primary: "var(--text-primary)",
          muted: "var(--text-muted)",
          dim: "var(--text-dim)",
        },
        status: {
          success: "var(--color-success)",
          warning: "var(--color-warning)",
          danger: "var(--color-danger)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "'Plus Jakarta Sans'", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        "card-soft": "40px",
        ticket: "20px",
        pill: "360px",
        nav: "100px",
        button: "12px",
      },
      boxShadow: {
        glow: "0 0 24px rgba(79, 70, 229, 0.18)",
        "glow-saffron": "0 0 24px rgba(249, 115, 22, 0.18)",
        "glow-emerald": "0 0 24px rgba(16, 185, 129, 0.18)",
        card: "0 2px 12px -2px rgba(30, 10, 60, 0.05)",
        ticket: "0 10px 30px -5px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
