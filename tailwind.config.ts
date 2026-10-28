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
        brand: {
          indigo: "#4F46E5",
          "indigo-dark": "#6366F1",
          charcoal: "#0F172A",
          saffron: "#F97316",
        },
        surface: {
          bg: "#0A0D14",
          card: "#111622",
          elevated: "#182030",
          border: "#1E293B",
        },
        status: {
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "'Plus Jakarta Sans'", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        card: "18px",
        ticket: "20px",
        button: "12px",
      },
      boxShadow: {
        glow: "0 0 24px rgba(79, 70, 229, 0.25)",
        "glow-saffron": "0 0 24px rgba(249, 115, 22, 0.25)",
        "glow-emerald": "0 0 24px rgba(16, 185, 129, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;

